import math
from typing import List, Optional, Dict, Any, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_
from geoalchemy2.functions import ST_DistanceSphere, ST_MakePoint, ST_SetSRID

from app.db.models import (
    WorkerProfile, WorkerLocation, Task, WorkerStatus, 
    TaskStatus, TaskAssignment, TaskPriority
)

class DispatchEngine:
    """
    Algorithmic Multi-Factor Worker Dispatch Engine for Event Operations Platform.
    Calculates weighted candidate scores based on location proximity, skill match,
    battery, network quality, active workload, and zone assignment.
    """
    
    # Weights for scoring algorithm (sum up to 1.0)
    WEIGHT_DISTANCE = 0.35
    WEIGHT_SKILL = 0.25
    WEIGHT_WORKLOAD = 0.15
    WEIGHT_BATTERY = 0.10
    WEIGHT_NETWORK = 0.05
    WEIGHT_ZONE = 0.10

    NETWORK_SCORES = {
        "5G": 1.0,
        "WIFI": 1.0,
        "4G": 0.8,
        "3G": 0.4,
        "2G": 0.1,
        "OFFLINE": 0.0
    }

    @classmethod
    def calculate_distance_score(cls, distance_meters: float, max_radius_meters: float = 5000.0) -> float:
        """Normalized score where 0 meters = 1.0, max_radius meters = 0.0"""
        if distance_meters >= max_radius_meters:
            return 0.0
        return max(0.0, 1.0 - (distance_meters / max_radius_meters))

    @classmethod
    def calculate_skill_score(cls, worker_skills: list, required_skills: list) -> float:
        """Percentage of required skills met by worker."""
        if not required_skills:
            return 1.0
        if not worker_skills:
            return 0.0
        
        worker_skill_set = set(str(s).upper() for s in worker_skills)
        req_skill_set = set(str(s).upper() for s in required_skills)
        matched = worker_skill_set.intersection(req_skill_set)
        return len(matched) / len(req_skill_set)

    @classmethod
    def calculate_workload_score(cls, active_tasks: int) -> float:
        """Penalizes workers with existing active tasks."""
        return 1.0 / (1.0 + active_tasks)

    @classmethod
    def calculate_battery_score(cls, battery_level: int) -> float:
        """Returns 0.0 - 1.0 ratio."""
        return max(0.0, min(1.0, battery_level / 100.0))

    @classmethod
    async def find_best_workers(
        cls, 
        db: AsyncSession, 
        task: Task, 
        limit: int = 5
    ) -> List[Tuple[WorkerProfile, float, float]]:
        """
        Queries database for eligible available workers and calculates composite score.
        Returns list of tuples: (WorkerProfile, composite_score, distance_meters)
        """
        # Fetch active workers with valid GPS coordinates
        stmt = (
            select(WorkerProfile, WorkerLocation, ST_DistanceSphere(WorkerLocation.location, task.location).label("distance_meters"))
            .join(WorkerLocation, WorkerProfile.id == WorkerLocation.worker_id)
            .where(
                and_(
                    WorkerProfile.status == WorkerStatus.AVAILABLE,
                    WorkerLocation.is_spoofed == False
                )
            )
        )
        
        results = await db.execute(stmt)
        rows = results.all()
        
        scored_candidates = []
        
        for worker, loc, dist_meters in rows:
            # 1. Distance Score
            dist_score = cls.calculate_distance_score(dist_meters or 999999.0)
            
            # 2. Skill Match Score
            skill_score = cls.calculate_skill_score(worker.skills, task.required_skills)
            if task.required_skills and skill_score == 0:
                # Skip workers with 0 matching required skills if task demands specific skills
                continue
                
            # 3. Workload Score
            workload_score = cls.calculate_workload_score(worker.active_tasks_count)
            
            # 4. Battery Score
            battery_score = cls.calculate_battery_score(worker.battery_level)
            
            # 5. Network Score
            network_score = cls.NETWORK_SCORES.get((worker.network_quality or "").upper(), 0.5)
            
            # 6. Zone Score
            zone_score = 1.0 if (worker.assigned_zone_id and task.zone_id and worker.assigned_zone_id == task.zone_id) else 0.5

            # Composite Score Calculation
            composite_score = (
                cls.WEIGHT_DISTANCE * dist_score +
                cls.WEIGHT_SKILL * skill_score +
                cls.WEIGHT_WORKLOAD * workload_score +
                cls.WEIGHT_BATTERY * battery_score +
                cls.WEIGHT_NETWORK * network_score +
                cls.WEIGHT_ZONE * zone_score
            )
            
            scored_candidates.append((worker, composite_score, dist_meters))

        # Sort candidates descending by composite score
        scored_candidates.sort(key=lambda x: x[1], reverse=True)
        return scored_candidates[:limit]

    @classmethod
    async def auto_assign_task(cls, db: AsyncSession, task_id: str) -> Optional[WorkerProfile]:
        """
        Executes dispatch algorithm for a task and assigns the top worker atomically.
        """
        stmt = select(Task).where(Task.id == task_id)
        res = await db.execute(stmt)
        task = res.scalar_one_or_none()
        if not task or task.status not in [TaskStatus.CREATED, TaskStatus.ANALYZED_BY_AI]:
            return None

        candidates = await cls.find_best_workers(db, task, limit=1)
        if not candidates:
            return None

        top_worker, score, dist = candidates[0]
        
        # Update Task State
        task.assigned_worker_id = top_worker.id
        task.status = TaskStatus.DISPATCHED
        task.dispatch_score = score
        
        # Log Assignment
        assignment = TaskAssignment(
            task_id=task.id,
            worker_id=top_worker.id,
            action="DISPATCHED",
            score=score,
            reason=f"Auto-dispatched via DispatchEngine (dist: {int(dist)}m, score: {score:.2f})"
        )
        db.add(assignment)
        
        await db.commit()
        await db.refresh(task)
        return top_worker

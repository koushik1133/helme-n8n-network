import asyncio
import logging
from celery import Celery
from app.core.config import settings

logger = logging.getLogger("celery_worker")

celery_app = Celery(
    "event_ops_worker",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=300
)

@celery_app.task(name="tasks.auto_dispatch_job", bind=True, max_retries=3)
def auto_dispatch_job(self, task_id: str):
    """
    Celery task wrapper triggering asynchronous worker dispatch algorithm.
    """
    logger.info(f"Triggering Celery auto-dispatch job for Task ID: {task_id}")
    try:
        from app.db.session import AsyncSessionLocal
        from app.modules.dispatch.engine import DispatchEngine
        
        async def _run():
            async with AsyncSessionLocal() as db:
                worker = await DispatchEngine.auto_assign_task(db, task_id)
                if worker:
                    logger.info(f"Successfully auto-assigned Task {task_id} to Worker {worker.id}")
                else:
                    logger.warning(f"No available workers found for Task {task_id}")
                    
        loop = asyncio.get_event_loop()
        if loop.is_running():
            asyncio.create_task(_run())
        else:
            loop.run_until_complete(_run())
    except Exception as exc:
        logger.error(f"Error in auto_dispatch_job: {exc}")
        raise self.retry(exc=exc, countdown=10)

@celery_app.task(name="tasks.handle_task_timeout")
def handle_task_timeout(task_id: str):
    """
    Escalates task if worker does not accept within timeout threshold (e.g. 180s).
    """
    logger.info(f"Checking timeout status for Task ID: {task_id}")
    # Timeout check & auto-reassignment logic
    pass

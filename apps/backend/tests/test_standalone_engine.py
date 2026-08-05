import math

# Standalone verification of the core scoring and AI algorithms

class DispatchEngineMath:
    WEIGHT_DISTANCE = 0.35
    WEIGHT_SKILL = 0.25
    WEIGHT_WORKLOAD = 0.15
    WEIGHT_BATTERY = 0.10
    WEIGHT_NETWORK = 0.05
    WEIGHT_ZONE = 0.10

    @classmethod
    def calculate_distance_score(cls, distance_meters: float, max_radius_meters: float = 5000.0) -> float:
        if distance_meters >= max_radius_meters:
            return 0.0
        return max(0.0, 1.0 - (distance_meters / max_radius_meters))

    @classmethod
    def calculate_skill_score(cls, worker_skills: list, required_skills: list) -> float:
        if not required_skills:
            return 1.0
        if not worker_skills:
            return 0.0
        w_set = set(str(s).upper() for s in worker_skills)
        r_set = set(str(s).upper() for s in required_skills)
        matched = w_set.intersection(r_set)
        return len(matched) / len(r_set)

    @classmethod
    def calculate_workload_score(cls, active_tasks: int) -> float:
        return 1.0 / (1.0 + active_tasks)

    @classmethod
    def calculate_battery_score(cls, battery_level: int) -> float:
        return max(0.0, min(1.0, battery_level / 100.0))

class AIEnginePure:
    @classmethod
    def extract_task_from_text(cls, raw_text: str) -> dict:
        text_lower = raw_text.lower()
        category = "CUSTOM"
        if any(w in text_lower for w in ["light", "bulb", "lamp", "dark", "electricity"]):
            category = "LIGHTING"
        elif any(w in text_lower for w in ["doctor", "bleed", "faint", "heart", "sick", "medical", "emergency"]):
            category = "MEDICAL"

        priority = "MEDIUM"
        if any(w in text_lower for w in ["sos", "fire", "blood", "immediate", "emergency"]):
            priority = "EMERGENCY"

        required_skills = []
        if category == "LIGHTING":
            required_skills.append("ELECTRICIAN")
        elif category == "MEDICAL":
            required_skills.append("FIRST_AID_CERTIFIED")

        return {
            "title": raw_text[:80].capitalize(),
            "category": category,
            "priority": priority,
            "required_skills": required_skills
        }

def test_all():
    print("Testing Dispatch Formula...")
    assert DispatchEngineMath.calculate_distance_score(0) == 1.0
    assert DispatchEngineMath.calculate_distance_score(2500) == 0.5
    assert DispatchEngineMath.calculate_distance_score(5000) == 0.0

    print("Testing Skill Formula...")
    assert DispatchEngineMath.calculate_skill_score(["ELECTRICIAN", "AUDIO"], ["ELECTRICIAN"]) == 1.0
    assert DispatchEngineMath.calculate_skill_score(["AUDIO"], ["ELECTRICIAN"]) == 0.0

    print("Testing Workload Score...")
    assert DispatchEngineMath.calculate_workload_score(0) == 1.0
    assert DispatchEngineMath.calculate_workload_score(1) == 0.5

    print("Testing AI Text Extraction...")
    res = AIEnginePure.extract_task_from_text("Emergency! Medical assistance required at Gate 4")
    assert res["category"] == "MEDICAL", f"Category mismatch: {res['category']}"
    assert res["priority"] == "EMERGENCY", f"Priority mismatch: {res['priority']}"
    assert "FIRST_AID_CERTIFIED" in res["required_skills"]

    print("🎉 ALL STANDALONE ALGORITHMIC TESTS PASSED PERFECTLY!")

if __name__ == "__main__":
    test_all()

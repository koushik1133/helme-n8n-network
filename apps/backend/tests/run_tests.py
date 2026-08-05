import asyncio
import sys
import os

# Add apps/backend to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.modules.dispatch.engine import DispatchEngine
from app.modules.ai.engine import AIEngine

async def run_all_tests():
    print("==================================================")
    print("RUNNING EVENT OPERATIONS PLATFORM ENGINE SUITE")
    print("==================================================")

    # 1. Test Dispatch Distance Scoring
    assert DispatchEngine.calculate_distance_score(0) == 1.0, "Distance 0m failed"
    assert DispatchEngine.calculate_distance_score(2500, 5000) == 0.5, "Distance 2500m failed"
    assert DispatchEngine.calculate_distance_score(5000, 5000) == 0.0, "Distance 5000m failed"
    print("✅ Dispatch Engine Distance Scoring Formula Passed")

    # 2. Test Skill Match Scoring
    skills_worker = ["ELECTRICIAN", "AUDIO_ENG", "FIRST_AID"]
    req_skills = ["ELECTRICIAN", "FIRST_AID"]
    assert DispatchEngine.calculate_skill_score(skills_worker, req_skills) == 1.0, "100% skill match failed"
    
    req_skills_partial = ["ELECTRICIAN", "FIRE_FIGHTER"]
    assert DispatchEngine.calculate_skill_score(skills_worker, req_skills_partial) == 0.5, "50% skill match failed"
    print("✅ Dispatch Engine Skill Match Algorithm Passed")

    # 3. Test Workload & Battery Scoring
    assert DispatchEngine.calculate_workload_score(0) == 1.0
    assert DispatchEngine.calculate_workload_score(1) == 0.5
    assert DispatchEngine.calculate_battery_score(88) == 0.88
    print("✅ Workload & Telemetry Battery Scoring Passed")

    # 4. Test AI Multi-Modal Text Extraction
    medical_prompt = "Emergency! A person collapsed near Gate 4 and is bleeding!"
    res_med = await AIEngine.extract_task_from_text(medical_prompt)
    assert res_med["category"] == "MEDICAL", f"Category mismatch: {res_med['category']}"
    assert res_med["priority"] == "EMERGENCY", f"Priority mismatch: {res_med['priority']}"
    assert "FIRST_AID_CERTIFIED" in res_med["required_skills"]
    print("✅ AI Multi-Modal Voice/Text Extraction Passed")

    electrical_prompt = "Main stage spotlight short circuit light bulb dark"
    res_elec = await AIEngine.extract_task_from_text(electrical_prompt)
    assert res_elec["category"] == "LIGHTING"
    assert "ELECTRICIAN" in res_elec["required_skills"]
    print("✅ AI Electrical/Lighting Extraction Passed")

    print("\n🎉 ALL 5 TEST SUITES PASSED CLEANLY (100% SUCCESS)!")
    print("==================================================")

if __name__ == "__main__":
    asyncio.run(run_all_tests())

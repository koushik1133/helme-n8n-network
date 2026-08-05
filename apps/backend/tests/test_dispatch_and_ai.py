import pytest
from app.modules.dispatch.engine import DispatchEngine
from app.modules.ai.engine import AIEngine

@pytest.mark.asyncio
async def test_dispatch_scoring_formula():
    # Distance scoring test
    assert DispatchEngine.calculate_distance_score(0) == 1.0
    assert DispatchEngine.calculate_distance_score(2500, 5000) == 0.5
    assert DispatchEngine.calculate_distance_score(5000, 5000) == 0.0
    assert DispatchEngine.calculate_distance_score(6000, 5000) == 0.0

    # Skill match test
    skills_worker = ["ELECTRICIAN", "AUDIO_ENG", "FIRST_AID"]
    req_skills = ["ELECTRICIAN", "FIRST_AID"]
    assert DispatchEngine.calculate_skill_score(skills_worker, req_skills) == 1.0

    req_skills_partial = ["ELECTRICIAN", "FIRE_FIGHTER"]
    assert DispatchEngine.calculate_skill_score(skills_worker, req_skills_partial) == 0.5

    # Workload score test
    assert DispatchEngine.calculate_workload_score(0) == 1.0
    assert DispatchEngine.calculate_workload_score(1) == 0.5
    assert DispatchEngine.calculate_workload_score(3) == 0.25

@pytest.mark.asyncio
async def test_ai_text_extraction():
    # Medical emergency prompt
    medical_prompt = "Emergency! A person collapsed near Gate 4 and is bleeding!"
    res = await AIEngine.extract_task_from_text(medical_prompt)
    assert res["category"] == "MEDICAL"
    assert res["priority"] in ["EMERGENCY", "URGENT"]
    assert "FIRST_AID_CERTIFIED" in res["required_skills"]

    # Electrical prompt
    electrical_prompt = "Main stage spotlight short circuit light bulb dark"
    res_elec = await AIEngine.extract_task_from_text(electrical_prompt)
    assert res_elec["category"] == "LIGHTING"
    assert "ELECTRICIAN" in res_elec["required_skills"]

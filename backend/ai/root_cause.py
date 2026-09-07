from backend.ai.ollama_client import generate_response
from backend.ai.prompts import build_root_cause_prompt


def analyze_incident_with_ai(incident: dict) -> str:
    prompt = build_root_cause_prompt(incident)

    response = generate_response(
        prompt,
        temperature=0.2,
    )

    return response
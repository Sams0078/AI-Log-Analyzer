def build_root_cause_prompt(incident: dict) -> str:
    return f"""
You are an AI log analysis assistant.

Analyze the following detected incident from a server log monitoring system.

Incident data:
{incident}

The field "similar_historical_logs" contains logs retrieved
from a FAISS vector database. These are historical logs that
are semantically similar to the current incident.

Use historical logs only as supporting context.
Do not treat them as direct evidence of the current incident.

Your task is to provide:

1. Root Cause
2. Evidence
3. Impact
4. Recommended Action

Rules:
- Use only the information provided.
- Do not invent missing information.
- Clearly distinguish current incident evidence from historical context.
- If the root cause cannot be determined with certainty,
  say that it is a likely or possible cause.
- Keep the response concise and technical.
- Mention relevant metrics such as latency, CPU, memory,
  error rate, request count, or database connections when available.

Return the answer in this format:

Root Cause:
<most likely root cause>

Evidence:
<key evidence from the current incident>

Historical Context:
<relevant pattern found in similar historical logs>

Impact:
<likely impact>

Recommended Action:
<practical action to investigate or resolve the issue>
""".strip()
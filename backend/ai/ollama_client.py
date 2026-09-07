import json
import urllib.request


OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "qwen3:4b"


def generate_response(
    prompt: str,
    temperature: float = 0.2,
):
    """
    Send a prompt to the local Ollama model
    and return the generated response.
    """

    payload = {
        "model": MODEL_NAME,
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": temperature,
        },
    }

    data = json.dumps(payload).encode("utf-8")

    request = urllib.request.Request(
        OLLAMA_URL,
        data=data,
        headers={
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(
            request,
            timeout=120,
        ) as response:

            result = json.loads(
                response.read().decode("utf-8")
            )

        return result.get(
            "response",
            "",
        ).strip()

    except Exception as e:
        raise RuntimeError(
            f"Ollama request failed: {e}"
        )
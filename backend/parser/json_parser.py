import json


def parse_json_file(content: str):
    data = json.loads(content)

    if isinstance(data, dict):
        data = [data]

    return data
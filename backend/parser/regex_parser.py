import re
from datetime import datetime


LOG_PATTERN = re.compile(
    r"(?P<timestamp>\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2})"
    r"\s+\[(?P<level>[A-Z]+)\]"
    r"\s+(?P<service>[\w.-]+)"
    r"\s*-\s*(?P<message>.*)"
)


def parse_log_line(line: str):
    match = LOG_PATTERN.match(line.strip())

    if not match:
        return None

    data = match.groupdict()

    return {
        "timestamp": datetime.fromisoformat(data["timestamp"]),
        "level": data["level"],
        "service": data["service"],
        "message": data["message"],
    }


def parse_log_file(content: str):
    logs = []

    for line in content.splitlines():
        parsed = parse_log_line(line)

        if parsed:
            logs.append(parsed)

    return logs
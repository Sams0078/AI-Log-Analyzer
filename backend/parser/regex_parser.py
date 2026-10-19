
import re
from datetime import datetime, timezone


TIMESTAMP_RE = re.compile(
    r"\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}"
    r"(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?"
)

LEVELS = {
    "DEBUG", "INFO", "WARN", "WARNING",
    "ERROR", "CRITICAL", "FATAL", "TRACE"
}

FIELD_RE = re.compile(
    r"""([A-Za-z_][\w.-]*)\s*=\s*"""
    r"""("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\S+)"""
)


def parse_log_line(line: str):
    line = line.strip()

    if not line or line.startswith("#"):
        return None

    # Remove optional record ID before the timestamp.
    line = re.sub(
        r"^\d+\s+(?=\d{4}-\d{2}-\d{2})",
        "",
        line
    )

    timestamp_match = TIMESTAMP_RE.search(line)
    if not timestamp_match:
        return None

    try:
        timestamp_text = timestamp_match.group()
        timestamp = datetime.fromisoformat(
            timestamp_text.replace("Z", "+00:00")
        )

        if timestamp.tzinfo is not None:
            timestamp = timestamp.astimezone(timezone.utc)
            timestamp = timestamp.replace(tzinfo=None)
    except ValueError:
        return None

    # Parse key=value fields, including fields joined without whitespace.
    fields = {}
    for match in FIELD_RE.finditer(line):
        key = match.group(1).lower()
        value = match.group(2)

        if (
            len(value) >= 2
            and value[0] == value[-1]
            and value[0] in ("'", '"')
        ):
            value = value[1:-1]

        fields[key] = value

    # Detect log level.
    level_match = re.search(
        r"\[(DEBUG|INFO|WARN|WARNING|ERROR|CRITICAL|FATAL|TRACE)\]"
        r"|\blevel\s*=\s*(DEBUG|INFO|WARN|WARNING|ERROR|CRITICAL|FATAL|TRACE)\b"
        r"|\b(DEBUG|INFO|WARN|WARNING|ERROR|CRITICAL|FATAL|TRACE)\b",
        line,
        re.IGNORECASE
    )

    level = "INFO"
    if level_match:
        level = next(
            (group for group in level_match.groups() if group),
            "INFO"
        ).upper()

    if level == "WARN":
        level = "WARNING"

    # Detect service/component.
    service = (
        fields.get("service")
        or fields.get("component")
        or fields.get("logger")
        or fields.get("application")
        or fields.get("app")
    )

    # Extract message.
    message = (
        fields.get("msg")
        or fields.get("message")
        or fields.get("event")
    )

    # Legacy format:
    # 2026-10-08 08:00:00 [INFO] worker-service - Cache lookup completed
    if not service:
        legacy_match = re.search(
            r"\]\s*([\w.-]+)\s*-\s*(.*)$",
            line
        )
        if legacy_match:
            service = legacy_match.group(1)
            message = message or legacy_match.group(2).strip()

    # Alternative format:
    # 2026-10-08 08:00:00 ERROR payment-service: Request failed
    if not service:
        plain_match = re.search(
            r"\b(?:DEBUG|INFO|WARN|WARNING|ERROR|CRITICAL|FATAL|TRACE)\s+"
            r"([\w.-]+)\s*[:\-]\s*(.*)$",
            line,
            re.IGNORECASE
        )
        if plain_match:
            service = plain_match.group(1)
            message = message or plain_match.group(2).strip()

    service = service or "unknown"

    # Fallback for free-text messages.
    if not message:
        text = line[timestamp_match.end():].strip()

        text = re.sub(
            r"^\[(?:DEBUG|INFO|WARN|WARNING|ERROR|CRITICAL|FATAL|TRACE)\]\s*",
            "",
            text,
            flags=re.IGNORECASE
        )

        text = re.sub(
            r"^(?:level|component|service|request_id|source_ip|duration_ms)"
            r"=\S+\s*",
            "",
            text,
            flags=re.IGNORECASE
        )

        text = re.sub(
            r"\b(?:level|component|service|request_id|source_ip|duration_ms)"
            r"=\S+",
            "",
            text,
            flags=re.IGNORECASE
        ).strip()

        text = re.sub(r"^[\w.-]+\s*-\s*", "", text)
        message = text.strip()

    if not message:
        return None

    # Map duration_ms or latency_ms into the database latency field.
    raw_latency = fields.get("duration_ms") or fields.get("latency_ms")
    try:
        latency_ms = (
            float(raw_latency)
            if raw_latency is not None
            else None
        )
    except (TypeError, ValueError):
        latency_ms = None

    return {
        "timestamp": timestamp,
        "level": level,
        "service": str(service)[:100],
        "message": str(message).strip(),
        "latency_ms": latency_ms,
    }


def parse_log_file(content: str):
    logs = []

    for line in content.splitlines():
        parsed = parse_log_line(line)
        if parsed is not None:
            logs.append(parsed)

    return logs

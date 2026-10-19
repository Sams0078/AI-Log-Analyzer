
import re
import sys
from pathlib import Path

from sqlalchemy import text

from backend.database.database import SessionLocal


LOG_FILE = Path(
    r"C:\Users\Sanya\Downloads\ai_log_analyzer_50000_sample_logs.log"
)

SOURCE = "ai_log_analyzer_50000_sample_logs.log"

DURATION_RE = re.compile(r"\bduration_ms=(\d+(?:\.\d+)?)")


def main():
    if not LOG_FILE.is_file():
        print(f"ERROR: Log file not found: {LOG_FILE}")
        sys.exit(1)

    durations = {}

    with LOG_FILE.open("r", encoding="utf-8") as file:
        for line in file:
            if line.startswith("#") or not line.strip():
                continue

            # Record ID is the first field in this dataset.
            parts = line.split(maxsplit=1)
            if len(parts) != 2 or not parts[0].isdigit():
                continue

            match = DURATION_RE.search(line)
            if match:
                record_id = int(parts[0])
                durations[record_id] = float(match.group(1))

    if not durations:
        print("ERROR: No duration_ms values found. Nothing updated.")
        sys.exit(1)

    print(f"Found {len(durations)} duration values.")
    print("Preview:", list(durations.items())[:5])

    confirmation = input(
        "Update matching existing database rows? Type YES to continue: "
    )

    if confirmation != "YES":
        print("Cancelled. No database changes made.")
        return

    db = SessionLocal()

    try:
        # Match records by their timestamp and service/message because
        # source-file record IDs are not stored in the database.
        updated = 0
        unmatched = 0

        with LOG_FILE.open("r", encoding="utf-8") as file:
            for line in file:
                if line.startswith("#") or not line.strip():
                    continue

                parts = line.split(maxsplit=1)
                if len(parts) != 2 or not parts[0].isdigit():
                    continue

                record_id = int(parts[0])
                duration = durations.get(record_id)

                timestamp_match = re.search(
                    r"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z",
                    line,
                )
                component_match = re.search(
                    r"\bcomponent=([^\s]+)",
                    line,
                )

                if not timestamp_match or not component_match:
                    unmatched += 1
                    continue

                timestamp = timestamp_match.group(0).replace("Z", "")
                service = component_match.group(1)

                result = db.execute(
                    text("""
                        UPDATE logs
                        SET latency_ms = :duration
                        WHERE id = (
                            SELECT id
                            FROM logs
                            WHERE source = :source
                              AND timestamp = CAST(:timestamp AS timestamp)
                              AND service = :service
                              AND latency_ms IS NULL
                            ORDER BY id
                            LIMIT 1
                        )
                    """),
                    {
                        "duration": duration,
                        "source": SOURCE,
                        "timestamp": timestamp,
                        "service": service,
                    },
                )

                updated += result.rowcount

        db.commit()
        print(f"Rows updated: {updated}")
        print(f"Rows unmatched: {unmatched}")

    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()

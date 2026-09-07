from datetime import timedelta


def group_anomalies_into_incidents(
    logs,
    max_gap_minutes=5,
):
    """
    Group nearby anomalous logs into incidents.

    Two anomalies belong to the same incident
    when their timestamps are within max_gap_minutes.
    """

    if not logs:
        return []

    # Keep only anomalies
    anomalies = [
        log
        for log in logs
        if log.get("is_anomaly") == 1
    ]

    if not anomalies:
        return []

    # Sort chronologically
    anomalies.sort(
        key=lambda log: log.get(
            "timestamp"
        )
    )

    incidents = []
    current_incident = []

    max_gap = timedelta(
        minutes=max_gap_minutes
    )

    for log in anomalies:
        timestamp = log.get("timestamp")

        if not current_incident:
            current_incident = [log]
            continue

        previous_timestamp = current_incident[
            -1
        ].get("timestamp")

        if (
            timestamp is not None
            and previous_timestamp is not None
            and timestamp - previous_timestamp
            <= max_gap
        ):
            current_incident.append(log)

        else:
            incidents.append(
                current_incident
            )

            current_incident = [log]

    # Add final incident
    if current_incident:
        incidents.append(
            current_incident
        )

    return [
        build_incident_summary(
            incident,
            incident_id=index + 1,
        )
        for index, incident in enumerate(
            incidents
        )
    ]


def build_incident_summary(
    logs,
    incident_id,
):
    """
    Create a compact summary for an incident.
    """

    services = sorted(
        {
            log.get("service")
            for log in logs
            if log.get("service")
        }
    )

    levels = sorted(
        {
            log.get("level")
            for log in logs
            if log.get("level")
        }
    )

    clusters = sorted(
        {
            log.get("cluster")
            for log in logs
            if log.get("cluster") is not None
        }
    )

    anomaly_types = sorted(
        {
            log.get("anomaly_type")
            for log in logs
            if log.get("anomaly_type")
        }
    )

    timestamps = [
        log.get("timestamp")
        for log in logs
        if log.get("timestamp") is not None
    ]

    return {
        "incident_id": incident_id,
        "start_time": min(timestamps)
        if timestamps
        else None,
        "end_time": max(timestamps)
        if timestamps
        else None,
        "duration_seconds": (
            (
                max(timestamps)
                - min(timestamps)
            ).total_seconds()
            if len(timestamps) >= 2
            else 0
        ),
        "anomaly_count": len(logs),
        "services": services,
        "levels": levels,
        "clusters": clusters,
        "anomaly_types": anomaly_types,
        "logs": logs,
    }
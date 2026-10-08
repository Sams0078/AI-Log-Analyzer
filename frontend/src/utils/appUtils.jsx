export function EmptyRow({ text }) {
  return (
    <tr>
      <td
        colSpan={6}
        className="px-5 py-12 text-center text-xs text-white/25"
      >
        {text}
      </td>
    </tr>
  );
}

export function formatTime(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function formatDateTime(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString([], {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function totalFormat(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function getViewTitle(target) {
  const titles = {
    overview: "Overview",
    account: "User Account",
    activity: "Activity",
    saved: "Saved Investigations",
    bookmarks: "Bookmarks",
    settings: "Settings",
    health: "System Health",
    administrator: "Administrator",
    security: "Audit & Security",
    documentation: "Documentation",
    help: "Help & Feedback",
  };

  return titles[target] || target;
}
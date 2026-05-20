import { BADGE_STYLES, type BadgeStatus } from "@/lib/utils";

interface BadgeProps {
  status: BadgeStatus | string;
}

export function Badge({ status }: BadgeProps) {
  const style =
    BADGE_STYLES[status as BadgeStatus] ?? {
      bg: "#F3F4F6",
      color: "#374151",
      label: status,
    };

  return (
    <span
      style={{
        background: style.bg,
        color: style.color,
        fontSize: 11,
        fontWeight: 600,
        padding: "2px 8px",
        borderRadius: 20,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        whiteSpace: "nowrap",
      }}
    >
      {style.label}
    </span>
  );
}

import type { CSSProperties, ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  style?: CSSProperties;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}

export function Card({ children, style, title, subtitle, action }: CardProps) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        border: "1px solid #E2E8F0",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        ...style,
      }}
    >
      {(title || action) && (
        <div
          style={{
            padding: "16px 20px 0",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div>
            {title && (
              <h3
                style={{
                  margin: 0,
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#1E293B",
                }}
              >
                {title}
              </h3>
            )}
            {subtitle && (
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "#64748B" }}>
                {subtitle}
              </p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div style={{ padding: 20 }}>{children}</div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: string;
  color?: string;
  bg?: string;
  trend?: { value: string; up: boolean };
}

export function StatCard({ label, value, icon, color = "#1E3A8A", bg = "#EEF2FF", trend }: StatCardProps) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        border: "1px solid #E2E8F0",
        padding: "20px",
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
    >
      {icon && (
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, color: "#64748B", fontWeight: 500 }}>
          {label}
        </div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 800,
            color,
            lineHeight: 1.2,
            marginTop: 2,
          }}
        >
          {value}
        </div>
        {trend && (
          <div
            style={{
              fontSize: 11,
              color: trend.up ? "#16A34A" : "#DC2626",
              marginTop: 2,
            }}
          >
            {trend.up ? "↑" : "↓"} {trend.value}
          </div>
        )}
      </div>
    </div>
  );
}

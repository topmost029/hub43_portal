"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BRAND } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(135deg, ${BRAND.darkBlue} 0%, ${BRAND.blue} 60%, ${BRAND.red} 100%)`,
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: "40px 36px",
          width: "100%",
          maxWidth: 420,
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
        }}
      >
        {/* Logo / Brand */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: BRAND.blue,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px",
              fontSize: 22,
              fontWeight: 900,
              color: "#fff",
              letterSpacing: "-1px",
            }}
          >
            H43
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 800,
              color: BRAND.darkBlue,
            }}
          >
            Hub43 Workspace
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748B" }}>
            Sign in to your portal
          </p>
        </div>

        {error && (
          <div
            style={{
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              borderRadius: 8,
              padding: "10px 14px",
              marginBottom: 20,
              fontSize: 13,
              color: "#991B1B",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 600,
                color: "#374151",
                marginBottom: 6,
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              style={{
                width: "100%",
                padding: "10px 14px",
                border: "1.5px solid #E2E8F0",
                borderRadius: 8,
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 600,
                color: "#374151",
                marginBottom: 6,
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{
                width: "100%",
                padding: "10px 14px",
                border: "1.5px solid #E2E8F0",
                borderRadius: 8,
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: loading ? "#94A3B8" : BRAND.blue,
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.2s",
            }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: 20,
            fontSize: 12,
            color: "#94A3B8",
          }}
        >
          Need access? Contact{" "}
          <a
            href="mailto:work@hub43.com"
            style={{ color: BRAND.blue, textDecoration: "none" }}
          >
            work@hub43.com
          </a>
        </p>
      </div>
    </div>
  );
}

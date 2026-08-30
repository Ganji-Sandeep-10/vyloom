"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Login failed.");
      setSubmitting(false);
      return;
    }
    if (data.role !== "ADMIN") {
      setError("This account doesn't have admin access.");
      setSubmitting(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display font-black uppercase text-2xl tracking-tightest text-cream mb-8 text-center">
          VYLOOM <span className="text-electric">Admin</span>
        </h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            required
            type="email"
            placeholder="Admin email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full bg-navy border border-white/15 focus:border-electric text-cream text-sm px-3 py-2.5 outline-none"
          />
          <input
            required
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            className="w-full bg-navy border border-white/15 focus:border-electric text-cream text-sm px-3 py-2.5 outline-none"
          />
          {error && <p className="text-sm text-maroon">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-electric text-ink text-xs tracking-widest2 uppercase font-semibold hover:bg-cream transition-colors disabled:opacity-60"
          >
            {submitting ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

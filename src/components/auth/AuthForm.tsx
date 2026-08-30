"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setSubmitting(false);
        return;
      }
      router.push("/account");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto px-6 py-20">
      <h1 className="font-display font-black uppercase text-2xl tracking-tightest text-charcoal mb-8">
        {mode === "login" ? "Log In" : "Create Account"}
      </h1>
      <form onSubmit={onSubmit} className="space-y-4">
        {mode === "register" && (
          <input
            required
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full bg-mist border border-stroke focus:border-orange text-charcoal text-sm px-3 py-2.5 outline-none rounded-md"
          />
        )}
        <input
          required
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className="w-full bg-mist border border-stroke focus:border-orange text-charcoal text-sm px-3 py-2.5 outline-none rounded-md"
        />
        <input
          required
          type="password"
          minLength={mode === "register" ? 8 : undefined}
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          className="w-full bg-mist border border-stroke focus:border-orange text-charcoal text-sm px-3 py-2.5 outline-none rounded-md"
        />
        {error && <p className="text-sm text-crimson">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-orange text-white text-xs tracking-widest2 uppercase font-semibold hover:bg-charcoal hover:text-white transition-colors disabled:opacity-60 rounded-md"
        >
          {submitting ? "Please wait…" : mode === "login" ? "Log In" : "Create Account"}
        </button>
      </form>
      <p className="text-xs text-charcoal/50 mt-6">
        {mode === "login" ? (
          <>Don&apos;t have an account? <Link href="/register" className="text-orange">Create one</Link></>
        ) : (
          <>Already have an account? <Link href="/login" className="text-orange">Log in</Link></>
        )}
      </p>
    </div>
  );
}

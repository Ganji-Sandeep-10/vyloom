"use client";

import { useState } from "react";

export default function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong.");
        return;
      }
      setStatus("done");
      setMessage(data.alreadySubscribed ? "You're already on the list." : "You're on the list.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className={compact ? "" : "w-full"}>
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="flex-1 min-w-0 bg-white/95 px-4 py-3.5 text-sm text-charcoal placeholder:text-charcoal/40 outline-none rounded-full border border-transparent focus:border-orange transition-colors"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 px-6 py-3.5 text-xs tracking-widest2 uppercase font-bold bg-orange text-white hover:bg-ember transition-colors disabled:opacity-60 rounded-full"
        >
          {status === "loading" ? "…" : "Subscribe"}
        </button>
      </div>
      {message && (
        <p className={`mt-2.5 text-xs ${status === "error" ? "text-crimson" : "text-ember"}`}>
          {message}
        </p>
      )}
    </form>
  );
}

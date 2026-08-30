"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/");
        router.refresh();
      }}
      className="text-xs tracking-widest2 uppercase text-charcoal/60 hover:text-crimson"
    >
      Log Out
    </button>
  );
}

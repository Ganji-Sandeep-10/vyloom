"use client";

import { useRouter } from "next/navigation";

export default function AdminLogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/admin/login");
        router.refresh();
      }}
      className="text-xs tracking-widest2 uppercase text-cream/50 hover:text-maroon"
    >
      Log Out
    </button>
  );
}

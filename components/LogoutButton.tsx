"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * @brief Logout button that calls the API auth logout endpoint.
 */
export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="bg-white p-2 rounded-xl text-sm shadow-md shadow-violet-800 font-semibold"
    >
      <LogOut size={20} />
    </button>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, FileDown } from "lucide-react";

export default function AdminMenu() {
  const pathname = usePathname();
  const usersActive =
    pathname === "/admin" || pathname.startsWith("/admin/");

  return (
    <aside className="w-56 shrink-0 bg-violet-50 p-4">
      <p className="text-xs text-gray-500 px-3 mb-3">Πίνακας διαχείρισης</p>

      <Link
        href="/admin"
        className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-1 ${
          usersActive
            ? "bg-violet-500 text-white"
            : "text-gray-700 hover:bg-violet-100"
        }`}
      >
        <Users size={18} />
        Διαχείριση χρηστών
      </Link>

      <span className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 cursor-not-allowed">
        <FileDown size={18} />
        Εξαγωγή εκδηλώσεων
      </span>
    </aside>
  );
}

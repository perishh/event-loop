"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, FileDown, Brain } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";

export default function AdminMenu() {
  const pathname = usePathname();

  const usersActive =
    pathname === "/admin/users" || pathname.startsWith("/admin/users/");

  const trainActive =
    pathname === "/admin/train" || pathname.startsWith("/admin/train/");

  return (
    <aside className="max-w-96 shrink-0 bg-violet-50 p-4 sticky top-[76px] left-0 max-h-[calc(100dvh-76px)]">
      <Breadcrumb
        breadcrumbItems={[
          { label: "Αρχική", href: "/" },
          { label: "Διαχείριση", href: "/admin" },
        ]}
        className="mb-2"
      />

      <Link
        href="/admin/users"
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

      <Link
        href="/admin/train"
        className={`flex items-center gap-2 px-3 py-2 rounded-lg mt-1 ${
          trainActive
            ? "bg-violet-500 text-white"
            : "text-gray-700 hover:bg-violet-100"
        }`}
      >
        <Brain size={18} />
        Εκπαίδευση μοντέλου συστάσεων
      </Link>
    </aside>
  );
}

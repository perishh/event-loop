import type { ReactNode } from "react";
import AdminMenu from "./components/AdminMenu";
import { requireAdmin } from "@/lib/auth/session";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="flex flex-1">
      <AdminMenu />
      <div className="flex-3">{children}</div>
    </div>
  );
}

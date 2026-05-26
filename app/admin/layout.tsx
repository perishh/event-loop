import type { ReactNode } from "react";
import AdminMenu from "./components/AdminMenu";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AdminMenu />
      <div className="flex-1">{children}</div>
    </div>
  );
}

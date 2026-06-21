import prisma from "@/lib/prisma";
import { USER_ROLE_LABELS } from "@/prisma/mapper";
import Link from "next/link";
import UserActions from "../components/UserActions";

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: [{ approved: "asc" }, { createdAt: "desc" }],
  });

  const pendingCount = users.filter((user) => !user.approved).length;

  return (
    <main className="p-6 flex-1">
      <h1 className="text-xl font-semibold text-gray-900">
        Διαχείριση χρηστών
      </h1>
      <p className="text-sm text-gray-500 mt-1 mb-5">
        {users.length} χρήστες · {pendingCount} εκκρεμείς
      </p>

      {users.length === 0 ? (
        <p>Δεν υπάρχουν χρήστες.</p>
      ) : (
        <ul className="gap-2">
          {users.map((user) => (
            <li
              key={user.id}
              className="flex items-center gap-3 bg-white border border-violet-100 rounded-xl px-4 py-3 mt-2"
            >
              <Link
                href={`/admin/users/${user.id}`}
                className="flex items-center gap-3 flex-1 min-w-0"
              >
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-violet-100 text-violet-700 text-sm font-semibold shrink-0">
                  {user.firstName.charAt(0)}
                  {user.lastName.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 truncate min-w-0">
                      {user.firstName} {user.lastName}
                    </span>
                    <span className="shrink-0 text-xs text-gray-600 border border-gray-300 rounded px-2 py-0.5">
                      {USER_ROLE_LABELS[user.role]}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {user.username} · {user.email}
                  </div>
                </div>
              </Link>

              {user.approved ? (
                <span className="shrink-0 text-xs text-green-700 bg-green-100 rounded px-2 py-1">
                  Εγκεκριμένος
                </span>
              ) : (
                <UserActions userId={user.id} />
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

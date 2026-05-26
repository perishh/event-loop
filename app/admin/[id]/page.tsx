import Link from "next/link";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/session";
import UserActions from "../components/UserActions";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
  });

  return (
    <main className="eventloop-main-page p-6">
      <Link
        href="/admin"
        className="text-sm text-violet-700 hover:underline"
      >
        ← Πίσω στη λίστα
      </Link>

      {!user ? (
        <p className="mt-4 text-gray-600">Ο χρήστης δεν βρέθηκε.</p>
      ) : (
        <section className="bg-violet-50 rounded-2xl shadow-lg shadow-violet-100/80 p-6 mt-4 max-w-2xl">
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-violet-100 text-violet-700 text-lg font-semibold shrink-0">
              {user.firstName.charAt(0)}
              {user.lastName.charAt(0)}
            </div>
            <div>
              <h1 className="font-bold text-2xl text-gray-900">
                {user.firstName} {user.lastName}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-600 border border-gray-300 rounded px-2 py-0.5">
                  {user.role}
                </span>
                {user.approved ? (
                  <span className="text-xs text-green-700 bg-green-100 rounded px-2 py-0.5">
                    Εγκεκριμένος
                  </span>
                ) : (
                  <span className="text-xs text-amber-700 bg-amber-100 rounded px-2 py-0.5">
                    Εκκρεμεί έγκριση
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Όνομα χρήστη</p>
              <p className="text-sm text-gray-900">{user.username}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm text-gray-900">{user.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">ΑΦΜ</p>
              <p className="text-sm text-gray-900">{user.afm}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Περιοχή</p>
              <p className="text-sm text-gray-900">{user.area}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Πόλη</p>
              <p className="text-sm text-gray-900">{user.city}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Χώρα</p>
              <p className="text-sm text-gray-900">{user.country}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Ημερομηνία εγγραφής</p>
              <p className="text-sm text-gray-900">
                {user.createdAt.toLocaleString("el-GR")}
              </p>
            </div>
          </div>

          {!user.approved && (
            <div className="border-t border-violet-100 mt-6 pt-4">
              <UserActions userId={user.id} />
            </div>
          )}
        </section>
      )}
    </main>
  );
}

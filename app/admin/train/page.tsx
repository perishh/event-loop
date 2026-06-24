import {
  Activity,
  Clock,
  Database,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { getModelStatus } from "@/lib/recommendation/status";
import { getSession } from "@/lib/auth/session";
import { UserRole } from "@/app/generated/prisma/enums";
import StatusCard from "./components/StatusCard";
import TrainForm from "./components/TrainForm";

export default async function TrainPage() {
  const session = await getSession();
  const isAdmin = session?.role === UserRole.ADMIN;
  const status = isAdmin ? await getModelStatus() : null;

  return (
    <main className="p-6 flex-1">
      <h1 className="text-xl font-semibold text-gray-900">
        Εκπαίδευση μοντέλου συστάσεων
      </h1>
      <p className="text-sm text-gray-500 mt-1 mb-6">
        Διαχειριστείτε το μοντέλο συστάσεων εκδηλώσεων — δείτε την κατάστασή
        του, ρυθμίστε τις παραμέτρους και εκπαιδεύστε το ξανά.
      </p>

      {status ? (
        <>
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Activity size={20} className="text-violet-500" />
              Κατάσταση μοντέλου
            </h2>

            {!status.exists ? (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-sm">
                Το μοντέλο δεν έχει εκπαιδευτεί ακόμα. Πατήστε «Εκπαίδευση» για
                να ξεκινήσετε.
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                <StatusCard
                  icon={Clock}
                  label="Τελευταία ενημέρωση"
                  value={
                    status.updatedAt
                      ? status.updatedAt.toLocaleString("el-GR")
                      : "—"
                  }
                />
                <StatusCard
                  icon={Target}
                  label="Global Mean"
                  value={status.globalMean?.toFixed(4) ?? "—"}
                />
                <StatusCard
                  icon={Users}
                  label="Χρήστες"
                  value={status.userCount.toLocaleString("el-GR")}
                />
                <StatusCard
                  icon={Database}
                  label="Εκδηλώσεις"
                  value={status.eventCount.toLocaleString("el-GR")}
                />
                <StatusCard
                  icon={TrendingUp}
                  label="Επισκέψεις"
                  value={status.visitCount.toLocaleString("el-GR")}
                />
                <StatusCard
                  icon={TrendingUp}
                  label="Κρατήσεις"
                  value={status.bookingCount.toLocaleString("el-GR")}
                />
              </div>
            )}
          </section>
          <TrainForm />
        </>
      ) : (
        <p className="text-sm text-red-600">
          Δεν έχετε πρόσβαση σε αυτή τη σελίδα.
        </p>
      )}
    </main>
  );
}

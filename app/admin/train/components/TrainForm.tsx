"use client";

import { useState } from "react";
import InputField from "@/components/InputField";
import { Brain, RefreshCw } from "lucide-react";
import { TrainHyperparamsSchema } from "../schema";
import { useRouter } from "next/navigation";

export default function TrainForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    if (loading) return;
    e.preventDefault();

    setLoading(true);
    setSuccess(false);
    setError("");

    const formData = new FormData(e.currentTarget);
    const rawInput = Object.fromEntries(formData.entries());
    const validationResult = TrainHyperparamsSchema.safeParse(rawInput);

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      setError(firstError.message);
      setLoading(false);
      return;
    }

    const res = await fetch("/api/admin/train", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rawInput),
    });

    const result = await res.json();

    if (!result.success) {
      setError(result.error);
    } else {
      setSuccess(true);
      setError("");
      router.refresh();
    }

    setLoading(false);
  };

  return (
    <section className="bg-violet-50 rounded-2xl shadow-lg shadow-violet-100/80 p-6 max-w-2xl mt-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Brain size={20} className="text-violet-500" />
        Εκπαίδευση μοντέλου
      </h2>

      <form onSubmit={submit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <InputField
              id="epochs"
              name="epochs"
              label="Εποχές"
              type="number"
              defaultValue={200}
              min={1}
              max={10000}
              step={1}
              placeholder="Αριθμός επαναλήψεων εκπαίδευσης"
            />
            <p className="text-xs text-gray-400 mt-0.5">
              Αριθμός επαναλήψεων εκπαίδευσης
            </p>
          </div>
          <div>
            <InputField
              id="latentFactorsCount"
              name="latentFactorsCount"
              label="Λανθάνοντες παράγοντες"
              type="number"
              defaultValue={10}
              min={1}
              max={200}
              step={1}
              placeholder="Διάσταση λανθανόντων παραγόντων"
            />
            <p className="text-xs text-gray-400 mt-0.5">
              Διάσταση λανθανόντων παραγόντων
            </p>
          </div>
          <div>
            <InputField
              id="learningRate"
              name="learningRate"
              label="Ρυθμός εκμάθησης"
              type="number"
              defaultValue={0.005}
              min={0.001}
              max={1}
              step={0.001}
              placeholder="Βήμα βελτιστοποίησης"
            />
            <p className="text-xs text-gray-400 mt-0.5">Βήμα βελτιστοποίησης</p>
          </div>
          <div>
            <InputField
              id="regularization"
              name="regularization"
              label="Κανονικοποίηση"
              type="number"
              defaultValue={0.02}
              min={0}
              max={1}
              step={0.001}
              placeholder="Αποφυγή υπερπροσαρμογής"
            />
            <p className="text-xs text-gray-400 mt-0.5">
              Αποφυγή υπερπροσαρμογής
            </p>
          </div>
          <div>
            <InputField
              id="bookingWeight"
              name="bookingWeight"
              label="Βάρος κράτησης"
              type="number"
              defaultValue={3.0}
              min={0}
              max={100}
              step={0.5}
              placeholder="Βαρύτητα αλληλεπίδρασης κράτησης"
            />
            <p className="text-xs text-gray-400 mt-0.5">
              Βαρύτητα αλληλεπίδρασης κράτησης
            </p>
          </div>
          <div>
            <InputField
              id="visitWeight"
              name="visitWeight"
              label="Βάρος επίσκεψης"
              type="number"
              defaultValue={1.0}
              min={0}
              max={100}
              step={0.5}
              placeholder="Βαρύτητα αλληλεπίδρασης επίσκεψης"
            />
            <p className="text-xs text-gray-400 mt-0.5">
              Βαρύτητα αλληλεπίδρασης επίσκεψης
            </p>
          </div>
          <div>
            <InputField
              id="negativePerUser"
              name="negativePerUser"
              label="Αρνητικά δείγματα/χρήστη"
              type="number"
              defaultValue={10}
              min={0}
              max={1000}
              step={1}
              placeholder="Αρνητικά δείγματα ανά χρήστη"
            />
            <p className="text-xs text-gray-400 mt-0.5">
              Αρνητικά δείγματα ανά χρήστη
            </p>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {success && (
          <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
            Η εκπαίδευση ολοκληρώθηκε με επιτυχία!
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-violet-600 text-white px-6 py-2.5 rounded-xl hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? (
              <>
                <RefreshCw size={18} className="animate-spin" />
                Εκπαίδευση σε εξέλιξη…
              </>
            ) : (
              <>
                <Brain size={18} />
                Εκπαίδευση μοντέλου
              </>
            )}
          </button>

          {loading && (
            <span className="text-sm text-gray-500">
              Αυτό μπορεί να διαρκέσει αρκετά λεπτά…
            </span>
          )}
        </div>
      </form>
    </section>
  );
}

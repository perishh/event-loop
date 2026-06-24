import { FileDown } from "lucide-react";

export default function ExportPage() {
  return (
    <main className="p-6 flex-1">
      <h1 className="text-xl font-semibold text-gray-900">
        Εξαγωγή εκδηλώσεων
      </h1>
      <p className="text-sm text-gray-500 mt-1 mb-6">
        Εξάγετε όλες τις εκδηλώσεις σε μορφή XML (κατά το πρότυπο DTD) ή σε
        αντίστοιχη μορφή JSON.
      </p>

      <div className="flex flex-wrap gap-3">
        <a
          href="/api/admin/events/export?format=xml"
          className="inline-flex items-center gap-2 bg-violet-500 text-white px-4 py-2 rounded-lg hover:bg-violet-600"
        >
          <FileDown size={18} />
          Εξαγωγή σε XML
        </a>
        <a
          href="/api/admin/events/export?format=json"
          className="inline-flex items-center gap-2 bg-white border border-violet-200 text-violet-700 px-4 py-2 rounded-lg hover:bg-violet-50"
        >
          <FileDown size={18} />
          Εξαγωγή σε JSON
        </a>
      </div>
    </main>
  );
}

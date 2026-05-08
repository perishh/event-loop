import { UserRole } from "@/app/generated/prisma/enums";

interface RoleOption {
  value: string;
  label: string;
}

const roleOptions: RoleOption[] = [
  { value: "", label: "— Επιλέξτε ρόλο —" },
  { value: UserRole.ATTENDEE, label: "Συμμετέχων" },
  { value: UserRole.ORGANIZER, label: "Διοργανωτής" },
];

export default function RoleSelect({ error }: { error?: string }) {
  return (
    <div className="group">
      <label
        htmlFor="register-role"
        className="block text-sm tracking-wide font-semibold mb-1 ml-1 opacity-70 group-focus-within:opacity-100 group-hover:opacity-100 transition-opacity"
      >
        Ρόλος
      </label>

      <select
        id="register-role"
        name="role"
        defaultValue=""
        className={`bg-white w-full pl-3 ring-2 ${error ? "ring-red-300 hover:ring-red-300 focus:ring-red-400" : "ring-violet-200 hover:ring-violet-300 focus:ring-violet-400"} px-3 py-2 rounded-xl outline-0 focus:ring-offset-2 transition-all`}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? "register-role-error" : undefined}
      >
        {roleOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && (
        <p
          id="register-role-error"
          className="text-sm text-red-700 mt-1 ml-1"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

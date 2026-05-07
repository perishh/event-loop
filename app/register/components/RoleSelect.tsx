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
    <div className="eventloop-login-field eventloop-register-field">
      <label htmlFor="register-role" className="eventloop-login-label">
        Ρόλος
      </label>

      <select
        id="register-role"
        name="role"
        defaultValue=""
        className="eventloop-login-input"
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
          className="eventloop-register-field-error"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

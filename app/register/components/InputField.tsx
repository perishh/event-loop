import RegisterField from "./registerField";

export default function InputField({
  registerField,
  error,
}: {
  registerField: RegisterField;
  error?: string;
}) {
  return (
    <div className="eventloop-login-field eventloop-register-field">
      <label htmlFor={registerField.id} className="eventloop-login-label">
        {registerField.label}
      </label>

      <input
        id={registerField.id}
        name={registerField.name}
        type={registerField.type}
        placeholder=" "
        className="eventloop-login-input"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${registerField.id}-error` : undefined}
      />

      {error && (
        <p
          id={`${registerField.id}-error`}
          className="eventloop-register-field-error"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

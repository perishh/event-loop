import LoginField from "./loginField";

export default function InputField({
  loginField,
  error,
}: {
  loginField: LoginField;
  error?: string;
}) {
  return (
    <div className="eventloop-login-field">
      <label htmlFor={loginField.id} className="eventloop-login-label">
        {loginField.label}
      </label>

      <input
        id={loginField.id}
        name={loginField.name}
        type={loginField.type}
        placeholder=" "
        className="eventloop-login-input"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${loginField.id}-error` : undefined}
      />

      {error && (
        <p
          id={`${loginField.id}-error`}
          className="eventloop-register-field-error"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

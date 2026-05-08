import RegisterField from "./registerField";

export default function InputField({
  registerField,
  error,
}: {
  registerField: RegisterField;
  error?: string;
}) {
  return (
    <div className="group">
      <label
        htmlFor={registerField.id}
        className="block text-sm tracking-wide font-semibold mb-1 ml-1 opacity-70 group-focus-within:opacity-100 group-hover:opacity-100 transition-opacity"
      >
        {registerField.label}
      </label>

      <input
        id={registerField.id}
        name={registerField.name}
        type={registerField.type}
        placeholder=" "
        className={`bg-white w-full pl-3 ring-2 ${error ? "ring-red-300 hover:ring-red-300 focus:ring-red-400" : "ring-violet-200 hover:ring-violet-300 focus:ring-violet-400"} px-3 py-2 rounded-xl outline-0 focus:ring-offset-2 transition-all`}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${registerField.id}-error` : undefined}
      />

      {error && (
        <p
          id={`${registerField.id}-error`}
          className="text-sm text-red-700 mt-1 ml-1"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

import { ComponentType, forwardRef, TextareaHTMLAttributes } from "react";
import { LucideProps } from "lucide-react";

interface InputProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label: string;
  name?: string;
  placeholder: string;
  error?: string | null;
  wrapperClassName?: string;
}

const TextareaField = forwardRef<HTMLTextAreaElement, InputProps>(
  (
    { id, name, label, placeholder, error, wrapperClassName = "", ...props },
    ref,
  ) => {
    return (
      <div className={`group ${wrapperClassName}`}>
        <label
          htmlFor={id}
          className="block text-sm tracking-wide font-semibold mb-1 ml-1 opacity-70 group-focus-within:opacity-100 group-hover:opacity-100 transition-opacity"
        >
          {label}
        </label>

        <textarea
          id={id}
          name={name}
          ref={ref}
          {...props}
          placeholder={placeholder}
          className={`bg-white w-full pl-3 ring-2 ${error ? "ring-red-300" : "ring-violet-200"} px-3 py-2 rounded-xl outline-0 focus:ring-offset-2 ${error ? "hover:ring-red-300" : "hover:ring-violet-300"} ${error ? "focus:ring-red-400" : "focus:ring-violet-400"} transition-all`}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
        ></textarea>

        {error && (
          <p
            id={`${id}-error`}
            className="text-sm text-red-700 mt-1 ml-1"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

TextareaField.displayName = "TextareaField";
export default TextareaField;

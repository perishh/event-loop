"use client";

import { useState, useEffect, type ComponentType } from "react";

const BASE =
  "px-3 py-2 rounded-lg transition-all focus:ring-offset-2 outline-0 tracking-wide font-semibold disabled:opacity-50 disabled:cursor-not-allowed";

const THEMES = {
  primary:
    "bg-violet-500 text-white ring-0 hover:ring-2 ring-violet-500 active:ring-offset-1",
  secondary:
    "bg-white text-violet-500 ring-2 ring-violet-500 hover:ring-offset-1",
} as const;

const SPINNER = {
  primary: "border-white/30 border-t-white",
  secondary: "border-violet-300 border-t-violet-600",
} as const;

interface AsyncButtonProps {
  label: string;
  leadingIcon?: ComponentType<{ size?: number }>;
  loading: boolean;
  theme?: "primary" | "secondary";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
  form?: string;
  name?: string;
  value?: string;
  onClick?: () => void;
}

export default function AsyncButton({
  label,
  leadingIcon: Icon,
  loading,
  theme = "primary",
  type = "submit",
  disabled = false,
  className = "",
  form,
  name,
  value,
  onClick,
}: AsyncButtonProps) {
  const [pressed, setPressed] = useState(false);

  // Reset pressed state once the async operation finishes
  useEffect(() => {
    if (!loading) {
      setPressed(false);
    }
  }, [loading]);

  const showSpinner = loading && pressed;

  const handleClick = () => {
    if (!loading && !disabled) {
      setPressed(true);
      onClick?.();
    }
  };

  return (
    <button
      type={type}
      form={form}
      name={name}
      value={value}
      onClick={handleClick}
      disabled={disabled || loading}
      className={`${BASE} ${THEMES[theme]} ${className}`}
    >
      <span className="relative inline-flex items-center justify-center">
        <span
          className={`inline-flex items-center gap-2 ${showSpinner ? "invisible" : ""}`}
        >
          {Icon && <Icon size={18} />}
          {label}
        </span>

        {showSpinner && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span
              className={`w-4 h-4 border-2 rounded-full animate-spin ${SPINNER[theme]}`}
            />
          </span>
        )}
      </span>
    </button>
  );
}

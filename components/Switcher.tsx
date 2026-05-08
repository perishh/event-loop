"use client";

import { useState } from "react";

export type SwitcherState = "left" | "right";

interface SwitcherProps {
  left: {
    value: string;
    label: string;
  };
  right: {
    value: string;
    label: string;
  };
  name: string;
}

export default function Switcher({ left, right, name }: SwitcherProps) {
  const [state, setState] = useState<SwitcherState>("left");

  return (
    <>
      <input
        hidden
        readOnly
        name={name}
        value={state === "left" ? left.value : right.value}
      />

      <div className="grid grid-cols-2 p-1.5 bg-violet-100 rounded-2xl relative tracking-wide w-full inset-shadow-sm">
        <div className="absolute w-full h-full px-1">
          <div
            className={`w-1/2 bg-violet-500 absolute h-[calc(100%-8px)] my-1 ${state === "right" ? "translate-x-[calc(100%-8px)]" : "translate-x-0"} rounded-xl shadow-sm transition-all duration-300 ease-out`}
          />
        </div>
        <button
          type="button"
          onClick={() => setState("left")}
          className={`relative z-10 py-3 rounded-xl text-sm font-bold transition-colors ${
            state === "left" ? "text-white" : "text-gray-500"
          }`}
        >
          {left.label}
        </button>
        <button
          type="button"
          onClick={() => setState("right")}
          className={`relative z-10 py-3 rounded-xl text-sm font-bold transition-colors ${
            state === "right" ? "text-white" : "text-gray-500"
          }`}
        >
          {right.label}
        </button>
      </div>
    </>
  );
}

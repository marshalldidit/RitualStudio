import React, { useState } from "react";
import { SectionLabel } from "./Foundations";
import { ComponentRow } from "./ButtonComponents";
import { Search, Eye, EyeOff, CheckCircle, AlertCircle, X, ChevronDown } from "lucide-react";

/* ─────────────────── TEXT INPUT ─────────────────── */
interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  icon?: React.ReactNode;
  error?: string;
  success?: boolean;
  disabled?: boolean;
  type?: string;
}

export function DSInput({ label, placeholder, value, onChange, icon, error, success, disabled, type = "text" }: InputProps) {
  const [focused, setFocused] = useState(false);
  const [internalVal, setInternalVal] = useState(value ?? "");

  const borderColor = error
    ? "#E84040"
    : success
    ? "#4CAF7D"
    : focused
    ? "#F9C01E"
    : "#EEEEEA";

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <p
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "13px",
            fontWeight: 600,
            color: "#1A1A1A",
          }}
        >
          {label}
        </p>
      )}
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all"
        style={{
          background: disabled ? "#F7F7F5" : "#FFFFFF",
          border: `2px solid ${borderColor}`,
          boxShadow: focused ? `0 0 0 4px ${error ? "rgba(232,64,64,0.1)" : "rgba(249,192,30,0.15)"}` : "none",
        }}
      >
        {icon && <span style={{ color: focused ? "#F9C01E" : "#BBBBBA" }}>{icon}</span>}
        <input
          type={type}
          placeholder={placeholder}
          value={internalVal}
          disabled={disabled}
          onChange={(e) => {
            setInternalVal(e.target.value);
            onChange?.(e.target.value);
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 bg-transparent outline-none"
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "14px",
            color: disabled ? "#BBBBBA" : "#1A1A1A",
          }}
        />
        {success && !error && <CheckCircle size={16} color="#4CAF7D" />}
        {error && <AlertCircle size={16} color="#E84040" />}
      </div>
      {error && (
        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "11px", color: "#E84040" }}>
          {error}
        </p>
      )}
    </div>
  );
}

/* ─────────────────── PASSWORD INPUT ─────────────────── */
export function PasswordInput({ label = "Password" }: { label?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "13px", fontWeight: 600, color: "#1A1A1A" }}>
        {label}
      </p>
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-2xl border-2 border-[#EEEEEA] focus-within:border-[#F9C01E] transition-all"
        style={{ background: "#FFFFFF" }}
      >
        <input
          type={show ? "text" : "password"}
          placeholder="Enter password"
          defaultValue="mysecret123"
          className="flex-1 bg-transparent outline-none"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "14px", color: "#1A1A1A" }}
        />
        <button onClick={() => setShow(!show)} className="active:scale-90">
          {show ? <EyeOff size={16} color="#888886" /> : <Eye size={16} color="#888886" />}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────── SEARCH BAR ─────────────────── */
export function SearchBar({ placeholder = "Search habits, goals..." }: { placeholder?: string }) {
  const [val, setVal] = useState("");
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-full border-2 border-[#EEEEEA] focus-within:border-[#F9C01E] transition-all"
      style={{ background: "#F7F7F5", width: "260px" }}
    >
      <Search size={16} color="#888886" />
      <input
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "14px", color: "#1A1A1A" }}
      />
      {val && (
        <button onClick={() => setVal("")} className="active:scale-90">
          <X size={14} color="#888886" />
        </button>
      )}
    </div>
  );
}

/* ─────────────────── TOGGLE SWITCH ─────────────────── */
interface ToggleProps {
  label?: string;
  description?: string;
  defaultChecked?: boolean;
}

export function DSToggle({ label, description, defaultChecked }: ToggleProps) {
  const [on, setOn] = useState(defaultChecked ?? false);
  return (
    <div className="flex items-center justify-between gap-4">
      {(label || description) && (
        <div className="flex-1">
          {label && (
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "14px", fontWeight: 600, color: "#1A1A1A" }}>
              {label}
            </p>
          )}
          {description && (
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "12px", color: "#888886" }}>
              {description}
            </p>
          )}
        </div>
      )}
      <button
        onClick={() => setOn(!on)}
        className="relative w-12 h-7 rounded-full transition-colors duration-200 active:scale-95 shrink-0"
        style={{ background: on ? "#F9C01E" : "#EEEEEA" }}
      >
        <span
          className="absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all duration-200"
          style={{ left: on ? "calc(100% - 22px)" : "4px" }}
        />
      </button>
    </div>
  );
}

/* ─────────────────── CHECKBOX ─────────────────── */
export function DSCheckbox({ label, checked: defaultChecked }: { label: string; checked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked ?? false);
  return (
    <button
      onClick={() => setChecked(!checked)}
      className="flex items-center gap-3 active:scale-95 transition-transform"
    >
      <div
        className="w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all"
        style={{
          background: checked ? "#F9C01E" : "#FFFFFF",
          borderColor: checked ? "#F9C01E" : "#EEEEEA",
        }}
      >
        {checked && (
          <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
            <path d="M1 4L4.5 7.5L11 1" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "14px", fontWeight: 500, color: "#1A1A1A" }}>
        {label}
      </p>
    </button>
  );
}

/* ─────────────────── SELECT DROPDOWN ─────────────────── */
export function DSSelect({ label, options }: { label: string; options: string[] }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(options[0]);

  return (
    <div className="relative w-[220px]">
      <p
        className="mb-1.5"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "13px", fontWeight: 600, color: "#1A1A1A" }}
      >
        {label}
      </p>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-2xl border-2 transition-all"
        style={{
          background: "#FFFFFF",
          borderColor: open ? "#F9C01E" : "#EEEEEA",
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "14px",
          color: "#1A1A1A",
        }}
      >
        {selected}
        <ChevronDown size={16} color="#888886" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
      </button>
      {open && (
        <div
          className="absolute top-full left-0 right-0 mt-1 rounded-2xl overflow-hidden z-10"
          style={{ background: "#FFFFFF", border: "2px solid #F9C01E", boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}
        >
          {options.map((o) => (
            <button
              key={o}
              onClick={() => { setSelected(o); setOpen(false); }}
              className="w-full text-left px-4 py-3 hover:bg-[#FFF3C4] transition-colors"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "14px",
                fontWeight: selected === o ? 600 : 400,
                color: "#1A1A1A",
                background: selected === o ? "#FFF3C4" : "transparent",
              }}
            >
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────── EXPORT SECTION ─────────────────── */
export function FormComponents() {
  return (
    <section>
      <SectionLabel>Forms & Inputs</SectionLabel>
      <div className="flex flex-col gap-8">

        <ComponentRow label="Text Input — States" desc="Default, focused (yellow border + glow), success, error, disabled">
          <div className="flex flex-col gap-3 w-[240px]">
            <DSInput label="Habit Name" placeholder="e.g. Morning run" />
            <DSInput label="Email" placeholder="you@example.com" success value="tom@example.com" />
            <DSInput label="Goal" placeholder="Your goal" error="This field is required" />
            <DSInput label="Disabled" placeholder="Can't edit this" disabled />
          </div>
        </ComponentRow>

        <ComponentRow label="Password Input" desc="Show/hide toggle for password fields">
          <div className="w-[240px]">
            <PasswordInput />
          </div>
        </ComponentRow>

        <ComponentRow label="Search Bar" desc="Pill-style search with clear button">
          <SearchBar />
        </ComponentRow>

        <ComponentRow label="Toggle Switch" desc="Yellow ON state, gray OFF — used for habit reminders and settings">
          <div className="flex flex-col gap-4 w-[260px] p-1">
            <DSToggle label="Daily Reminders" description="Get notified at your set time" defaultChecked />
            <DSToggle label="Streak Protection" description="Keep your streak on rest days" />
            <DSToggle label="Show Motivation" description="Display daily quotes" defaultChecked />
          </div>
        </ComponentRow>

        <ComponentRow label="Checkboxes" desc="Yellow fill on checked — for goal/habit selection">
          <div className="flex flex-col gap-3">
            <DSCheckbox label="Have more energy" checked />
            <DSCheckbox label="Build muscle / get stronger" checked />
            <DSCheckbox label="Cook more" />
            <DSCheckbox label="Meditate daily" />
          </div>
        </ComponentRow>

        <ComponentRow label="Select Dropdown" desc="Custom dropdown with yellow active border">
          <DSSelect
            label="Habit Category"
            options={["Fitness", "Nutrition", "Mind & Wellness", "Sleep", "Learning", "Creativity"]}
          />
        </ComponentRow>

      </div>
    </section>
  );
}

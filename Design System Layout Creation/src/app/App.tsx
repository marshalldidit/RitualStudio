import "../styles/fonts.css";
import "../styles/ds.css";
import { useState } from "react";
import { ColorPalette, TypographyScale, SpacingAndRadius } from "./components/ds/Foundations";
import { ButtonComponents } from "./components/ds/ButtonComponents";
import { CardComponents } from "./components/ds/CardComponents";
import { CalendarComponents } from "./components/ds/CalendarComponents";
import { GoalComponents } from "./components/ds/GoalComponents";
import { NavigationComponents } from "./components/ds/NavigationComponents";
import { FormComponents } from "./components/ds/FormComponents";
import { MiscComponents } from "./components/ds/MiscComponents";

const sections = [
  { id: "foundations", label: "Foundations" },
  { id: "buttons", label: "Buttons" },
  { id: "cards", label: "Cards" },
  { id: "calendar", label: "Calendar" },
  { id: "goals", label: "Goals" },
  { id: "navigation", label: "Navigation" },
  { id: "forms", label: "Forms" },
  { id: "misc", label: "Misc" },
];

export default function App() {
  const [activeSection, setActiveSection] = useState("foundations");

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(id);
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: "#FAFAF5", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* ── HEADER ── */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{ background: "rgba(250,250,245,0.92)", backdropFilter: "blur(12px)", borderColor: "#EEEEEA" }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo / Title */}
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "#F9C01E" }}
            >
              <span style={{ fontSize: "18px" }}>⚡</span>
            </div>
            <div>
              <p style={{ fontSize: "16px", fontWeight: 800, color: "#1A1A1A", lineHeight: 1 }}>
                RitualStudio
              </p>
              <p style={{ fontSize: "11px", fontWeight: 500, color: "#888886", lineHeight: 1.3 }}>
                Design System v1.0
              </p>
            </div>
          </div>

          {/* Nav Pills */}
          <nav className="hidden md:flex items-center gap-1 overflow-x-auto">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className="px-3 py-1.5 rounded-full transition-all whitespace-nowrap text-sm"
                style={{
                  background: activeSection === s.id ? "#F9C01E" : "transparent",
                  color: activeSection === s.id ? "#1A1A1A" : "#888886",
                  fontWeight: activeSection === s.id ? 700 : 500,
                }}
              >
                {s.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <span
              className="px-3 py-1.5 rounded-full"
              style={{ background: "#FFF3C4", fontSize: "12px", fontWeight: 600, color: "#1A1A1A" }}
            >
              React Native
            </span>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <div
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #F9C01E 0%, #FFE680 60%, #FAFAF5 100%)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5"
                style={{ background: "rgba(26,26,26,0.08)", fontSize: "12px", fontWeight: 600, color: "#1A1A1A" }}
              >
                <span>✦</span> Creative Habit-Forming Product
              </div>
              <h1 style={{ fontSize: "48px", fontWeight: 800, color: "#1A1A1A", lineHeight: 1.1, marginBottom: "12px" }}>
                RitualStudio<br />Design System
              </h1>
              <p style={{ fontSize: "16px", fontWeight: 400, color: "#444442", maxWidth: "500px", lineHeight: 1.7 }}>
                A comprehensive UI design system for a creative habit-forming mobile application.
                Built for React Native with a bold, minimal, yellow-forward aesthetic inspired by clean Scandinavian design principles.
              </p>
              <div className="flex flex-wrap gap-3 mt-6">
                {["Plus Jakarta Sans", "4px Base Grid", "Pill Shapes", "Yellow × Dark", "Mobile-First"].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-full"
                    style={{ background: "rgba(26,26,26,0.1)", fontSize: "12px", fontWeight: 600, color: "#1A1A1A" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Design principles */}
            <div
              className="rounded-3xl p-6 shrink-0 min-w-[260px]"
              style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.8)" }}
            >
              <p style={{ fontSize: "14px", fontWeight: 700, color: "#1A1A1A", marginBottom: "16px" }}>Design Principles</p>
              {[
                { emoji: "🎯", label: "Goal-Driven", desc: "Every screen reinforces motivation" },
                { emoji: "⚡", label: "Energetic", desc: "Bold yellow energizes and excites" },
                { emoji: "✦", label: "Playful Minimal", desc: "Clean spaces with character art" },
                { emoji: "🔥", label: "Streak-Forward", desc: "Habit loops are always visible" },
                { emoji: "📱", label: "Touch-First", desc: "All targets ≥ 44px tap areas" },
              ].map((p) => (
                <div key={p.label} className="flex items-start gap-3 mb-3 last:mb-0">
                  <span style={{ fontSize: "16px" }}>{p.emoji}</span>
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 700, color: "#1A1A1A", lineHeight: 1 }}>{p.label}</p>
                    <p style={{ fontSize: "11px", color: "#888886", lineHeight: 1.4 }}>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* decorative sparkles */}
        <span className="absolute top-8 right-1/3 text-3xl opacity-20 select-none">✦</span>
        <span className="absolute bottom-8 right-1/4 text-xl opacity-20 select-none">✦</span>
        <span className="absolute top-1/2 right-12 text-2xl opacity-15 select-none">✦</span>
      </div>

      {/* ── CONTENT ── */}
      <main className="max-w-6xl mx-auto px-6 py-12 flex flex-col gap-20">

        {/* Foundations */}
        <div id="foundations">
          <SectionGroupHeader
            number="01"
            title="Foundations"
            desc="Core design tokens — the atomic layer every component is built on."
          />
          <div className="flex flex-col gap-16">
            <ColorPalette />
            <TypographyScale />
            <SpacingAndRadius />
          </div>
        </div>

        <Divider />

        {/* Buttons */}
        <div id="buttons">
          <SectionGroupHeader number="02" title="Buttons & Actions" desc="All interactive action components — from pill CTAs to icon buttons and FABs." />
          <ButtonComponents />
        </div>

        <Divider />

        {/* Cards */}
        <div id="cards">
          <SectionGroupHeader number="03" title="Cards & Surfaces" desc="Container components for habits, quotes, onboarding, stats, and progress." />
          <CardComponents />
        </div>

        <Divider />

        {/* Calendar */}
        <div id="calendar">
          <SectionGroupHeader number="04" title="Calendar & Tracking" desc="Day pills, weekly strips, mood selectors, and streak badges." />
          <CalendarComponents />
        </div>

        <Divider />

        {/* Goals */}
        <div id="goals">
          <SectionGroupHeader number="05" title="Goals & Habits" desc="Goal items, category headers, filters, and the goals management section." />
          <GoalComponents />
        </div>

        <Divider />

        {/* Navigation */}
        <div id="navigation">
          <SectionGroupHeader number="06" title="Navigation & System" desc="Bottom tabs, top bars, step progress, and toast notifications." />
          <NavigationComponents />
        </div>

        <Divider />

        {/* Forms */}
        <div id="forms">
          <SectionGroupHeader number="07" title="Forms & Inputs" desc="Text fields, toggles, checkboxes, selects, and search — all states." />
          <FormComponents />
        </div>

        <Divider />

        {/* Misc */}
        <div id="misc">
          <SectionGroupHeader number="08" title="Badges, Avatars & Utilities" desc="Status badges, avatars, achievements, progress rings, skeleton loaders, and empty states." />
          <MiscComponents />
        </div>

      </main>

      {/* ── FOOTER ── */}
      <footer
        className="mt-20 border-t"
        style={{ borderColor: "#EEEEEA", background: "#FFFFFF" }}
      >
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#F9C01E] flex items-center justify-center">
              <span style={{ fontSize: "16px" }}>⚡</span>
            </div>
            <p style={{ fontSize: "14px", fontWeight: 700, color: "#1A1A1A" }}>RitualStudio Design System</p>
          </div>
          <div className="flex gap-6">
            {[
              { label: "8 Sections", icon: "📐" },
              { label: "50+ Components", icon: "🧩" },
              { label: "React Native Ready", icon: "📱" },
              { label: "Plus Jakarta Sans", icon: "🔤" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <span style={{ fontSize: "14px" }}>{item.icon}</span>
                <p style={{ fontSize: "12px", fontWeight: 600, color: "#888886" }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── helpers ── */
function SectionGroupHeader({ number, title, desc }: { number: string; title: string; desc: string }) {
  return (
    <div className="mb-10 flex items-start gap-5">
      <p
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "48px",
          fontWeight: 800,
          color: "#EEEEEA",
          lineHeight: 1,
          minWidth: "60px",
        }}
      >
        {number}
      </p>
      <div>
        <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "28px", fontWeight: 800, color: "#1A1A1A", lineHeight: 1.1 }}>
          {title}
        </h2>
        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "14px", color: "#888886", marginTop: "4px", maxWidth: "500px", lineHeight: 1.6 }}>
          {desc}
        </p>
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 h-px" style={{ background: "#EEEEEA" }} />
      <span style={{ color: "#F9C01E", fontSize: "16px" }}>✦</span>
      <div className="flex-1 h-px" style={{ background: "#EEEEEA" }} />
    </div>
  );
}
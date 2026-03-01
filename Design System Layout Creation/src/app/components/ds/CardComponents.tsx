import React, { useState } from "react";
import { SectionLabel } from "./Foundations";
import { ComponentRow } from "./ButtonComponents";
import { Heart, Share2, Settings, Calendar, ChevronRight, Zap, Apple, Dumbbell, BookOpen, Music, Pencil } from "lucide-react";

/* ─────────────────── ONBOARDING / SPLASH CARD ─────────────────── */
export function OnboardingCard() {
  return (
    <div
      className="w-[220px] rounded-3xl bg-white border border-[#EEEEEA] overflow-hidden flex flex-col items-center pt-8 pb-6 px-5"
      style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}
    >
      {/* Illustration placeholder */}
      <div className="w-full aspect-square rounded-2xl bg-[#FFF3C4] flex items-center justify-center mb-5 relative">
        {/* Decorative sparkles */}
        <span className="absolute top-3 left-5 text-[#1A1A1A] text-lg select-none">✦</span>
        <span className="absolute top-6 right-4 text-[#1A1A1A] text-sm select-none">✦</span>
        <span className="absolute bottom-5 left-3 text-[#1A1A1A] text-xs select-none">✦</span>

        {/* Big stat number */}
        <p
          className="select-none"
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "72px",
            fontWeight: 800,
            color: "#1A1A1A",
            lineHeight: 1,
          }}
        >
          12
        </p>
      </div>

      <p
        className="text-center mb-1"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "17px", fontWeight: 700, color: "#1A1A1A" }}
      >
        Days planned
      </p>
      <p
        className="text-center mb-5"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "13px", fontWeight: 400, color: "#888886" }}
      >
        That's a great start. Check out more to achieve your goals.
      </p>

      <button
        className="w-full py-3 rounded-full bg-[#1A1A1A] text-white text-sm font-semibold transition-all hover:bg-[#333]"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        Continue
      </button>
    </div>
  );
}

/* ─────────────────── QUOTE CARD ─────────────────── */
export function QuoteCard() {
  const [liked, setLiked] = useState(false);
  return (
    <div
      className="w-[260px] rounded-2xl bg-white p-5 border border-[#EEEEEA]"
      style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
    >
      <span style={{ color: "#F9C01E", fontSize: "22px", lineHeight: 1 }}>"</span>
      <p
        className="mt-1 mb-3"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "13px", fontWeight: 400, color: "#1A1A1A", lineHeight: 1.6 }}
      >
        Do not wait until the conditions are perfect to begin. Beginning makes the conditions perfect.
      </p>
      <p
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "12px", fontWeight: 700, color: "#1A1A1A" }}
      >
        — Alan Cohen
      </p>
      <div className="flex items-center gap-2 mt-4">
        <button
          onClick={() => setLiked(!liked)}
          className="transition-transform active:scale-90"
        >
          <Heart
            size={18}
            fill={liked ? "#F9C01E" : "none"}
            stroke={liked ? "#F9C01E" : "#BBBBBA"}
          />
        </button>
        <button className="transition-transform active:scale-90">
          <Share2 size={18} stroke="#BBBBBA" />
        </button>
      </div>
    </div>
  );
}

/* ─────────────────── GREETING HEADER CARD ─────────────────── */
export function GreetingHeader() {
  return (
    <div
      className="w-[280px] rounded-3xl bg-[#F9C01E] p-5"
      style={{ boxShadow: "0 4px 20px rgba(249,192,30,0.35)" }}
    >
      <div className="flex items-start justify-between mb-2">
        <p
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "11px", fontWeight: 500, color: "#1A1A1A", opacity: 0.6 }}
        >
          16 Jul 2024
        </p>
        <Settings size={18} color="#1A1A1A" style={{ opacity: 0.6 }} />
      </div>
      <div className="flex items-center justify-between">
        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "26px", fontWeight: 800, color: "#1A1A1A" }}>
          Hey, <span>Tom!</span>
        </p>
        <button
          className="px-4 py-2 rounded-full bg-[#1A1A1A] text-white text-xs font-semibold"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Plan today
        </button>
      </div>
    </div>
  );
}

/* ─────────────────── STAT CARD ─────────────────── */
interface StatCardProps {
  value: string;
  label: string;
  sub?: string;
  accent?: boolean;
}

export function StatCard({ value, label, sub, accent }: StatCardProps) {
  return (
    <div
      className={`rounded-2xl px-5 py-4 flex flex-col gap-1 min-w-[100px] ${
        accent ? "bg-[#F9C01E]" : "bg-white border border-[#EEEEEA]"
      }`}
      style={{ boxShadow: accent ? "0 4px 20px rgba(249,192,30,0.3)" : "0 2px 8px rgba(0,0,0,0.04)" }}
    >
      <p
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "36px",
          fontWeight: 800,
          color: "#1A1A1A",
          lineHeight: 1,
        }}
      >
        {value}
      </p>
      <p
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "13px", fontWeight: 600, color: "#1A1A1A" }}
      >
        {label}
      </p>
      {sub && (
        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "11px", color: "#888886" }}>{sub}</p>
      )}
    </div>
  );
}

/* ─────────────────── HABIT CARD ─────────────────── */
interface HabitCardProps {
  icon: React.ReactNode;
  name: string;
  category: string;
  streak: number;
  completed?: boolean;
}

export function HabitCard({ icon, name, category, streak, completed }: HabitCardProps) {
  const [done, setDone] = useState(completed ?? false);
  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
        done ? "bg-[#FFF3C4] border-[#F9C01E]" : "bg-white border-[#EEEEEA]"
      }`}
      style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
    >
      <div
        className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
          done ? "bg-[#F9C01E]" : "bg-[#F7F7F5]"
        }`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="truncate"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "14px", fontWeight: 600, color: "#1A1A1A" }}
        >
          {name}
        </p>
        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "11px", color: "#888886" }}>
          {category} · {streak} day streak 🔥
        </p>
      </div>
      <button
        onClick={() => setDone(!done)}
        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all active:scale-90 ${
          done ? "bg-[#1A1A1A] border-[#1A1A1A]" : "border-[#BBBBBA]"
        }`}
      >
        {done && <span className="text-white text-xs">✓</span>}
      </button>
    </div>
  );
}

/* ─────────────────── PROGRESS CARD ─────────────────── */
export function ProgressCard() {
  return (
    <div
      className="w-[260px] rounded-2xl bg-white p-5 border border-[#EEEEEA]"
      style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "15px", fontWeight: 700, color: "#1A1A1A" }}>
          Weekly Progress
        </p>
        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "13px", fontWeight: 600, color: "#F9C01E" }}>
          5/7
        </p>
      </div>

      {/* Progress bar */}
      <div className="h-3 rounded-full bg-[#EEEEEA] overflow-hidden mb-3">
        <div
          className="h-full rounded-full bg-[#F9C01E] transition-all"
          style={{ width: "71%" }}
        />
      </div>

      <div className="flex justify-between">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold transition-all ${
                i < 5
                  ? "bg-[#F9C01E] text-[#1A1A1A]"
                  : "bg-[#F7F7F5] text-[#BBBBBA]"
              }`}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {i < 5 ? "✓" : d}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────── EXPORT SECTION ─────────────────── */
export function CardComponents() {
  return (
    <section>
      <SectionLabel>Cards & Surfaces</SectionLabel>
      <div className="flex flex-col gap-8">

        <ComponentRow label="Onboarding / Splash Card" desc="Full-bleed hero screen with illustration, stat, and CTA">
          <OnboardingCard />
        </ComponentRow>

        <ComponentRow label="Greeting Header Card" desc="Sticky top bar with date, name, settings, and quick CTA">
          <GreetingHeader />
        </ComponentRow>

        <ComponentRow label="Motivational Quote Card" desc="Daily quote with author attribution and like/share actions">
          <QuoteCard />
        </ComponentRow>

        <ComponentRow label="Stat Cards" desc="Big number display for streaks, goals, and progress metrics">
          <StatCard value="12" label="Days planned" accent />
          <StatCard value="8" label="Goals active" sub="4 Fitness · 4 Health" />
          <StatCard value="71%" label="This week" sub="5 of 7 days" />
        </ComponentRow>

        <ComponentRow label="Habit Cards" desc="Individual habit item with icon, streak, and completion toggle">
          <div className="flex flex-col gap-2 w-[260px]">
            <HabitCard icon={<Zap size={18} color="#1A1A1A" />} name="Have more energy" category="Fitness" streak={5} />
            <HabitCard icon={<Dumbbell size={18} color="#1A1A1A" />} name="Build muscle / get stronger" category="Fitness" streak={12} completed />
            <HabitCard icon={<Apple size={18} color="#1A1A1A" />} name="Cook more" category="Nutrition" streak={3} />
          </div>
        </ComponentRow>

        <ComponentRow label="Progress Card" desc="Weekly habit completion overview with mini day-dot tracker">
          <ProgressCard />
        </ComponentRow>

      </div>
    </section>
  );
}

import React, { useState } from "react";
import { SectionLabel } from "./Foundations";
import { ComponentRow } from "./ButtonComponents";
import { Calendar } from "lucide-react";

/* ─────────────────── DAY PILL ─────────────────── */
type DayState = "default" | "today" | "active" | "completed" | "missed" | "rest";

interface DayPillProps {
  date: number;
  day: string;
  state?: DayState;
  mood?: string;
  onClick?: () => void;
}

const dayPillStyles: Record<DayState, { bg: string; border: string; textDate: string; textDay: string; shadow?: string }> = {
  default: { bg: "#F7F7F5", border: "transparent", textDate: "#1A1A1A", textDay: "#888886" },
  today: { bg: "#1A1A1A", border: "#1A1A1A", textDate: "#FFFFFF", textDay: "#BBBBBA", shadow: "0 4px 12px rgba(26,26,26,0.25)" },
  active: { bg: "#F9C01E", border: "#F9C01E", textDate: "#1A1A1A", textDay: "#1A1A1A", shadow: "0 4px 12px rgba(249,192,30,0.4)" },
  completed: { bg: "#FFF3C4", border: "#F9C01E", textDate: "#1A1A1A", textDay: "#888886" },
  missed: { bg: "#FFF0F0", border: "#FFBCBC", textDate: "#E84040", textDay: "#E84040" },
  rest: { bg: "#F7F7F5", border: "transparent", textDate: "#BBBBBA", textDay: "#BBBBBA" },
};

const moodEmojis: Record<string, string> = {
  great: "😄",
  good: "🙂",
  neutral: "😐",
  bad: "😔",
  terrible: "😞",
};

export function DayPill({ date, day, state = "default", mood, onClick }: DayPillProps) {
  const styles = dayPillStyles[state];
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 w-11 py-3 rounded-[22px] border-2 transition-all active:scale-95"
      style={{
        background: styles.bg,
        borderColor: styles.border,
        boxShadow: styles.shadow,
      }}
    >
      {mood ? (
        <span style={{ fontSize: "18px", lineHeight: 1 }}>{moodEmojis[mood] ?? mood}</span>
      ) : (
        <span style={{ fontSize: "18px", lineHeight: 1, color: "transparent" }}>·</span>
      )}
      <p
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "16px",
          fontWeight: 700,
          color: styles.textDate,
          lineHeight: 1,
        }}
      >
        {date}
      </p>
      <p
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "10px",
          fontWeight: 500,
          color: styles.textDay,
          lineHeight: 1,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        {day}
      </p>
    </button>
  );
}

/* ─────────────────── WEEK STRIP ─────────────────── */
export function WeekStrip() {
  const [activeDay, setActiveDay] = useState(3);

  const days = [
    { date: 13, day: "Mon", state: "completed" as DayState, mood: "good" },
    { date: 14, day: "Tue", state: "completed" as DayState, mood: "great" },
    { date: 15, day: "Wed", state: "missed" as DayState, mood: "bad" },
    { date: 16, day: "Thu", state: "today" as DayState, mood: "neutral" },
    { date: 17, day: "Fri", state: "rest" as DayState },
    { date: 18, day: "Sat", state: "rest" as DayState },
    { date: 19, day: "Sun", state: "rest" as DayState },
  ];

  return (
    <div
      className="rounded-2xl bg-white border border-[#EEEEEA] p-5"
      style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
    >
      <div className="flex items-center gap-2 mb-4">
        <h3
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "20px", fontWeight: 700, color: "#1A1A1A" }}
        >
          My Week
        </h3>
      </div>
      <div className="flex items-center gap-1 mb-4">
        <Calendar size={13} color="#888886" />
        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "12px", color: "#888886" }}>
          from: <strong style={{ color: "#1A1A1A" }}>13 Jul, 2024</strong> to: <strong style={{ color: "#1A1A1A" }}>19 Jul, 2024</strong>
        </p>
      </div>
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {days.map((d, i) => (
          <DayPill
            key={d.date}
            {...d}
            state={activeDay === i ? "active" : d.state}
            onClick={() => setActiveDay(i)}
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────── MOOD EMOJI SELECTOR ─────────────────── */
export function MoodSelector() {
  const [selected, setSelected] = useState<string | null>("good");
  const moods = [
    { key: "great", emoji: "😄", label: "Great" },
    { key: "good", emoji: "🙂", label: "Good" },
    { key: "neutral", emoji: "😐", label: "Okay" },
    { key: "bad", emoji: "😔", label: "Bad" },
    { key: "terrible", emoji: "😞", label: "Rough" },
  ];

  return (
    <div
      className="rounded-2xl bg-white border border-[#EEEEEA] p-5"
      style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)", width: "fit-content" }}
    >
      <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "15px", fontWeight: 700, color: "#1A1A1A", marginBottom: "12px" }}>
        How do you feel today?
      </p>
      <div className="flex items-center gap-2">
        {moods.map((m) => (
          <button
            key={m.key}
            onClick={() => setSelected(m.key)}
            className="flex flex-col items-center gap-1 px-2 py-2 rounded-2xl transition-all active:scale-95"
            style={{
              background: selected === m.key ? "#FFF3C4" : "transparent",
              border: `2px solid ${selected === m.key ? "#F9C01E" : "transparent"}`,
            }}
          >
            <span style={{ fontSize: "24px" }}>{m.emoji}</span>
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "10px",
                fontWeight: selected === m.key ? 700 : 400,
                color: selected === m.key ? "#1A1A1A" : "#888886",
              }}
            >
              {m.label}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────── STREAK INDICATOR ─────────────────── */
export function StreakBadge({ count }: { count: number }) {
  return (
    <div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
      style={{ background: "#FFF3C4", border: "2px solid #F9C01E" }}
    >
      <span style={{ fontSize: "18px" }}>🔥</span>
      <p
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "16px",
          fontWeight: 800,
          color: "#1A1A1A",
        }}
      >
        {count}
      </p>
      <p
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "12px",
          fontWeight: 500,
          color: "#888886",
        }}
      >
        day streak
      </p>
    </div>
  );
}

/* ─────────────────── EXPORT SECTION ─────────────────── */
export function CalendarComponents() {
  return (
    <section>
      <SectionLabel>Calendar & Tracking</SectionLabel>
      <div className="flex flex-col gap-8">

        <ComponentRow label="Day Pill — All States" desc="Tap to cycle. States: default, today (dark), active (yellow), completed, missed, rest">
          <DayPill date={13} day="Mon" state="default" />
          <DayPill date={14} day="Tue" state="today" mood="great" />
          <DayPill date={15} day="Wed" state="active" mood="good" />
          <DayPill date={16} day="Thu" state="completed" mood="neutral" />
          <DayPill date={17} day="Fri" state="missed" mood="bad" />
          <DayPill date={18} day="Sat" state="rest" />
        </ComponentRow>

        <ComponentRow label="Week Strip" desc="Scrollable 7-day overview with mood tracking and date range label">
          <WeekStrip />
        </ComponentRow>

        <ComponentRow label="Mood Emoji Selector" desc="Daily mood check-in — tappable emoji chips with label">
          <MoodSelector />
        </ComponentRow>

        <ComponentRow label="Streak Badge" desc="Inline flame streak counter for habit reinforcement">
          <StreakBadge count={12} />
          <StreakBadge count={47} />
          <StreakBadge count={5} />
        </ComponentRow>

      </div>
    </section>
  );
}

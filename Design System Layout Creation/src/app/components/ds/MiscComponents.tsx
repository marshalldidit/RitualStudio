import React, { useState } from "react";
import { SectionLabel } from "./Foundations";
import { ComponentRow } from "./ButtonComponents";
import { Award, Flame, Star, Lock, TrendingUp, Zap } from "lucide-react";

/* ─────────────────── BADGE / TAG ─────────────────── */
type BadgeVariant = "yellow" | "dark" | "success" | "error" | "neutral" | "outline";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  icon?: React.ReactNode;
  size?: "sm" | "md";
}

const badgeVariants: Record<BadgeVariant, { bg: string; text: string; border?: string }> = {
  yellow: { bg: "#FFF3C4", text: "#1A1A1A" },
  dark: { bg: "#1A1A1A", text: "#FFFFFF" },
  success: { bg: "#E8FAF1", text: "#2A7A4E" },
  error: { bg: "#FFF0F0", text: "#C53030" },
  neutral: { bg: "#F7F7F5", text: "#888886" },
  outline: { bg: "transparent", text: "#1A1A1A", border: "#BBBBBA" },
};

export function DSBadge({ label, variant = "yellow", icon, size = "md" }: BadgeProps) {
  const s = badgeVariants[variant];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full"
      style={{
        background: s.bg,
        color: s.text,
        border: s.border ? `1.5px solid ${s.border}` : "none",
        padding: size === "sm" ? "2px 8px" : "4px 12px",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: size === "sm" ? "10px" : "12px",
        fontWeight: 600,
      }}
    >
      {icon && <span style={{ fontSize: size === "sm" ? "10px" : "12px" }}>{icon}</span>}
      {label}
    </span>
  );
}

/* ─────────────────── AVATAR ─────────────────── */
type AvatarSize = "sm" | "md" | "lg" | "xl";

const avatarSizes: Record<AvatarSize, { size: string; font: string }> = {
  sm: { size: "32px", font: "12px" },
  md: { size: "40px", font: "15px" },
  lg: { size: "56px", font: "20px" },
  xl: { size: "80px", font: "28px" },
};

export function DSAvatar({
  name,
  size = "md",
  src,
  showBadge,
}: {
  name: string;
  size?: AvatarSize;
  src?: string;
  showBadge?: boolean;
}) {
  const s = avatarSizes[size];
  const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const colors = ["#F9C01E", "#FF8C61", "#61C9A8", "#7B8CDE", "#FF6B9D"];
  const color = colors[name.charCodeAt(0) % colors.length];

  return (
    <div className="relative inline-flex">
      <div
        className="rounded-full flex items-center justify-center overflow-hidden shrink-0"
        style={{
          width: s.size,
          height: s.size,
          background: src ? "transparent" : color,
        }}
      >
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : (
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: s.font,
              fontWeight: 700,
              color: "#1A1A1A",
            }}
          >
            {initials}
          </p>
        )}
      </div>
      {showBadge && (
        <span
          className="absolute bottom-0 right-0 rounded-full bg-[#4CAF7D] border-2 border-white"
          style={{ width: "12px", height: "12px" }}
        />
      )}
    </div>
  );
}

/* ─────────────────── ACHIEVEMENT BADGE ─────────────────── */
interface AchievementProps {
  icon: React.ReactNode;
  name: string;
  desc: string;
  unlocked?: boolean;
}

export function AchievementBadge({ icon, name, desc, unlocked }: AchievementProps) {
  return (
    <div
      className="flex flex-col items-center gap-2 p-4 rounded-2xl w-[100px] transition-all"
      style={{
        background: unlocked ? "#FFF3C4" : "#F7F7F5",
        border: `2px solid ${unlocked ? "#F9C01E" : "#EEEEEA"}`,
        opacity: unlocked ? 1 : 0.6,
      }}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center"
        style={{ background: unlocked ? "#F9C01E" : "#EEEEEA" }}
      >
        {unlocked ? icon : <Lock size={18} color="#BBBBBA" />}
      </div>
      <p
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "12px",
          fontWeight: 700,
          color: "#1A1A1A",
          textAlign: "center",
          lineHeight: 1.3,
        }}
      >
        {name}
      </p>
      <p
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "10px",
          color: "#888886",
          textAlign: "center",
          lineHeight: 1.3,
        }}
      >
        {desc}
      </p>
    </div>
  );
}

/* ─────────────────── PROGRESS RING ─────────────────── */
export function ProgressRing({ percent, size = 64, label }: { percent: number; size?: number; label?: string }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#EEEEEA" strokeWidth={6} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="#F9C01E"
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: size > 80 ? "18px" : "13px",
              fontWeight: 800,
              color: "#1A1A1A",
            }}
          >
            {percent}%
          </p>
        </div>
      </div>
      {label && (
        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "11px", fontWeight: 500, color: "#888886" }}>
          {label}
        </p>
      )}
    </div>
  );
}

/* ─────────────────── SKELETON LOADER ─────────────────── */
export function SkeletonCard() {
  return (
    <div className="w-[260px] rounded-2xl bg-white border border-[#EEEEEA] p-5 flex flex-col gap-3">
      <div className="h-4 rounded-full bg-[#EEEEEA] w-3/4 animate-pulse" />
      <div className="h-3 rounded-full bg-[#EEEEEA] w-full animate-pulse" />
      <div className="h-3 rounded-full bg-[#EEEEEA] w-5/6 animate-pulse" />
      <div className="flex items-center gap-3 mt-1">
        <div className="w-10 h-10 rounded-2xl bg-[#EEEEEA] animate-pulse shrink-0" />
        <div className="flex-1">
          <div className="h-3 rounded-full bg-[#EEEEEA] w-full animate-pulse mb-1.5" />
          <div className="h-2.5 rounded-full bg-[#EEEEEA] w-1/2 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── EMPTY STATE ─────────────────── */
export function EmptyState({ message, sub, cta }: { message: string; sub?: string; cta?: string }) {
  return (
    <div className="flex flex-col items-center gap-4 py-8 px-6 max-w-[260px]">
      <div className="w-20 h-20 rounded-full bg-[#FFF3C4] flex items-center justify-center">
        <span style={{ fontSize: "36px" }}>🎯</span>
      </div>
      <div className="text-center">
        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "17px", fontWeight: 700, color: "#1A1A1A", marginBottom: "6px" }}>
          {message}
        </p>
        {sub && (
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "13px", color: "#888886", lineHeight: 1.5 }}>
            {sub}
          </p>
        )}
      </div>
      {cta && (
        <button
          className="px-6 py-3 rounded-full bg-[#F9C01E] text-[#1A1A1A] font-semibold"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "14px" }}
        >
          {cta}
        </button>
      )}
    </div>
  );
}

/* ─────────────────── ILLUSTRATION PLACEHOLDER ─────────────────── */
export function IllustrationPlaceholder({ width = 160, height = 160, label }: { width?: number; height?: number; label: string }) {
  return (
    <div
      className="rounded-3xl flex flex-col items-center justify-center gap-2"
      style={{
        width,
        height,
        background: "linear-gradient(135deg, #FFF3C4 0%, #FFE680 100%)",
        border: "2px dashed #F9C01E",
      }}
    >
      <span style={{ fontSize: "32px" }}>🎨</span>
      <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "11px", fontWeight: 500, color: "#888886", textAlign: "center" }}>
        {label}
      </p>
    </div>
  );
}

/* ─────────────────── EXPORT SECTION ─────────────────── */
export function MiscComponents() {
  return (
    <section>
      <SectionLabel>Badges, Avatars & Misc</SectionLabel>
      <div className="flex flex-col gap-8">

        <ComponentRow label="Badges & Tags" desc="Status labels, category tags, and semantic indicators">
          <div className="flex flex-wrap gap-2 items-center">
            <DSBadge label="⚡ Active" variant="yellow" />
            <DSBadge label="Completed" variant="dark" />
            <DSBadge label="On track" variant="success" />
            <DSBadge label="Missed" variant="error" />
            <DSBadge label="Rest day" variant="neutral" />
            <DSBadge label="Streak" variant="outline" />
            <DSBadge label="New" variant="yellow" size="sm" />
            <DSBadge label="Hot 🔥" variant="dark" size="sm" />
          </div>
        </ComponentRow>

        <ComponentRow label="Avatars" desc="User initials with auto-color, online status badge, multiple sizes">
          <div className="flex items-end gap-4">
            <DSAvatar name="Tom Hanks" size="xl" showBadge />
            <DSAvatar name="Tom Hanks" size="lg" />
            <DSAvatar name="Sara Kim" size="md" showBadge />
            <DSAvatar name="Alex Brown" size="sm" />
            <DSAvatar name="Mia Rose" size="sm" />
          </div>
        </ComponentRow>

        <ComponentRow label="Achievement Badges" desc="Locked and unlocked milestone rewards — motivation layer">
          <div className="flex flex-wrap gap-3">
            <AchievementBadge icon={<Flame size={24} color="#1A1A1A" />} name="7-Day Streak" desc="7 days in a row" unlocked />
            <AchievementBadge icon={<Star size={24} color="#1A1A1A" />} name="Goal Setter" desc="Set 5 goals" unlocked />
            <AchievementBadge icon={<Award size={24} color="#1A1A1A" />} name="30-Day Club" desc="30 day streak" />
            <AchievementBadge icon={<TrendingUp size={24} color="#1A1A1A" />} name="Top Performer" desc="100% this week" />
          </div>
        </ComponentRow>

        <ComponentRow label="Progress Rings" desc="Circular SVG progress indicator for daily, weekly, or category completion">
          <ProgressRing percent={100} size={96} label="Today" />
          <ProgressRing percent={71} size={96} label="This week" />
          <ProgressRing percent={34} size={96} label="Goals done" />
          <ProgressRing percent={0} size={64} />
          <ProgressRing percent={50} size={64} />
        </ComponentRow>

        <ComponentRow label="Skeleton Loader" desc="Pulse shimmer placeholder while content loads">
          <SkeletonCard />
        </ComponentRow>

        <ComponentRow label="Empty State" desc="Illustrated zero-state with message, sub-copy, and CTA">
          <EmptyState
            message="No habits yet"
            sub="Add your first habit to start building a great routine."
            cta="Add your first habit"
          />
        </ComponentRow>

        <ComponentRow label="Illustration Placeholders" desc="Yellow gradient zones for custom character illustrations">
          <IllustrationPlaceholder width={160} height={160} label="Character illustration" />
          <IllustrationPlaceholder width={120} height={80} label="Scene artwork" />
        </ComponentRow>

      </div>
    </section>
  );
}

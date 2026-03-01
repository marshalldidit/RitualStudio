import React, { useState } from "react";
import { SectionLabel } from "./Foundations";
import {
  Settings, Heart, Share2, Trash2, Plus, ChevronRight,
  Check, X, ArrowRight, Zap, Target, MoreHorizontal, Bell
} from "lucide-react";

/* ─────────── base button ─────────── */
type BtnVariant = "primary" | "cta" | "outline" | "ghost" | "danger";
type BtnSize = "sm" | "md" | "lg";

interface BtnProps {
  variant?: BtnVariant;
  size?: BtnSize;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  disabled?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<BtnVariant, string> = {
  primary: "bg-[#1A1A1A] text-white hover:bg-[#333333] active:scale-95",
  cta: "bg-[#F9C01E] text-[#1A1A1A] hover:bg-[#E6AE0A] active:scale-95",
  outline: "bg-transparent text-[#1A1A1A] border-2 border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white active:scale-95",
  ghost: "bg-transparent text-[#1A1A1A] hover:bg-[#F7F7F5] active:scale-95",
  danger: "bg-[#E84040] text-white hover:bg-[#C53030] active:scale-95",
};

const sizeStyles: Record<BtnSize, string> = {
  sm: "px-4 py-2 text-[13px]",
  md: "px-6 py-3 text-[14px]",
  lg: "px-8 py-4 text-[16px]",
};

export function DSButton({ variant = "primary", size = "md", icon, iconRight, disabled, children }: BtnProps) {
  return (
    <button
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2 rounded-full font-semibold
        transition-all duration-150 cursor-pointer select-none
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : ""}
      `}
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
      {iconRight && <span className="shrink-0">{iconRight}</span>}
    </button>
  );
}

/* ─────────── icon button ─────────── */
interface IconBtnProps {
  variant?: "default" | "yellow" | "dark" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  active?: boolean;
  children: React.ReactNode;
}

const iconBtnVariants: Record<string, string> = {
  default: "bg-[#F7F7F5] text-[#1A1A1A] hover:bg-[#EEEEEA]",
  yellow: "bg-[#F9C01E] text-[#1A1A1A] hover:bg-[#E6AE0A]",
  dark: "bg-[#1A1A1A] text-white hover:bg-[#333333]",
  danger: "bg-[#FFF0F0] text-[#E84040] hover:bg-[#FFE0E0]",
  ghost: "bg-transparent text-[#888886] hover:bg-[#F7F7F5] hover:text-[#1A1A1A]",
};

const iconBtnSizes: Record<string, string> = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
};

export function DSIconButton({ variant = "default", size = "md", active, children }: IconBtnProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center rounded-full
        transition-all duration-150 cursor-pointer active:scale-90
        ${iconBtnVariants[active ? "yellow" : variant]}
        ${iconBtnSizes[size]}
      `}
    >
      {children}
    </button>
  );
}

/* ─────────── FAB ─────────── */
export function DSFAB({ children }: { children: React.ReactNode }) {
  return (
    <button
      className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#F9C01E] text-[#1A1A1A]
                 shadow-lg hover:shadow-xl hover:bg-[#E6AE0A] transition-all duration-200 active:scale-95"
    >
      {children}
    </button>
  );
}

/* ─────────── EXPORT SECTION ─────────── */
export function ButtonComponents() {
  const [likedA, setLikedA] = useState(false);

  return (
    <section>
      <SectionLabel>Buttons & Actions</SectionLabel>

      <div className="flex flex-col gap-8">
        {/* Primary Buttons */}
        <ComponentRow label="Primary (Dark Pill)" desc="Main CTAs — Continue, Save, Submit">
          <DSButton variant="primary" size="lg">Continue</DSButton>
          <DSButton variant="primary" size="md">Plan today</DSButton>
          <DSButton variant="primary" size="sm">Save</DSButton>
          <DSButton variant="primary" size="md" disabled>Disabled</DSButton>
        </ComponentRow>

        {/* CTA Yellow */}
        <ComponentRow label="CTA (Yellow Pill)" desc="High-attention actions — Plan Today, Get Started">
          <DSButton variant="cta" size="lg">Get Started</DSButton>
          <DSButton variant="cta" size="md">Plan today</DSButton>
          <DSButton variant="cta" size="sm">Start</DSButton>
        </ComponentRow>

        {/* Outline */}
        <ComponentRow label="Outline" desc="Secondary actions — Update Goals, View All">
          <DSButton variant="outline" size="lg">Update Goals</DSButton>
          <DSButton variant="outline" size="md">View All</DSButton>
          <DSButton variant="outline" size="sm">Edit</DSButton>
        </ComponentRow>

        {/* Ghost */}
        <ComponentRow label="Ghost" desc="Tertiary / inline actions">
          <DSButton variant="ghost" size="md">Skip for now</DSButton>
          <DSButton variant="ghost" size="md" iconRight={<ChevronRight size={16} />}>See more</DSButton>
        </ComponentRow>

        {/* Danger */}
        <ComponentRow label="Danger" desc="Destructive actions — Delete, Remove">
          <DSButton variant="danger" size="md">Delete Goal</DSButton>
          <DSButton variant="danger" size="md" icon={<Trash2 size={16} />}>Remove</DSButton>
        </ComponentRow>

        {/* With Icons */}
        <ComponentRow label="With Icons" desc="Icon-prefix and icon-suffix variants">
          <DSButton variant="primary" size="md" icon={<Plus size={16} />}>Add Habit</DSButton>
          <DSButton variant="cta" size="md" iconRight={<ArrowRight size={16} />}>Continue</DSButton>
          <DSButton variant="outline" size="md" icon={<Target size={16} />}>Set Goal</DSButton>
        </ComponentRow>

        {/* Icon Buttons */}
        <ComponentRow label="Icon Buttons" desc="Compact circular actions">
          <DSIconButton variant="dark" size="lg"><Settings size={18} /></DSIconButton>
          <DSIconButton variant="yellow" size="lg"><Plus size={18} /></DSIconButton>
          <DSIconButton variant="danger" size="lg"><Trash2 size={18} /></DSIconButton>
          <DSIconButton variant="default" size="lg"><Share2 size={18} /></DSIconButton>
          <DSIconButton variant="ghost" size="lg"><MoreHorizontal size={18} /></DSIconButton>
          <DSIconButton variant="default" size="md" active={likedA}>
            <Heart
              size={16}
              className="transition-colors"
              fill={likedA ? "#F9C01E" : "none"}
              stroke={likedA ? "#F9C01E" : "#1A1A1A"}
              onClick={() => setLikedA(!likedA)}
            />
          </DSIconButton>
          <DSIconButton variant="default" size="sm"><Bell size={14} /></DSIconButton>
        </ComponentRow>

        {/* FAB */}
        <ComponentRow label="Floating Action Button" desc="Primary floating action — Add Habit">
          <DSFAB><Plus size={24} /></DSFAB>
        </ComponentRow>
      </div>
    </section>
  );
}

export function ComponentRow({
  label,
  desc,
  children,
}: {
  label: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="ds-label">{label}</p>
        <p className="ds-caption" style={{ color: "#888886" }}>{desc}</p>
      </div>
      <div className="flex flex-wrap items-center gap-3 p-5 bg-[#FAFAF5] rounded-2xl border border-[#EEEEEA]">
        {children}
      </div>
    </div>
  );
}

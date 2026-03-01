import React, { useState } from "react";
import { SectionLabel } from "./Foundations";
import { ComponentRow } from "./ButtonComponents";
import {
  Home, Target, BarChart2, User, Plus, CheckCircle,
  Bell, ChevronLeft, MoreHorizontal, Settings,
} from "lucide-react";

/* ─────────────────── BOTTOM NAV BAR ─────────────────── */
interface NavItem {
  icon: React.ReactNode;
  label: string;
  id: string;
}

const navItems: NavItem[] = [
  { id: "home", icon: <Home size={22} />, label: "Home" },
  { id: "goals", icon: <Target size={22} />, label: "Goals" },
  { id: "add", icon: <Plus size={24} />, label: "" },
  { id: "progress", icon: <BarChart2 size={22} />, label: "Progress" },
  { id: "profile", icon: <User size={22} />, label: "Profile" },
];

export function BottomTabBar() {
  const [active, setActive] = useState("home");

  return (
    <div
      className="flex items-end justify-around px-3 pb-2 pt-3 rounded-3xl"
      style={{
        background: "#FFFFFF",
        border: "1px solid #EEEEEA",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.08)",
        width: "320px",
      }}
    >
      {navItems.map((item) => {
        const isAdd = item.id === "add";
        const isActive = active === item.id;

        if (isAdd) {
          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className="flex flex-col items-center justify-center w-14 h-14 -mt-6 rounded-full
                         bg-[#F9C01E] transition-all active:scale-90"
              style={{
                boxShadow: "0 6px 20px rgba(249,192,30,0.45)",
              }}
            >
              <Plus size={24} color="#1A1A1A" />
            </button>
          );
        }

        return (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className="flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-2xl transition-all active:scale-90"
            style={{
              minWidth: "52px",
              background: isActive ? "#FFF3C4" : "transparent",
            }}
          >
            <span
              style={{
                color: isActive ? "#1A1A1A" : "#BBBBBA",
                transition: "color 0.15s",
              }}
            >
              {item.icon}
            </span>
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "10px",
                fontWeight: isActive ? 700 : 400,
                color: isActive ? "#1A1A1A" : "#BBBBBA",
              }}
            >
              {item.label}
            </p>
          </button>
        );
      })}
    </div>
  );
}

/* ─────────────────── TOP APP BAR ─────────────────── */
interface TopBarProps {
  title?: string;
  showBack?: boolean;
  showSettings?: boolean;
  variant?: "default" | "yellow";
}

export function TopAppBar({ title, showBack, showSettings, variant = "default" }: TopBarProps) {
  return (
    <div
      className="flex items-center justify-between px-5 py-4 rounded-2xl"
      style={{
        background: variant === "yellow" ? "#F9C01E" : "#FFFFFF",
        border: variant === "yellow" ? "none" : "1px solid #EEEEEA",
        width: "320px",
        boxShadow: variant === "yellow" ? "0 4px 20px rgba(249,192,30,0.3)" : "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      <div className="flex items-center gap-3">
        {showBack && (
          <button className="w-8 h-8 rounded-full flex items-center justify-center bg-black/10 active:scale-90">
            <ChevronLeft size={18} color="#1A1A1A" />
          </button>
        )}
        {title && (
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "18px",
              fontWeight: 700,
              color: "#1A1A1A",
            }}
          >
            {title}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors active:scale-90 relative">
          <Bell size={18} color="#1A1A1A" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E84040]" />
        </button>
        {showSettings && (
          <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors active:scale-90">
            <Settings size={18} color="#1A1A1A" />
          </button>
        )}
      </div>
    </div>
  );
}

/* ─────────────────── SCREEN HEADER (back + title + menu) ─────────────────── */
export function ScreenHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between px-5 py-4" style={{ width: "320px" }}>
      <button className="w-9 h-9 rounded-full bg-[#F7F7F5] flex items-center justify-center active:scale-90">
        <ChevronLeft size={20} color="#1A1A1A" />
      </button>
      <p
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "17px",
          fontWeight: 700,
          color: "#1A1A1A",
        }}
      >
        {title}
      </p>
      <button className="w-9 h-9 rounded-full bg-[#F7F7F5] flex items-center justify-center active:scale-90">
        <MoreHorizontal size={20} color="#1A1A1A" />
      </button>
    </div>
  );
}

/* ─────────────────── STEP PROGRESS (onboarding) ─────────────────── */
export function OnboardingSteps({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="transition-all duration-300 rounded-full"
          style={{
            width: i === current ? "28px" : "8px",
            height: "8px",
            background: i === current ? "#F9C01E" : i < current ? "#1A1A1A" : "#EEEEEA",
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────── TOAST / SNACKBAR ─────────────────── */
interface ToastProps {
  type?: "success" | "warning" | "error" | "info";
  message: string;
}

const toastStyles: Record<string, { bg: string; icon: string; border: string }> = {
  success: { bg: "#F0FFF8", icon: "✅", border: "#4CAF7D" },
  warning: { bg: "#FFFBEA", icon: "⚠️", border: "#F9C01E" },
  error: { bg: "#FFF5F5", icon: "❌", border: "#E84040" },
  info: { bg: "#EFF6FF", icon: "ℹ️", border: "#4A90D9" },
};

export function DSToast({ type = "success", message }: ToastProps) {
  const s = toastStyles[type];
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-2xl"
      style={{
        background: s.bg,
        border: `1.5px solid ${s.border}`,
        maxWidth: "280px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
      }}
    >
      <span style={{ fontSize: "16px" }}>{s.icon}</span>
      <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "13px", fontWeight: 500, color: "#1A1A1A" }}>
        {message}
      </p>
    </div>
  );
}

/* ─────────────────── EXPORT SECTION ─────────────────── */
export function NavigationComponents() {
  return (
    <section>
      <SectionLabel>Navigation & System</SectionLabel>
      <div className="flex flex-col gap-8">

        <ComponentRow label="Bottom Tab Bar" desc="5-tab navigation with prominent FAB-style center Add button">
          <BottomTabBar />
        </ComponentRow>

        <ComponentRow label="Top App Bar — Default" desc="Screen header with notification bell, back, and settings">
          <TopAppBar title="My Habits" showBack showSettings />
          <TopAppBar title="Progress" showSettings />
        </ComponentRow>

        <ComponentRow label="Top App Bar — Yellow" desc="Hero greeting bar variant on yellow background">
          <TopAppBar variant="yellow" title="Hey, Tom! 👋" showSettings />
        </ComponentRow>

        <ComponentRow label="Screen Header" desc="Back navigation + title + overflow menu for inner screens">
          <ScreenHeader title="Add New Goal" />
        </ComponentRow>

        <ComponentRow label="Onboarding Step Progress" desc="Animated pill-style step indicators for onboarding flows">
          <OnboardingSteps total={5} current={0} />
          <OnboardingSteps total={5} current={2} />
          <OnboardingSteps total={5} current={4} />
        </ComponentRow>

        <ComponentRow label="Toasts & Notifications" desc="Inline feedback messages for success, warning, error, and info states">
          <div className="flex flex-col gap-2">
            <DSToast type="success" message="Habit completed! Keep it up 🎉" />
            <DSToast type="warning" message="Don't forget your evening habit" />
            <DSToast type="error" message="Goal could not be saved" />
            <DSToast type="info" message="You're on a 7-day streak!" />
          </div>
        </ComponentRow>

      </div>
    </section>
  );
}

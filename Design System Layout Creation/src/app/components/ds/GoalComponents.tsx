import React, { useState } from "react";
import { SectionLabel } from "./Foundations";
import { ComponentRow } from "./ButtonComponents";
import { Trash2, Plus, ChevronRight, Zap, Apple, Dumbbell, BookOpen, Music, Pencil, Brain, Moon, Sun, Coffee, Droplets } from "lucide-react";

/* ─────────────────── CATEGORY LABEL ─────────────────── */
interface CategoryLabelProps {
  name: string;
  count?: number;
}

export function CategoryLabel({ name, count }: CategoryLabelProps) {
  return (
    <div className="flex items-center justify-between">
      <p
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "15px",
          fontWeight: 700,
          color: "#1A1A1A",
        }}
      >
        {name}
      </p>
      {count !== undefined && (
        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "12px", color: "#888886" }}>
          {count} goals
        </p>
      )}
    </div>
  );
}

/* ─────────────────── GOAL ITEM ─────────────────── */
interface GoalItemProps {
  icon: React.ReactNode;
  name: string;
  onDelete?: () => void;
  deletable?: boolean;
}

export function GoalItem({ icon, name, onDelete, deletable }: GoalItemProps) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border border-[#EEEEEA] transition-all hover:border-[#F9C01E] hover:bg-[#FFFBEA] group"
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
    >
      <div className="w-8 h-8 rounded-xl bg-[#F7F7F5] flex items-center justify-center shrink-0 group-hover:bg-[#FFF3C4] transition-colors">
        {icon}
      </div>
      <p
        className="flex-1 truncate"
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "14px",
          fontWeight: 500,
          color: "#1A1A1A",
        }}
      >
        {name}
      </p>
      {deletable && (
        <button
          onClick={onDelete}
          className="w-8 h-8 rounded-xl bg-[#F7F7F5] flex items-center justify-center shrink-0
                     hover:bg-[#FFE8E8] transition-colors active:scale-90"
        >
          <Trash2 size={14} color="#E84040" />
        </button>
      )}
    </div>
  );
}

/* ─────────────────── GOALS SECTION ─────────────────── */
const defaultGoals = {
  Fitness: [
    { id: 1, icon: <Zap size={16} color="#1A1A1A" />, name: "Have more energy" },
    { id: 2, icon: <Dumbbell size={16} color="#1A1A1A" />, name: "Build muscle / get stronger" },
  ],
  Nutrition: [
    { id: 3, icon: <Apple size={16} color="#1A1A1A" />, name: "Cook more" },
    { id: 4, icon: <Coffee size={16} color="#1A1A1A" />, name: "Improve snacking habits" },
  ],
};

export function GoalsSection() {
  const [goals, setGoals] = useState(defaultGoals);

  const removeGoal = (category: keyof typeof goals, id: number) => {
    setGoals((prev) => ({
      ...prev,
      [category]: prev[category].filter((g) => g.id !== id),
    }));
  };

  return (
    <div
      className="w-[280px] rounded-2xl bg-white border border-[#EEEEEA] p-5"
      style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
    >
      <h3
        className="mb-4"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "20px", fontWeight: 700, color: "#1A1A1A" }}
      >
        My Goals
      </h3>

      {(Object.entries(goals) as [keyof typeof goals, typeof goals[keyof typeof goals]][]).map(([cat, items]) => (
        <div key={cat} className="mb-4">
          <CategoryLabel name={cat} count={items.length} />
          <div className="flex flex-col gap-2 mt-2">
            {items.map((g) => (
              <GoalItem
                key={g.id}
                icon={g.icon}
                name={g.name}
                deletable
                onDelete={() => removeGoal(cat, g.id)}
              />
            ))}
          </div>
        </div>
      ))}

      <button
        className="w-full mt-2 py-3 rounded-full border-2 border-[#1A1A1A] text-[#1A1A1A] text-sm font-semibold
                   hover:bg-[#1A1A1A] hover:text-white transition-all"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        Update Goals
      </button>
    </div>
  );
}

/* ─────────────────── CATEGORY CHIP ─────────────────── */
interface ChipProps {
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export function CategoryChip({ label, icon, active, onClick }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all active:scale-95"
      style={{
        background: active ? "#F9C01E" : "#FFFFFF",
        borderColor: active ? "#F9C01E" : "#EEEEEA",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: "13px",
        fontWeight: active ? 700 : 500,
        color: "#1A1A1A",
      }}
    >
      {icon && <span>{icon}</span>}
      {label}
    </button>
  );
}

/* ─────────────────── HABIT CATEGORY PILLS ─────────────────── */
export function HabitCategoryFilter() {
  const [active, setActive] = useState("All");
  const cats = [
    { label: "All", icon: null },
    { label: "Fitness", icon: <Dumbbell size={13} /> },
    { label: "Nutrition", icon: <Apple size={13} /> },
    { label: "Mind", icon: <Brain size={13} /> },
    { label: "Sleep", icon: <Moon size={13} /> },
    { label: "Learning", icon: <BookOpen size={13} /> },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {cats.map((c) => (
        <CategoryChip
          key={c.label}
          label={c.label}
          icon={c.icon}
          active={active === c.label}
          onClick={() => setActive(c.label)}
        />
      ))}
    </div>
  );
}

/* ─────────────────── ADD GOAL INPUT ─────────────────── */
export function AddGoalInput() {
  const [val, setVal] = useState("");
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-2xl border-2 border-dashed border-[#EEEEEA] bg-[#FAFAF5]
                 focus-within:border-[#F9C01E] transition-all w-[260px]"
    >
      <Plus size={16} color="#888886" />
      <input
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder="Add a new goal..."
        className="flex-1 bg-transparent outline-none"
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "14px",
          color: "#1A1A1A",
        }}
      />
      {val && (
        <button
          className="w-7 h-7 rounded-full bg-[#F9C01E] flex items-center justify-center active:scale-90 shrink-0"
          onClick={() => setVal("")}
        >
          <Plus size={14} color="#1A1A1A" />
        </button>
      )}
    </div>
  );
}

/* ─────────────────── EXPORT SECTION ─────────────────── */
export function GoalComponents() {
  return (
    <section>
      <SectionLabel>Goals & Habits</SectionLabel>
      <div className="flex flex-col gap-8">

        <ComponentRow label="Category Label" desc="Bold section divider for grouping goals by life area">
          <div className="flex flex-col gap-3 w-[200px]">
            <CategoryLabel name="Fitness" count={2} />
            <CategoryLabel name="Nutrition" count={3} />
            <CategoryLabel name="Mind & Wellness" count={4} />
          </div>
        </ComponentRow>

        <ComponentRow label="Goal Item" desc="Tappable goal row with icon, label, and optional delete action">
          <div className="flex flex-col gap-2 w-[260px]">
            <GoalItem icon={<Zap size={16} />} name="Have more energy" deletable />
            <GoalItem icon={<Dumbbell size={16} />} name="Build muscle / get stronger" deletable />
            <GoalItem icon={<Apple size={16} />} name="Cook more" deletable />
            <GoalItem icon={<Brain size={16} />} name="Meditate daily" deletable />
          </div>
        </ComponentRow>

        <ComponentRow label="Goals Section Card" desc="Full goals module with categories, items, and update CTA">
          <GoalsSection />
        </ComponentRow>

        <ComponentRow label="Category Filter Chips" desc="Horizontal scrollable habit category filter row">
          <HabitCategoryFilter />
        </ComponentRow>

        <ComponentRow label="Add Goal Input" desc="Inline dashed input for quickly adding new goals">
          <AddGoalInput />
        </ComponentRow>

      </div>
    </section>
  );
}

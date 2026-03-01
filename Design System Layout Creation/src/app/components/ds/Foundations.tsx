import React from "react";

/* ─────────────────────────── COLOR PALETTE ─────────────────────────── */
const colors = [
  {
    group: "Brand — Yellow",
    swatches: [
      { name: "Yellow 50", hex: "#FFFBEA", text: "#1A1A1A" },
      { name: "Yellow 100", hex: "#FFF3C4", text: "#1A1A1A" },
      { name: "Yellow 200", hex: "#FFE680", text: "#1A1A1A" },
      { name: "Yellow 400", hex: "#F9C01E", text: "#1A1A1A", badge: "Primary" },
      { name: "Yellow 600", hex: "#D4A017", text: "#1A1A1A" },
      { name: "Yellow 800", hex: "#9A7010", text: "#FFFFFF" },
    ],
  },
  {
    group: "Neutral — Dark",
    swatches: [
      { name: "Dark 50", hex: "#F7F7F5", text: "#1A1A1A" },
      { name: "Dark 100", hex: "#EEEEEA", text: "#1A1A1A" },
      { name: "Dark 300", hex: "#BBBBBA", text: "#1A1A1A" },
      { name: "Dark 500", hex: "#888886", text: "#FFFFFF" },
      { name: "Dark 700", hex: "#444442", text: "#FFFFFF" },
      { name: "Dark 900", hex: "#1A1A1A", text: "#FFFFFF", badge: "Text" },
    ],
  },
  {
    group: "Semantic",
    swatches: [
      { name: "Success", hex: "#4CAF7D", text: "#FFFFFF" },
      { name: "Warning", hex: "#F9C01E", text: "#1A1A1A" },
      { name: "Error", hex: "#E84040", text: "#FFFFFF" },
      { name: "Info", hex: "#4A90D9", text: "#FFFFFF" },
      { name: "Surface", hex: "#FFFFFF", text: "#1A1A1A", badge: "Card" },
      { name: "Background", hex: "#FAFAF5", text: "#1A1A1A", badge: "App BG" },
    ],
  },
];

export function ColorPalette() {
  return (
    <section>
      <SectionLabel>Color Palette</SectionLabel>
      <div className="flex flex-col gap-6">
        {colors.map((group) => (
          <div key={group.group}>
            <p className="ds-label mb-3">{group.group}</p>
            <div className="flex flex-wrap gap-3">
              {group.swatches.map((s) => (
                <div key={s.name} className="flex flex-col gap-1.5 w-[100px]">
                  <div
                    className="h-14 rounded-2xl border border-black/5 relative"
                    style={{ background: s.hex }}
                  >
                    {s.badge && (
                      <span
                        className="absolute bottom-1.5 right-1.5 text-[9px] px-1.5 py-0.5 rounded-full"
                        style={{
                          background: s.text === "#1A1A1A" ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.2)",
                          color: s.text,
                        }}
                      >
                        {s.badge}
                      </span>
                    )}
                  </div>
                  <p className="ds-caption text-[#1A1A1A]">{s.name}</p>
                  <p className="ds-caption" style={{ color: "#888886" }}>{s.hex}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────── TYPOGRAPHY ─────────────────────────── */
const typeScale = [
  { name: "Display", size: "48px", weight: "800", sample: "12", desc: "Streak / hero numbers" },
  { name: "H1", size: "32px", weight: "700", sample: "Hey, Tom!", desc: "Screen greeting" },
  { name: "H2", size: "24px", weight: "700", sample: "My Week", desc: "Section headers" },
  { name: "H3", size: "20px", weight: "700", sample: "My Goals", desc: "Sub-section headers" },
  { name: "H4", size: "17px", weight: "600", sample: "Days Planned", desc: "Card titles" },
  { name: "Body Large", size: "16px", weight: "400", sample: "Do not wait until the conditions are perfect to begin.", desc: "Quote & body copy" },
  { name: "Body", size: "14px", weight: "400", sample: "Have more energy · Cook more", desc: "List items, goal text" },
  { name: "Label", size: "13px", weight: "600", sample: "Fitness · Nutrition", desc: "Category labels" },
  { name: "Caption", size: "11px", weight: "500", sample: "13 · Mon · from: 13 Jul", desc: "Date chips, captions" },
];

export function TypographyScale() {
  return (
    <section>
      <SectionLabel>Typography Scale</SectionLabel>
      <p className="ds-caption mb-5" style={{ color: "#888886" }}>
        Typeface: <strong style={{ color: "#1A1A1A" }}>Plus Jakarta Sans</strong> — Primary system font for all UI text
      </p>
      <div className="flex flex-col divide-y divide-[#EEEEEA]">
        {typeScale.map((t) => (
          <div key={t.name} className="flex items-baseline gap-6 py-4">
            <div className="w-28 shrink-0">
              <p className="ds-caption text-[#888886]">{t.name}</p>
              <p className="ds-caption text-[#BBBBBA]">{t.size} / {t.weight}</p>
            </div>
            <p
              className="flex-1 truncate"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: t.size,
                fontWeight: t.weight,
                color: "#1A1A1A",
                lineHeight: 1.2,
              }}
            >
              {t.sample}
            </p>
            <p className="ds-caption text-[#888886] hidden md:block w-44 shrink-0">{t.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────── SPACING ─────────────────────────── */
const spacingScale = [
  { token: "space-1", px: "4px", desc: "Icon gap" },
  { token: "space-2", px: "8px", desc: "Tight padding" },
  { token: "space-3", px: "12px", desc: "Inner card pad" },
  { token: "space-4", px: "16px", desc: "Standard pad" },
  { token: "space-5", px: "20px", desc: "Section gap" },
  { token: "space-6", px: "24px", desc: "Card padding" },
  { token: "space-8", px: "32px", desc: "Section margin" },
  { token: "space-10", px: "40px", desc: "Large gap" },
  { token: "space-12", px: "48px", desc: "Screen margin" },
];

const radiusScale = [
  { token: "radius-sm", px: "8px", desc: "Tag / chip" },
  { token: "radius-md", px: "12px", desc: "Input field" },
  { token: "radius-lg", px: "16px", desc: "Card" },
  { token: "radius-xl", px: "20px", desc: "Large card" },
  { token: "radius-2xl", px: "24px", desc: "Modal" },
  { token: "radius-full", px: "9999px", desc: "Pill / button" },
];

export function SpacingAndRadius() {
  return (
    <section>
      <SectionLabel>Spacing & Radius</SectionLabel>
      <div className="flex flex-col md:flex-row gap-10">
        {/* Spacing */}
        <div className="flex-1">
          <p className="ds-label mb-4">Spacing Scale (base 4px)</p>
          <div className="flex flex-col gap-3">
            {spacingScale.map((s) => (
              <div key={s.token} className="flex items-center gap-3">
                <div
                  className="bg-[#F9C01E] rounded shrink-0"
                  style={{ width: s.px, height: "20px", minWidth: s.px }}
                />
                <p className="ds-caption text-[#1A1A1A] w-20 shrink-0">{s.token}</p>
                <p className="ds-caption text-[#888886] w-12 shrink-0">{s.px}</p>
                <p className="ds-caption text-[#BBBBBA]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Radius */}
        <div className="flex-1">
          <p className="ds-label mb-4">Border Radius</p>
          <div className="flex flex-wrap gap-4">
            {radiusScale.map((r) => (
              <div key={r.token} className="flex flex-col items-center gap-2">
                <div
                  className="w-12 h-12 bg-[#FFF3C4] border-2 border-[#F9C01E]"
                  style={{ borderRadius: r.px }}
                />
                <p className="ds-caption text-[#1A1A1A] text-center">{r.token.replace("radius-", "")}</p>
                <p className="ds-caption text-[#888886] text-center">{r.px}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Elevation */}
      <div className="mt-8">
        <p className="ds-label mb-4">Elevation / Shadow</p>
        <div className="flex flex-wrap gap-6">
          {[
            { name: "Flat", shadow: "none", bg: "#FFFFFF" },
            { name: "Lifted", shadow: "0 2px 8px rgba(0,0,0,0.06)", bg: "#FFFFFF" },
            { name: "Raised", shadow: "0 4px 16px rgba(0,0,0,0.10)", bg: "#FFFFFF" },
            { name: "Floating", shadow: "0 8px 32px rgba(0,0,0,0.14)", bg: "#FFFFFF" },
          ].map((e) => (
            <div key={e.name} className="flex flex-col items-center gap-2">
              <div
                className="w-20 h-14 rounded-2xl"
                style={{ background: e.bg, boxShadow: e.shadow, border: e.shadow === "none" ? "1px solid #EEEEEA" : "none" }}
              />
              <p className="ds-caption text-[#1A1A1A]">{e.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── SHARED ─────────────────────────── */
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <h2
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "22px",
          fontWeight: 700,
          color: "#1A1A1A",
        }}
      >
        {children}
      </h2>
      <div className="flex-1 h-px bg-[#EEEEEA]" />
    </div>
  );
}

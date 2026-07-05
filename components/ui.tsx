"use client";

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-[var(--shadow-card)] ${className}`}>
      {children}
    </div>
  );
}

export function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h1 className="text-2xl font-semibold text-ink">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
    </div>
  );
}

export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-[var(--radius-pill)] bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
      {children}
    </span>
  );
}

export function PracticeButton({ done, onClick }: { done: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-[var(--radius-pill)] px-4 py-2 text-sm font-medium transition ${
        done ? "bg-accent-soft text-accent" : "bg-accent text-accent-fg hover:opacity-90"
      }`}
    >
      {done ? "Practiced ✓" : "Mark practiced"}
    </button>
  );
}

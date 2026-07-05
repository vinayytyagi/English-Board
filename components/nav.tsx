"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const NAV_ITEMS = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/intros", label: "Intros", icon: "🙋" },
  { href: "/situations", label: "Situations", icon: "🎯" },
  { href: "/wording", label: "Wording", icon: "✨" },
  { href: "/toolkit", label: "Toolkit", icon: "🧰" },
  { href: "/practice", label: "Practice", icon: "🔥" },
];

export function Sidebar() {
  const path = usePathname();
  return (
    <aside className="hidden md:flex md:flex-col md:w-60 shrink-0 border-r border-line bg-surface p-4">
      <div className="px-2 py-3 text-lg font-semibold text-ink">English Board</div>
      <nav className="mt-2 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = path === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-[var(--radius-pill)] px-3 py-2 text-sm ${
                active ? "bg-accent-soft text-accent font-medium" : "text-muted hover:bg-app"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export function MobileTabBar() {
  const path = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-10 border-t border-line bg-surface flex justify-around px-1 py-1.5">
      {NAV_ITEMS.map((item) => {
        const active = path === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 rounded-lg px-2 py-1 text-[11px] ${
              active ? "text-accent font-medium" : "text-muted"
            }`}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

"use client";

import { Moon, Sun } from "lucide-react";
import { useTransition } from "react";
import { setAdminTheme } from "@/server/actions/ui.actions";

export default function ThemeToggle({ initial }: { initial: "light" | "dark" }) {
  const [, start] = useTransition();
  const toggle = () => {
    const root = document.querySelector<HTMLElement>(".admin-root");
    const next = root?.dataset.theme === "dark" ? "light" : "dark";
    if (root) root.dataset.theme = next;
    start(() => setAdminTheme(next));
  };
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-a-bd bg-a-card text-a-t2 transition-colors hover:text-a-t1"
    >
      {/* Both icons rendered; CSS picks one so it never mismatches the server. */}
      <Moon size={18} strokeWidth={1.8} className="[.admin-root[data-theme=dark]_&]:hidden" data-initial={initial} />
      <Sun size={18} strokeWidth={1.8} className="hidden [.admin-root[data-theme=dark]_&]:block" />
    </button>
  );
}

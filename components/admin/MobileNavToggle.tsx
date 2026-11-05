"use client";

import { PanelLeft } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Opens/closes the sidebar drawer on small screens by flipping a data attribute. */
export default function MobileNavToggle() {
  const pathname = usePathname();
  // Close the drawer after navigating.
  useEffect(() => {
    document.querySelector<HTMLElement>(".admin-root")?.removeAttribute("data-nav");
  }, [pathname]);
  return (
    <button
      type="button"
      aria-label="Toggle navigation"
      onClick={() => {
        const root = document.querySelector<HTMLElement>(".admin-root");
        if (!root) return;
        if (root.dataset.nav === "open") root.removeAttribute("data-nav");
        else root.dataset.nav = "open";
      }}
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-a-bd bg-a-card text-a-t2 hover:text-a-t1 lg:hidden"
    >
      <PanelLeft size={18} strokeWidth={1.8} />
    </button>
  );
}

"use client";

import { useId, useState } from "react";
import type { AccordionEntry } from "@/content/site";

export default function Accordion({
  items,
  defaultOpen = 0,
}: {
  items: AccordionEntry[];
  defaultOpen?: number;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();

  return (
    <div className="border-b border-white/10">
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `${id}-panel-${i}`;
        return (
          <div key={item.title} className="border-t border-white/10">
            <h3 className="m-0">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex w-full cursor-pointer items-center gap-[22px] border-0 bg-transparent px-1 py-5 text-left text-inherit"
              >
                <span className="font-mono text-xs tracking-[0.18em] text-accent/70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-[18.5px] font-semibold tracking-[-0.01em] text-white">
                  {item.title}
                </span>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden
                  className={`shrink-0 text-accent transition-transform duration-[450ms] ease-luxe ${
                    isOpen ? "rotate-45" : ""
                  }`}
                >
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </svg>
              </button>
            </h3>
            <div
              id={panelId}
              className="grid transition-[grid-template-rows] duration-[450ms] ease-luxe"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="m-0 max-w-[640px] pt-0 pr-1 pb-6 pl-[52px] font-body text-[15.5px] leading-[1.7] text-white/60">
                  {item.content}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

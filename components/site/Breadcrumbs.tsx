import Link from "next/link";
import JsonLd from "@/components/site/JsonLd";
import { absoluteUrl } from "@/lib/site-url";

export default function Breadcrumbs({ items }: { items: { label: string; href: string }[] }) {
  return (
    <>
      <nav aria-label="Breadcrumb" className="font-mono text-[11.5px] tracking-[0.14em] text-white/45 uppercase">
        <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0">
          {items.map((it, i) => (
            <li key={it.href} className="flex items-center gap-2">
              {i > 0 ? <span aria-hidden>/</span> : null}
              {i === items.length - 1 ? (
                <span aria-current="page" className="text-white/75">{it.label}</span>
              ) : (
                <Link href={it.href} className="text-white/45 no-underline hover:text-accent">
                  {it.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.label, item: absoluteUrl(it.href) })),
        }}
      />
    </>
  );
}

import Image from "next/image";

/**
 * A service's hero image, or a generated brand gradient when none is set.
 * Uses next/image: responsive srcset, AVIF/WebP, lazy unless `priority`.
 */
export default function ServiceArt({
  src,
  alt,
  seed,
  label,
  priority = false,
  sizes,
  className = "",
}: {
  src: string | null;
  alt: string | null;
  seed: number;
  label?: string;
  priority?: boolean;
  sizes: string;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {src ? (
        <Image src={src} alt={alt ?? ""} fill priority={priority} sizes={sizes} className="object-cover" />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `radial-gradient(120% 90% at ${18 + ((seed * 29) % 64)}% 8%, #49DC7A 0%, #1E8F66 40%, #0B3B2A 70%, #040A0A 100%)`,
          }}
        >
          <div className="absolute inset-0 bg-[repeating-linear-gradient(115deg,rgba(255,255,255,0.05)_0_1px,transparent_1px_22px)]" />
          {label ? (
            <span className="absolute right-5 bottom-3 font-[family-name:var(--font-oswald)] text-[clamp(56px,9vw,120px)] leading-none font-semibold text-white/12 uppercase">
              {label}
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
}

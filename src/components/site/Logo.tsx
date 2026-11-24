import { Link } from "@tanstack/react-router";
import emblem from "@/assets/codestars_emblem.png.asset.json";
import fullLogo from "@/assets/codestars_logo.png.asset.json";

export function FullLogo({ className = "" }: { className?: string }) {
  return <img src={fullLogo.url} alt="CodeStars — Ideas. Innovation. Impact." className={className} />;
}

export function StarMark({ className = "h-6 w-6" }: { className?: string }) {
  // Five-point star echoing Liberia's Lone Star — interim mark until the official logo is supplied.
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path fill="currentColor" d="M12 1.5l3.1 7.1 7.7.7-5.8 5.1 1.7 7.6L12 18l-6.7 4 1.7-7.6L1.2 9.3l7.7-.7z" />
    </svg>
  );
}

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2" aria-label="CodeStars home">
      <span className="flex h-9 w-9 items-center justify-center bg-secondary"><img src={emblem.url} alt="" className="h-7 w-7 object-contain" /></span>
      <span className={`font-display text-xl font-semibold tracking-tight ${inverted ? "text-secondary-foreground" : "text-foreground"}`}>
        CodeStars
      </span>
    </Link>
  );
}

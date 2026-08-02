import Link from "next/link";
import { type Kid, chipStyle } from "@/lib/mock-kids";

const chevronIcon = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#CBB89F"
    strokeWidth={2.2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

function ageLabel(years: number): string {
  return years === 1 ? "1 año" : `${years} años`;
}

function parentsLabel(count: number): string {
  if (count === 0) return "sin padres vinculados";
  if (count === 1) return "1 padre vinculado";
  return `${count} padres vinculados`;
}

export function KidCard({ kid }: { kid: Kid }) {
  return (
    <Link
      href={`/kids/${kid.slug}`}
      className="flex items-center gap-[14px] min-w-0 bg-surface border border-border rounded-[18px] p-4 shadow-[0_4px_14px_-12px_rgba(120,90,60,.5)] transition duration-150 hover:border-[#F2A78E] hover:-translate-y-0.5"
    >
      <span
        className="w-12 h-12 rounded-full font-display font-semibold text-[19px] flex items-center justify-center flex-none"
        style={{ backgroundColor: kid.avatarBg, color: kid.avatarColor }}
      >
        {kid.initial}
      </span>
      <div className="flex-1 min-w-0">
        <div className="font-display font-semibold text-[16px] text-ink">
          {kid.name}
        </div>
        <div className="text-[13px] text-aux">
          {ageLabel(kid.ageYears)} · {parentsLabel(kid.parentsCount)}
        </div>
      </div>
      {kid.chip !== null ? (
        <span
          className="flex-none text-[11px] font-extrabold px-[9px] py-[5px] rounded-full"
          style={{
            backgroundColor: chipStyle[kid.chip].bg,
            color: chipStyle[kid.chip].color,
          }}
        >
          {kid.chip}
        </span>
      ) : (
        <span className="flex-none">{chevronIcon}</span>
      )}
    </Link>
  );
}

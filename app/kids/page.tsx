import { Sidebar } from "../_components/sidebar";
import { BottomNav } from "../_components/bottom-nav";
import { Fab } from "../_components/fab";
import { KidCard } from "../_components/kid-card";
import { kids } from "@/lib/mock-kids";

const plusIcon = (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#fff"
    strokeWidth={2.4}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const searchIcon = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#B0A290"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export default function KidsPage() {
  return (
    <div className="flex min-h-screen bg-canvas">
      <div className="hidden lg:block">
        <Sidebar active="niños" />
      </div>

      <BottomNav active="niños" />
      <Fab />

      <main className="flex-1 min-w-0 h-screen overflow-y-auto">
        <div className="w-full max-w-[880px] mx-auto pt-[34px] px-4 md:px-10 pb-[88px] md:pb-20">
          <header className="flex items-end justify-between gap-4 mb-[22px]">
            <div>
              <div className="text-[12.5px] font-extrabold tracking-[0.8px] text-[#D9583C] mb-1">
                GESTIÓN
              </div>
              <h1 className="font-display font-semibold text-[30px] text-ink m-0">
                Niños
              </h1>
            </div>
            <a
              href="#"
              className="flex items-center gap-2 py-[11px] px-[18px] rounded-[14px] bg-[linear-gradient(180deg,#F4977E,#EE8164)] text-white font-extrabold text-[14.5px] shadow-[0_8px_18px_-8px_rgba(238,129,100,.7)]"
            >
              {plusIcon}
              Agregar niño
            </a>
          </header>

          <div className="flex items-center gap-[11px] bg-surface border border-border rounded-[14px] py-3 px-4 mb-[22px]">
            {searchIcon}
            <input
              type="text"
              placeholder="Buscar niño…"
              className="flex-1 border-none bg-transparent text-[15px] text-ink focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3 mb-[14px]">
            <span className="text-[12.5px] font-extrabold tracking-[0.8px] text-ink">
              SALA SOLES
            </span>
            <span className="text-[13px] text-aux">8 niños</span>
            <span className="flex-1 h-px bg-rule" />
          </div>

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-[14px]">
            {kids.map((kid) => (
              <KidCard key={kid.slug} kid={kid} />
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}

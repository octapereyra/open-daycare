import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Sidebar } from "../../_components/sidebar";
import { BottomNav } from "../../_components/bottom-nav";
import { Fab } from "../../_components/fab";
import { kids, parentStatusStyle } from "@/lib/mock-kids";

export function generateStaticParams() {
  return kids.map((kid) => ({ id: kid.slug }));
}

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const kid = kids.find((k) => k.slug === id);
  return { title: kid ? `${kid.name} · OpenDaycare` : "OpenDaycare" };
}

const chevronLeftIcon = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const warningIcon = (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#fff"
    strokeWidth={2.2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
    <path d="M12 9v4M12 17h.01" />
  </svg>
);

const sunIcon = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#fff"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

const plusIcon = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export default async function KidProfilePage({ params }: Props) {
  const { id } = await params;
  const kid = kids.find((k) => k.slug === id);
  if (!kid) notFound();

  return (
    <div className="flex min-h-screen bg-canvas">
      <div className="hidden lg:block">
        <Sidebar active="niños" />
      </div>
      <BottomNav active="niños" />
      <Fab />

      <main className="flex-1 min-w-0 h-screen overflow-y-auto">
        <div className="w-full max-w-[820px] mx-auto pt-[34px] px-4 md:px-10 pb-[88px] md:pb-20">
          <Link
            href="/kids"
            className="inline-flex items-center gap-[7px] text-muted font-bold text-[14px] mb-5"
          >
            {chevronLeftIcon}
            Volver a Niños
          </Link>

          <div className="flex flex-col gap-[18px] lg:flex-row lg:gap-[26px] lg:items-start">
            <div className="flex-1 min-w-0 lg:min-w-[300px] flex flex-col gap-[18px]">
              <div className="flex items-center gap-[18px]">
                <span
                  className="w-[84px] h-[84px] rounded-full font-display font-semibold text-[34px] flex items-center justify-center flex-none"
                  style={{ backgroundColor: kid.avatarBg, color: kid.avatarColor }}
                >
                  {kid.initial}
                </span>
                <div className="flex-1 min-w-0">
                  <h1 className="font-display font-semibold text-[28px] text-ink m-0">
                    {kid.name}
                  </h1>
                  <p className="text-muted text-[15px] mt-[3px] mb-0">
                    {kid.ageYears === 1 ? "1 año" : `${kid.ageYears} años`} · Sala{" "}
                    {kid.room}
                  </p>
                </div>
                <a
                  href="#"
                  className="border-[1.5px] border-border bg-surface text-[#6E6359] font-bold text-[14px] py-[9px] px-4 rounded-xl"
                >
                  Editar
                </a>
              </div>

              {kid.allergiesNote && (
                <div className="flex gap-[14px] bg-[#FBDAD6] rounded-2xl py-4 px-[18px]">
                  <span className="w-10 h-10 rounded-[11px] bg-[#F4A8A0] flex items-center justify-center flex-none">
                    {warningIcon}
                  </span>
                  <div>
                    <div className="font-extrabold text-[#C5413A] text-[15px] mb-[2px]">
                      {kid.allergiesNote.title}
                    </div>
                    <div className="text-[#B25249] text-[14.5px] leading-[1.5]">
                      {kid.allergiesNote.text}
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-surface border border-border rounded-2xl overflow-hidden">
                <div className="flex justify-between py-[15px] px-[18px] border-b border-[#F0E6D8]">
                  <span className="text-muted text-[14.5px]">Fecha de nacimiento</span>
                  <span className="font-extrabold text-ink text-[14.5px]">
                    {kid.birthDate}
                  </span>
                </div>
                <div className="flex justify-between py-[15px] px-[18px] border-b border-[#F0E6D8]">
                  <span className="text-muted text-[14.5px]">Sala</span>
                  <span className="font-extrabold text-ink text-[14.5px]">
                    {kid.room}
                  </span>
                </div>
                <div className="flex justify-between py-[15px] px-[18px]">
                  <span className="text-muted text-[14.5px]">Ingreso</span>
                  <span className="font-extrabold text-ink text-[14.5px]">
                    {kid.enrolled}
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-[300px] flex-none flex flex-col gap-[14px]">
              <a
                href="#"
                className="flex items-center justify-center gap-[9px] w-full py-[13px] rounded-[14px] bg-ink text-white font-extrabold text-[15px]"
              >
                {sunIcon}
                Resumen del día
              </a>

              <div className="bg-surface border border-border rounded-2xl py-4 px-[18px]">
                <div className="text-[12.5px] font-extrabold tracking-[0.8px] text-[#8A7C6D] mb-[14px]">
                  PADRES VINCULADOS
                </div>
                <div className="flex flex-col gap-[14px]">
                  {kid.parents.map((parent) => {
                    const style = parentStatusStyle[parent.status];
                    return (
                      <div
                        key={parent.name}
                        className="flex items-center gap-3"
                      >
                        <span
                          className="w-10 h-10 rounded-full font-display font-semibold text-[16px] flex items-center justify-center flex-none"
                          style={{
                            backgroundColor: parent.avatarBg,
                            color: parent.avatarColor,
                          }}
                        >
                          {parent.initial}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="font-extrabold text-[14.5px] text-ink">
                            {parent.name}
                          </div>
                          <div className="text-[12.5px] text-aux">
                            {parent.relation}
                          </div>
                        </div>
                        <span
                          className="flex-none text-[10.5px] font-extrabold px-[9px] py-[4px] rounded-full"
                          style={{
                            backgroundColor: style.bg,
                            color: style.color,
                          }}
                        >
                          {parent.status === "active" ? "ACTIVA" : "PENDIENTE"}
                        </span>
                      </div>
                    );
                  })}

                  <a href="#" className="flex items-center gap-3 pt-2">
                    <span className="w-10 h-10 rounded-full border-[1.5px] border-dashed border-[#D8CBBA] text-[#B0A290] flex items-center justify-center flex-none">
                      {plusIcon}
                    </span>
                    <span className="font-extrabold text-[14.5px] text-[#C5503A]">
                      Vincular otro padre
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

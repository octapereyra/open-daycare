import type { ReactNode } from "react";

type NavItem = {
  label: string;
  active?: boolean;
  icon: ReactNode;
};

const feedIcon = (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
  </svg>
);

const ninosIcon = (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="9" cy="7" r="3" />
    <circle cx="17" cy="9" r="2.4" />
    <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 20a5 5 0 0 1 5.5-4.9" />
  </svg>
);

const avisosIcon = (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" />
  </svg>
);

const cuentaIcon = (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const logoutIcon = (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
  </svg>
);

const navItems: NavItem[] = [
  { label: "Feed", active: true, icon: feedIcon },
  { label: "Niños", icon: ninosIcon },
  { label: "Avisos", icon: avisosIcon },
  { label: "Mi cuenta", icon: cuentaIcon },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-surface border-t border-border px-2 pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-between h-16">
        {navItems.map((item) => (
          <a
            key={item.label}
            href="#"
            className={[
              "flex flex-col items-center justify-center gap-1 flex-1 min-w-0 py-1",
              item.active
                ? "text-[#D9583C]"
                : "text-[#6E6359]",
            ].join(" ")}
          >
            {item.icon}
            <span className="text-[11px] font-semibold">{item.label}</span>
          </a>
        ))}

        <a
          href="#"
          title="Cerrar sesión"
          className="flex flex-col items-center justify-center gap-1 flex-1 min-w-0 py-1 text-[#6E6359]"
        >
          {logoutIcon}
          <span className="text-[11px] font-semibold">Salir</span>
        </a>
      </div>
    </nav>
  );
}

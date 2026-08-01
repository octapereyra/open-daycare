const plusIcon = (
  <svg
    width="24"
    height="24"
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

export function Fab() {
  return (
    <a
      href="#"
      className="fixed z-50 lg:hidden right-4 bottom-20 w-14 h-14 rounded-full bg-[linear-gradient(180deg,#F4977E,#EE8164)] text-white shadow-[0_8px_18px_-8px_rgba(238,129,100,.75)] flex items-center justify-center"
      aria-label="Nueva publicación"
    >
      {plusIcon}
    </a>
  );
}

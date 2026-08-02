import { Sidebar } from "./_components/sidebar";
import { PostCard } from "./_components/post-card";
import { BottomNav } from "./_components/bottom-nav";
import { Fab } from "./_components/fab";
import { mockPosts } from "@/lib/mock-feed";

const cameraIcon = (
  <svg
    width="19"
    height="19"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

export default function Home() {
  return (
    <div className="flex min-h-screen bg-canvas">
      <div className="hidden lg:block">
        <Sidebar active="feed" />
      </div>

      <BottomNav active="feed" />
      <Fab />

      <main className="flex-1 min-w-0 h-screen overflow-y-auto">
        <div className="w-full max-w-[760px] mx-auto pt-[34px] px-4 md:px-10 pb-[88px] md:pb-20">
          <header className="mb-6">
            <div className="text-[12.5px] font-extrabold tracking-[0.8px] text-[#D9583C] mb-1">
              GUARDERÍA · SALA SOLES
            </div>
            <h1 className="font-display font-semibold text-[30px] text-ink">
              Buenas, Caro
            </h1>
            <p className="text-[14.5px] text-muted mt-[5px]">
              12 niños · martes 17 jun
            </p>
          </header>

          <a
            href="#"
            className="flex items-center gap-[14px] bg-surface border border-border rounded-[18px] py-[14px] px-[18px] mb-6 shadow-[0_4px_14px_-10px_rgba(120,90,60,.4)]"
          >
            <span className="w-10 h-10 rounded-full bg-coral text-white font-display font-semibold text-base flex items-center justify-center flex-none">
              C
            </span>
            <span className="flex-1 text-[15px] text-aux">
              Compartí un momento…
            </span>
            <span className="w-[38px] h-[38px] rounded-xl bg-[#FBE3D8] text-[#E0654A] flex items-center justify-center flex-none">
              {cameraIcon}
            </span>
          </a>

          <div className="flex items-center gap-[14px] mb-[14px]">
            <span className="text-[12.5px] font-extrabold tracking-[0.8px] text-[#8A7C6D]">
              PUBLICADO HOY
            </span>
            <span className="flex-1 h-[1px] bg-rule" />
          </div>

          <section className="flex flex-col gap-4">
            {mockPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}

import type { Post } from "@/lib/mock-feed";

const heartIcon = (
  <svg
    width="19"
    height="19"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z" />
  </svg>
);

const commentIcon = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z" />
  </svg>
);

const megaphoneIcon = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m3 11 18-5v12L3 14v-3zM11.6 16.8a3 3 0 1 1-5.8-1.6" />
  </svg>
);

const photoPlaceholderIcon = (
  <svg
    width="30"
    height="30"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.7}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.6-3.6a2 2 0 0 0-2.8 0L6 21" />
  </svg>
);

const badgeLabels: Record<Post["type"], string> = {
  achievement: "LOGRO",
  activity: "ACTIVIDAD",
  announcement: "ANUNCIO",
};

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="bg-surface border border-border rounded-[20px] p-5 pr-[22px] shadow-[0_4px_16px_-12px_rgba(120,90,60,.5)]">
      <div className="flex items-center gap-3 mb-[14px]">
        <span
          className="w-11 h-11 rounded-full font-display font-semibold text-[17px] flex items-center justify-center flex-none"
          style={{ backgroundColor: post.author.avatarBg, color: post.author.avatarColor }}
        >
          {post.author.useIcon ? megaphoneIcon : post.author.initial}
        </span>

        <span className="flex-1 min-w-0">
          <span className="block font-display font-semibold text-[16.5px] text-ink">
            {post.author.name}
          </span>
          <span className="block text-[12.5px] text-aux">
            {post.time} · {post.authorLabel}
          </span>
        </span>

        <span
          className="flex items-center gap-[7px] px-3 py-[6px] rounded-full text-[12px] font-extrabold uppercase tracking-[0.5px]"
          style={{ backgroundColor: post.badgeBg, color: post.badgeColor }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: post.badgeColor }}
          />
          {badgeLabels[post.type]}
        </span>
      </div>

      <div className="text-[12.5px] text-aux mb-[10px]">
        Para: {post.audience}
      </div>

      <p className="text-[15.5px] leading-[1.55] text-[#4A4038] m-0">
        {post.body}
      </p>

      {post.photoPlaceholder && (
        <a
          href="#"
          className="flex flex-col items-center justify-center gap-2 mt-[14px] h-[200px] border-[1.5px] border-dashed border-[#DBCDBA] rounded-2xl bg-[#F4ECE1] text-[#B0A290]"
        >
          {photoPlaceholderIcon}
          <span className="text-[13.5px]">{post.photoPlaceholder}</span>
        </a>
      )}

      <footer className="flex items-center gap-[18px] mt-4 pt-[14px] border-t border-[#F0E6D8]">
        <span className="flex items-center gap-[7px] text-[#E0654A] font-bold text-sm">
          {heartIcon}
          {post.likes}
        </span>

        <a
          href="#"
          className="flex items-center gap-[7px] text-muted font-bold text-sm"
        >
          {commentIcon}
          {post.comments}
        </a>

        <span className="flex-1" />

        <a href="#" className="text-[#C5503A] font-extrabold text-sm">
          Editar
        </a>
      </footer>
    </article>
  );
}

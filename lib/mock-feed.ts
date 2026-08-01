export type PostType = "achievement" | "activity" | "announcement";

export interface PostAuthor {
  initial: string;
  name: string;
  avatarBg: string;
  avatarColor: string;
  useIcon?: boolean;
}

export interface Post {
  id: string;
  type: PostType;
  author: PostAuthor;
  time: string;
  authorLabel: string;
  audience: string;
  body: string;
  likes: number;
  comments: number;
  photoPlaceholder?: string;
  badgeBg: string;
  badgeColor: string;
}

export const mockPosts: Post[] = [
  {
    id: "p-logro-mateo",
    type: "achievement",
    author: {
      initial: "M",
      name: "Mateo",
      avatarBg: "#A9D9E8",
      avatarColor: "#1F7A93",
    },
    time: "14:20",
    authorLabel: "publicado por vos",
    audience: "familia de Mateo",
    body: "¡Usó el orinal solito por primera vez! Estaba feliz de contárselo a todos. Un gran paso.",
    likes: 3,
    comments: 1,
    badgeBg: "#CFEBD8",
    badgeColor: "#3E9B6C",
  },
  {
    id: "p-actividad-mateo",
    type: "activity",
    author: {
      initial: "M",
      name: "Mateo",
      avatarBg: "#A9D9E8",
      avatarColor: "#1F7A93",
    },
    time: "09:40",
    authorLabel: "publicado por vos",
    audience: "familia de Mateo",
    body: "Pintamos con témperas esta mañana. Mateo eligió el azul para todo y se concentró un montón mezclando colores.",
    likes: 5,
    comments: 2,
    photoPlaceholder: "Foto · pintando con témperas",
    badgeBg: "#C7E7F1",
    badgeColor: "#2E89A6",
  },
  {
    id: "p-anuncio-general",
    type: "announcement",
    author: {
      initial: "",
      name: "Anuncio general",
      avatarBg: "#CCD8F4",
      avatarColor: "#4E72C8",
      useIcon: true,
    },
    time: "07:50",
    authorLabel: "publicado por vos",
    audience: "toda la sala",
    body: "El viernes salimos al parque por la mañana. Recuerden mandar gorra y una botellita de agua.",
    likes: 8,
    comments: 0,
    badgeBg: "#CCD8F4",
    badgeColor: "#4E72C8",
  },
];

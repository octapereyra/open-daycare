export type ParentStatus = "active" | "pending";

export interface Parent {
  initial: string;
  name: string;
  relation: string;
  avatarBg: string;
  avatarColor: string;
  status: ParentStatus;
}

export type KidChip = "MANÍ" | "LACTOSA" | "VINCULAR" | null;

export interface Kid {
  slug: string;
  name: string;
  initial: string;
  avatarBg: string;
  avatarColor: string;
  ageYears: number;
  parentsCount: number;
  chip: KidChip;
  birthDate: string;
  room: string;
  enrolled: string;
  allergiesNote?: { title: string; text: string };
  parents: Parent[];
}

export const chipStyle: Record<
  Exclude<KidChip, null>,
  { bg: string; color: string }
> = {
  "MANÍ": { bg: "#FBD8CC", color: "#D9684A" },
  "LACTOSA": { bg: "#FBD8CC", color: "#D9684A" },
  "VINCULAR": { bg: "#F9D2DE", color: "#C56486" },
};

export const parentStatusStyle: Record<
  ParentStatus,
  { bg: string; color: string }
> = {
  active: { bg: "#CFEBD8", color: "#3E9B6C" },
  pending: { bg: "#F7E7A6", color: "#9A7B1E" },
};

export const kids: Kid[] = [
  {
    slug: "mateo-fernandez",
    name: "Mateo Fernández",
    initial: "M",
    avatarBg: "#A9D9E8",
    avatarColor: "#1F7A93",
    ageYears: 3,
    parentsCount: 2,
    chip: "MANÍ",
    birthDate: "12 mar 2022",
    room: "Soles",
    enrolled: "feb 2025",
    allergiesNote: {
      title: "Alergias y notas",
      text: "Alergia al maní. Evitar frutos secos. Lleva inhalador en la mochila.",
    },
    parents: [
      {
        initial: "L",
        name: "Lucía Fernández",
        relation: "Mamá · activa",
        avatarBg: "#C9B6E8",
        avatarColor: "#fff",
        status: "active",
      },
      {
        initial: "D",
        name: "Diego Fernández",
        relation: "Papá · invitación enviada",
        avatarBg: "#A9C7E8",
        avatarColor: "#fff",
        status: "pending",
      },
    ],
  },
  {
    slug: "sofia-mendez",
    name: "Sofía Méndez",
    initial: "S",
    avatarBg: "#F4B8CC",
    avatarColor: "#C44A7A",
    ageYears: 2,
    parentsCount: 1,
    chip: null,
    birthDate: "18 jul 2022",
    room: "Soles",
    enrolled: "mar 2024",
    parents: [
      {
        initial: "C",
        name: "Camila Méndez",
        relation: "Mamá · activa",
        avatarBg: "#F4B8CC",
        avatarColor: "#fff",
        status: "active",
      },
    ],
  },
  {
    slug: "benjamin-ruiz",
    name: "Benjamín Ruiz",
    initial: "B",
    avatarBg: "#B9DEC4",
    avatarColor: "#3E8B62",
    ageYears: 3,
    parentsCount: 2,
    chip: null,
    birthDate: "5 oct 2021",
    room: "Soles",
    enrolled: "ago 2024",
    parents: [
      {
        initial: "M",
        name: "Mariana Ruiz",
        relation: "Mamá · activa",
        avatarBg: "#B9DEC4",
        avatarColor: "#fff",
        status: "active",
      },
      {
        initial: "F",
        name: "Federico Ruiz",
        relation: "Papá · activa",
        avatarBg: "#C9B6E8",
        avatarColor: "#fff",
        status: "active",
      },
    ],
  },
  {
    slug: "valentina-soto",
    name: "Valentina Soto",
    initial: "V",
    avatarBg: "#F4DC8E",
    avatarColor: "#9A7B1E",
    ageYears: 2,
    parentsCount: 0,
    chip: "VINCULAR",
    birthDate: "22 feb 2023",
    room: "Soles",
    enrolled: "abr 2025",
    parents: [],
  },
  {
    slug: "tomas-diaz",
    name: "Tomás Díaz",
    initial: "T",
    avatarBg: "#C9B6E8",
    avatarColor: "#7B5FC0",
    ageYears: 3,
    parentsCount: 1,
    chip: "LACTOSA",
    birthDate: "9 ene 2022",
    room: "Soles",
    enrolled: "mar 2024",
    allergiesNote: {
      title: "Alergias y notas",
      text: "Intolerancia a la lactosa. Se sirve yogur vegetal en las meriendas.",
    },
    parents: [
      {
        initial: "P",
        name: "Patricia Díaz",
        relation: "Mamá · activa",
        avatarBg: "#A9D9E8",
        avatarColor: "#fff",
        status: "active",
      },
    ],
  },
  {
    slug: "emma-castro",
    name: "Emma Castro",
    initial: "E",
    avatarBg: "#F4B8CC",
    avatarColor: "#C44A7A",
    ageYears: 2,
    parentsCount: 1,
    chip: null,
    birthDate: "3 nov 2022",
    room: "Soles",
    enrolled: "may 2025",
    parents: [
      {
        initial: "J",
        name: "Julián Castro",
        relation: "Papá · activa",
        avatarBg: "#F4DC8E",
        avatarColor: "#fff",
        status: "active",
      },
    ],
  },
  {
    slug: "lucas-romero",
    name: "Lucas Romero",
    initial: "L",
    avatarBg: "#A9D9E8",
    avatarColor: "#1F7A93",
    ageYears: 3,
    parentsCount: 1,
    chip: null,
    birthDate: "30 may 2022",
    room: "Soles",
    enrolled: "feb 2024",
    parents: [
      {
        initial: "R",
        name: "Romina Romero",
        relation: "Mamá · invitación enviada",
        avatarBg: "#B9DEC4",
        avatarColor: "#fff",
        status: "pending",
      },
    ],
  },
  {
    slug: "olivia-vega",
    name: "Olivia Vega",
    initial: "O",
    avatarBg: "#B9DEC4",
    avatarColor: "#3E8B62",
    ageYears: 2,
    parentsCount: 1,
    chip: null,
    birthDate: "14 ago 2023",
    room: "Soles",
    enrolled: "jun 2025",
    parents: [
      {
        initial: "A",
        name: "Andrés Vega",
        relation: "Papá · activa",
        avatarBg: "#C9B6E8",
        avatarColor: "#fff",
        status: "active",
      },
    ],
  },
];

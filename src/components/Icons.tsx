import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };

const base = (size = 20): SVGProps<SVGSVGElement> => ({
  width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
  strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round",
});

const mk = (d: string) => ({ size, ...rest }: P) => (
  <svg {...base(size)} {...rest}><path d={d} /></svg>
);

export const IconBag = mk("M5 8h14l-1 12H6L5 8Zm4 0V6a3 3 0 0 1 6 0v2");
export const IconHeart = ({ size, filled, ...rest }: P & { filled?: boolean }) => (
  <svg {...base(size)} {...rest} fill={filled ? "currentColor" : "none"}>
    <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
  </svg>
);
export const IconUser = mk("M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0");
export const IconSearch = mk("M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm9 2-4-4");
export const IconMenu = mk("M4 7h16M4 12h16M4 17h10");
export const IconClose = mk("M6 6l12 12M18 6 6 18");
export const IconHome = mk("M4 11 12 4l8 7v9h-5v-6H9v6H4v-9Z");
export const IconGrid = mk("M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z");
export const IconBook = mk("M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Zm0 16a2 2 0 0 1 2-2h13");
export const IconPlay = ({ size, ...rest }: P) => (
  <svg {...base(size)} {...rest} fill="currentColor" stroke="none"><path d="M8 5.5v13l11-6.5-11-6.5Z" /></svg>
);
export const IconTruck = mk("M3 6h11v10H3zM14 10h4l3 3v3h-7M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z");
export const IconReturn = mk("M9 14 4 9l5-5M4 9h11a5 5 0 0 1 0 10h-3");
export const IconShield = mk("M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z");
export const IconSpark = mk("M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6");
export const IconCheck = mk("M5 12.5 10 17l9-10");
export const IconPlus = mk("M12 5v14M5 12h14");
export const IconMinus = mk("M5 12h14");
export const IconChevron = mk("M9 6l6 6-6 6");
export const IconFilter = mk("M4 6h16M7 12h10M10 18h4");
export const IconInstagram = mk("M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm5 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm5-9.5h.01");
export const IconUpload = mk("M12 16V4m0 0-4 4m4-4 4 4M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3");
export const IconTrash = mk("M5 7h14M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3");
export const IconEdit = mk("M4 20h4L19 9l-4-4L4 16v4Z");
export const IconChart = mk("M4 20V10M10 20V4M16 20v-7M22 20H2");
export const IconBox = mk("M3 7l9-4 9 4-9 4-9-4Zm0 0v10l9 4 9-4V7M12 11v10");
export const IconFile = mk("M6 3h8l5 5v13H6V3Zm8 0v5h5M9 13h7M9 17h5");
export const IconReceipt = mk("M6 3h12v18l-3-2-3 2-3-2-3 2V3Zm3 5h6M9 12h6");
export const IconUsers = mk("M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM2 20a7 7 0 0 1 14 0M16 4a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 4 6");
export const IconCog = mk("M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7.4-3a7.4 7.4 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7 7 0 0 0-2-1.2L14.5 3h-5l-.4 2.6a7 7 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6a7.4 7.4 0 0 0 0 2.4l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 2 1.2l.4 2.6h5l.4-2.6a7 7 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2Z");
export const IconLogout = mk("M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10");
export const IconExternal = mk("M14 4h6v6M20 4l-9 9M18 14v6H4V6h6");

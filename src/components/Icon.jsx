import React from "react";

// Small stroke icons drawn for this page (24×24 grid).
const PATHS = {
  bot: "M12 3v3M7 8h10a3 3 0 013 3v5a3 3 0 01-3 3H7a3 3 0 01-3-3v-5a3 3 0 013-3zM9 13h.01M15 13h.01M9.5 16.5h5",
  inbox: "M4 13l2.5-7h11L20 13M4 13v5a1 1 0 001 1h14a1 1 0 001-1v-5M4 13h4.5l1.5 2.5h4l1.5-2.5H20",
  megaphone: "M4 10v4a1 1 0 001 1h2l5 4V5L7 9H5a1 1 0 00-1 1zM16 9a4 4 0 010 6M18.5 6.5a7.5 7.5 0 010 11",
  flow: "M6 4h4v4H6zM14 16h4v4h-4zM8 8v4a2 2 0 002 2h6v2",
  gift: "M4 10h16v10H4zM3 7h18v3H3zM12 7v13M12 7c-1.5-3-5-3-5-1s3 1 5 1zm0 0c1.5-3 5-3 5-1s-3 1-5 1z",
  chart: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  agents: "M8 11a3 3 0 100-6 3 3 0 000 6zM16 11a3 3 0 100-6 3 3 0 000 6zM3 20a5 5 0 0110 0M11 20a5 5 0 0110 0",
  ads: "M4 5h16v11H4zM9 20h6M12 16v4M8 12l2.5-3 2 2L16 8",
  check: "M5 12.5l4.2 4.2L19 7",
  dumbbell: "M6 8v8M3 10v4M18 8v8M21 10v4M6 12h12",
  cup: "M5 8h11v6a5 5 0 01-5 5h-1a5 5 0 01-5-5zM16 10h1.5a2.5 2.5 0 010 5H16M8 3v2M11 3v2",
  wifi: "M2.5 9a14 14 0 0119 0M5.5 12.5a9.5 9.5 0 0113 0M8.5 16a5 5 0 017 0M12 19.5h.01",
  store: "M4 9l1.5-5h13L20 9M4 9v11h16V9M4 9a2.7 2.7 0 005.3 0 2.7 2.7 0 005.4 0A2.7 2.7 0 0020 9M10 20v-5h4v5",
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "M6 6l12 12M18 6L6 18",
  chevron: "M6 9l6 6 6-6",
};

export default function Icon({ name, size = 24, className }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}

export const colors = {
  // deep space background gradient stops
  bgTop: "#0B0620",
  bgMid: "#170B3B",
  bgBottom: "#1E0B45",

  // accent gradient (buttons, highlights, orbits)
  gradientA: "#7C3AED", // violet
  gradientB: "#3B82F6", // blue
  gradientC: "#EC4899", // pink accent

  glassFill: "rgba(255,255,255,0.08)",
  glassBorder: "rgba(255,255,255,0.18)",
  glassFillStrong: "rgba(255,255,255,0.14)",

  textPrimary: "#F8FAFC",
  textSecondary: "#B9B4D9",
  textMuted: "#8A84B8",

  priceColor: "#4ADE80",
  ratingColor: "#FBBF24",

  chipBg: "rgba(124,58,237,0.25)",
  chipBorder: "rgba(167,139,250,0.5)",
  chipText: "#E9D5FF",

  danger: "#F87171",
};

export const gradients = {
  background: [colors.bgTop, colors.bgMid, colors.bgBottom],
  primary: [colors.gradientB, colors.gradientA],
  vivid: [colors.gradientA, colors.gradientC],
  card: ["rgba(124,58,237,0.35)", "rgba(59,130,246,0.25)"],
  banner: ["#4C1D95", "#1E3A8A", "#701A75"],
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  pill: 999,
};

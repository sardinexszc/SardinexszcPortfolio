export const motionTokens = {
  duration: {
    fast: 0.18,
    normal: 0.28,
    slow: 0.42,
  },
  ease: {
    standard: [0.25, 0.1, 0.25, 1] as const,
    emphasizeIn: [0.32, 0, 0.67, 0] as const,
    emphasizeOut: [0.33, 1, 0.68, 1] as const,
  },
  distance: {
    subtle: 10,
    medium: 18,
  },
  delay: {
    immediate: 0,
    short: 0.08,
    staggerStep: 0.06,
  },
};

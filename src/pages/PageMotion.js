// Shared page motion config for all pages
export const pageVariants = {
  initial: {
    opacity: 0,
    y: -20
  },
  in: {
    opacity: 1,
    y: 0
  },
  out: {
    // opacity: 0,
    // y: -30
  }
};

export const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.5
};

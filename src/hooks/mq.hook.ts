import { ref, onMounted, onUnmounted } from "vue";

const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

type Breakpoint = keyof typeof breakpoints;

export const useBreakpoint = () => {
  const current = ref<Breakpoint | null>(null);

  const getBreakpoint = () => {
    const width = window.innerWidth;
    if (width >= breakpoints["2xl"]) return "2xl";
    if (width >= breakpoints.xl) return "xl";
    if (width >= breakpoints.lg) return "lg";
    if (width >= breakpoints.md) return "md";
    if (width >= breakpoints.sm) return "sm";
    return null;
  };

  const update = () => {
    current.value = getBreakpoint();
  };

  onMounted(() => {
    update();
    window.addEventListener("resize", update);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", update);
  });

  return {
    breakpoint: current,
    isSmAndUp: () => current.value !== null,
    isMdAndUp: () =>
      current.value && ["md", "lg", "xl", "2xl"].includes(current.value),
    isLgAndUp: () =>
      current.value && ["lg", "xl", "2xl"].includes(current.value),
    isXlAndUp: () => current.value && ["xl", "2xl"].includes(current.value),
    is2xl: () => current.value === "2xl",
  };
};

import { ref } from "vue";

const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

type Breakpoint = keyof typeof breakpoints;

const getBreakpoint = (): Breakpoint | null => {
  const width = window.innerWidth;
  if (width >= breakpoints["2xl"]) return "2xl";
  if (width >= breakpoints.xl) return "xl";
  if (width >= breakpoints.lg) return "lg";
  if (width >= breakpoints.md) return "md";
  if (width >= breakpoints.sm) return "sm";
  return null;
};

// Um único listener para o app todo, com o valor certo já no primeiro render
// (antes começava em null e o iPad na horizontal piscava o layout de celular).
const current = ref<Breakpoint | null>(getBreakpoint());
window.addEventListener("resize", () => {
  current.value = getBreakpoint();
});

const atLeast = (...names: Breakpoint[]) =>
  !!current.value && names.includes(current.value);

export const useBreakpoint = () => ({
  breakpoint: current,
  isSmAndUp: () => current.value !== null,
  isMdAndUp: () => atLeast("md", "lg", "xl", "2xl"),
  isLgAndUp: () => atLeast("lg", "xl", "2xl"),
  isXlAndUp: () => atLeast("xl", "2xl"),
  is2xl: () => current.value === "2xl",
});

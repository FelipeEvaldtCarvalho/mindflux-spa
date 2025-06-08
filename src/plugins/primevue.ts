import PrimeVue from "primevue/config";
import { definePreset } from "@primeuix/themes";
import Aura from "@primeuix/themes/aura";

const primevueConfig = definePreset(Aura, {
  semantic: {
    primary: {
      50: "#f2f7ff",
      100: "#dbeafe",
      200: "#bfdbfe",
      300: "#93c5fd",
      400: "#60a5fa",
      500: "#3b82f6",
      600: "#2563eb",
      700: "#1d4ed8",
      800: "#1e40af",
      900: "#1e3a8a",
      950: "#172554",
    },
    secondary: {
      50: "#f3faf7",
      100: "#def7ec",
      200: "#bcf0da",
      300: "#84e1bc",
      400: "#31c48d",
      500: "#0e9f6e",
      600: "#057a55",
      700: "#046c4e",
      800: "#03543f",
      900: "#014737",
      950: "#01332b",
    },
    surface: {
      50: "#f9fafb",
      100: "#f4f5f7",
      200: "#e5e7eb",
      300: "#d5d6d7",
      400: "#9e9e9e",
      500: "#6b7280",
      600: "#4b5563",
      700: "#374151",
      800: "#1f2937",
      900: "#111827",
      950: "#0b0f1a",
    },
  },
});

export const primeVueOptions = {
  theme: {
    preset: primevueConfig,
    options: {
      darkModeSelector: "none",
    },
  },
  locale: {
    firstDayOfWeek: 1,
    dayNames: [
      "domingo",
      "segunda",
      "terça",
      "quarta",
      "quinta",
      "sexta",
      "sábado",
    ],
    dayNamesShort: ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"],
    dayNamesMin: ["D", "S", "T", "Q", "Q", "S", "S"],
    monthNames: [
      "janeiro",
      "fevereiro",
      "março",
      "abril",
      "maio",
      "junho",
      "julho",
      "agosto",
      "setembro",
      "outubro",
      "novembro",
      "dezembro",
    ],
    monthNamesShort: [
      "jan",
      "fev",
      "mar",
      "abr",
      "mai",
      "jun",
      "jul",
      "ago",
      "set",
      "out",
      "nov",
      "dez",
    ],
    today: "Hoje",
    clear: "Limpar",
    dateFormat: "dd/mm/yy",
  },
};

export default PrimeVue;

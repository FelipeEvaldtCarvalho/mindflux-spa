import PrimeVue from "primevue/config";
import { definePreset } from "@primeuix/themes";
import Aura from "@primeuix/themes/aura";

export const primevueConfig = definePreset(Aura, {
  semantic: {
    primary: {
      50: "#ecf0ed",
      100: "#d6ddd7",
      200: "#b2c3b5",
      300: "#8fa894",
      400: "#6d8e72",
      500: "#445938",
      600: "#3d5133",
      700: "#34452b",
      800: "#2a3823",
      900: "#202b1b",
      950: "#171f14",
    },
  },
});

export default PrimeVue;

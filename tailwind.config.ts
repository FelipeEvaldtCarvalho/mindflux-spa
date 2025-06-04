import { type Config } from "tailwindcss";
import PrimeUI from "tailwindcss-primeui";

export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts}"],
  theme: {
    extend: {},
  },
  plugins: [PrimeUI],
} satisfies Config;

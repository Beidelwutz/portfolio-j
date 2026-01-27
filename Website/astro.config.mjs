import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";

export default defineConfig({
  site: "https://beidelwutz.github.io/portfolio-j",
  output: "server",
  adapter: vercel(),
});

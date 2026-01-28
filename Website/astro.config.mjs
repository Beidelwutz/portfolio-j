import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";

export default defineConfig({
  site: "https://jpgjenny.me",
  output: "server",
  adapter: vercel(),
});

import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { webpAssets } from "./scripts/webp-assets.mjs";

export default defineConfig({
  plugins: [webpAssets()],
  tanstackStart: {
    server: { entry: "server" },
  },
  nitro: true,
});

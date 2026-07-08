import { defineConfig } from "@lovable.dev/vite-tanstack-config";
// @ts-ignore
import { webpAssets } from "./scripts/webp-assets.mjs";

export default defineConfig({
  plugins: [webpAssets()],
  tanstackStart: {
    server: { entry: "server" },
  },
  nitro: true,
});

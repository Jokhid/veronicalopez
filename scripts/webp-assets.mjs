import { existsSync } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const publicPngReferences = [
  ["/1.png", "/1.webp"],
  ["/2.png", "/2.webp"],
  ["/3.png", "/3.webp"],
  ["/4.png", "/4.webp"],
  ["/5.png", "/5.webp"],
  ["/6.png", "/6.webp"],
  ["/logo.png", "/logo.webp"],
  ["/logo-white.png", "/logo-white.webp"],
  ["/file_00000000b9c07246b0256fc18d8d4888.png", "/file_00000000b9c07246b0256fc18d8d4888.webp"],
];

async function generateWebpFiles(root) {
  const publicDir = path.join(root, "public");
  if (!existsSync(publicDir)) return;

  const entries = await readdir(publicDir, { withFileTypes: true });
  await Promise.all(
    entries
      .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".png"))
      .map(async (entry) => {
        const input = path.join(publicDir, entry.name);
        const output = path.join(publicDir, entry.name.replace(/\.png$/i, ".webp"));

        await sharp(input)
          .webp({ quality: 86, effort: 6 })
          .toFile(output);
      }),
  );
}

function rewritePublicPngReferences(code) {
  return publicPngReferences.reduce(
    (nextCode, [pngPath, webpPath]) => nextCode.replaceAll(pngPath, webpPath),
    code.replace("`/${n}.png`", "`/${n}.webp`"),
  );
}

export function webpAssets() {
  let root = process.cwd();

  return {
    name: "webp-assets",
    enforce: "pre",
    configResolved(config) {
      root = config.root;
    },
    async buildStart() {
      await generateWebpFiles(root);
    },
    async configureServer() {
      await generateWebpFiles(root);
    },
    transform(code, id) {
      if (!/\.(tsx?|jsx?)$/.test(id)) return null;

      const rewritten = rewritePublicPngReferences(code);
      if (rewritten === code) return null;

      return {
        code: rewritten,
        map: null,
      };
    },
  };
}

import { existsSync } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const publicImageReferences = [
  ["/1.png", "/veronica-lopez-abogada-altea.webp"],
  ["/1.webp", "/veronica-lopez-abogada-altea.webp"],
  ["/2.png", "/criterio-institucional-administracion.webp"],
  ["/2.webp", "/criterio-institucional-administracion.webp"],
  ["/3.png", "/trayectoria-juridica-veronica-lopez.webp"],
  ["/3.webp", "/trayectoria-juridica-veronica-lopez.webp"],
  ["/4.png", "/docencia-derecho-universidad-alicante.webp"],
  ["/4.webp", "/docencia-derecho-universidad-alicante.webp"],
  ["/5.png", "/metodo-de-trabajo-juridico.webp"],
  ["/5.webp", "/metodo-de-trabajo-juridico.webp"],
  ["/6.png", "/veronica-lopez-perfil-profesional.webp"],
  ["/6.webp", "/veronica-lopez-perfil-profesional.webp"],
  ["/logo.png", "/logo-veronica-lopez.webp"],
  ["/logo.webp", "/logo-veronica-lopez.webp"],
  ["/logo-white.png", "/logo-veronica-lopez-blanco.webp"],
  ["/logo-white.webp", "/logo-veronica-lopez-blanco.webp"],
  ["/file_00000000b9c07246b0256fc18d8d4888.png", "/hilolegal-dos-especialistas.webp"],
  ["/file_00000000b9c07246b0256fc18d8d4888.webp", "/hilolegal-dos-especialistas.webp"],
];

const webpOutputs = [
  ["1.png", "veronica-lopez-abogada-altea.webp"],
  ["2.png", "criterio-institucional-administracion.webp"],
  ["3.png", "trayectoria-juridica-veronica-lopez.webp"],
  ["4.png", "docencia-derecho-universidad-alicante.webp"],
  ["5.png", "metodo-de-trabajo-juridico.webp"],
  ["6.png", "veronica-lopez-perfil-profesional.webp"],
  ["logo.png", "logo-veronica-lopez.webp"],
  ["logo-white.png", "logo-veronica-lopez-blanco.webp"],
  ["file_00000000b9c07246b0256fc18d8d4888.png", "hilolegal-dos-especialistas.webp"],
];

async function generateWebpFiles(root) {
  const publicDir = path.join(root, "public");
  if (!existsSync(publicDir)) return;

  const entries = await readdir(publicDir, { withFileTypes: true });
  const pngNames = new Set(
    entries
      .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".png"))
      .map((entry) => entry.name),
  );

  await Promise.all(
    webpOutputs
      .filter(([pngName]) => pngNames.has(pngName))
      .map(async ([pngName, webpName]) => {
        const input = path.join(publicDir, pngName);
        const output = path.join(publicDir, webpName);

        await sharp(input)
          .webp({ quality: 86, effort: 6 })
          .toFile(output);
      }),
  );
}

function rewritePublicImageReferences(code) {
  return publicImageReferences.reduce(
    (nextCode, [oldPath, newPath]) => nextCode.replaceAll(oldPath, newPath),
    code.replace("`/${n}.png`", "`/${n}.webp`"),
  );
}

function addImagePriorities(code, id) {
  if (!id.endsWith("src/routes/index.tsx")) return code;

  return code
    .replace(
      'alt="Logo Verónica López"\n            className="h-10 w-10 object-contain"',
      'alt="Logo Verónica López"\n            loading="lazy"\n            decoding="async"\n            fetchPriority="low"\n            className="h-10 w-10 object-contain"',
    )
    .replace(
      'alt="Verónica López, abogada"\n                className="w-full h-auto object-cover"',
      'alt="Verónica López, abogada"\n                loading="eager"\n                decoding="async"\n                fetchPriority="high"\n                className="w-full h-auto object-cover"',
    )
    .replace(
      'src={IMG(x.img)}\n                    alt={x.t}\n                    className="absolute inset-0 w-full h-full object-cover"',
      'src={IMG(x.img)}\n                    alt={x.t}\n                    loading="lazy"\n                    decoding="async"\n                    fetchPriority="low"\n                    className="absolute inset-0 w-full h-full object-cover"',
    )
    .replace(
      'src={IMG(5)}\n                alt="Método de trabajo jurídico"\n                className="absolute inset-0 w-full h-full object-cover"',
      'src={IMG(5)}\n                alt="Método de trabajo jurídico"\n                loading="lazy"\n                decoding="async"\n                fetchPriority="low"\n                className="absolute inset-0 w-full h-full object-cover"',
    )
    .replace(
      'alt="Verónica López"\n                  className="w-full h-[600px] object-cover"\n                  src={IMG(6)}',
      'alt="Verónica López"\n                  loading="lazy"\n                  decoding="async"\n                  fetchPriority="low"\n                  className="w-full h-[600px] object-cover"\n                  src={IMG(6)}',
    )
    .replace(
      'src={banner3Asset.url}\n                alt="HiloLegal"\n                className="absolute inset-0 w-full h-full object-cover"',
      'src={banner3Asset.url}\n                alt="HiloLegal"\n                loading="lazy"\n                decoding="async"\n                fetchPriority="low"\n                className="absolute inset-0 w-full h-full object-cover"',
    )
    .replace(
      '<img src="/logo-white.png" alt="Logo Verónica López" className="h-12 w-12 object-contain" />',
      '<img src="/logo-white.png" alt="Logo Verónica López" loading="lazy" decoding="async" fetchPriority="low" className="h-12 w-12 object-contain" />',
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

      const rewritten = addImagePriorities(rewritePublicImageReferences(code), id);
      if (rewritten === code) return null;

      return {
        code: rewritten,
        map: null,
      };
    },
  };
}

import { defineConfig, sharpImageService } from "astro/config";

// https://astro.build/config
export default defineConfig({
  compressHTML: false,
  trailingSlash: "never",
  build: {
    format: "file",
    assets: "assets",
    assetsPrefix: "./",
  },
  image: {
    service: sharpImageService(),
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          entryFileNames: "assets/js/index.js",
          chunkFileNames: "chunks/chunk.[hash].mjs",
          assetFileNames: (asset) => {
            if (asset.name.includes("css")) {
              if (asset.name.includes("hoisted")) {
                return "assets/css/[name][extname]";
              } else {
                return "assets/css/style[extname]";
              }
            } else {
              return "assets/[name]-[hash:4][extname]";
            }
          },
        },
      },
    },
  },
});

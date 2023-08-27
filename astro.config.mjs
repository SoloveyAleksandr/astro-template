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
  experimental: {
    assets: true,
  },
  image: {
    service: sharpImageService(),
  },
});

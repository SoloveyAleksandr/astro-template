import { defineConfig, sharpImageService } from "astro/config";

// https://astro.build/config
export default defineConfig({
  // Отключает минификацию HTML
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
      // Отключает разбитие CSS
      cssCodeSplit: false,

      // Отключает минификацию в CSS и JS
      minify: true,

      // Минимальный размер инлайна CSS и JS
      assetsInlineLimit: 0,

      rollupOptions: {
        // Названия без хэшей
        output: {
          entryFileNames: "assets/[name].js",
          assetFileNames: "assets/[name][extname]",
        },
      },
    },
  },
});

import fs from "node:fs";
import path from "node:path";
import { promisify } from "node:util";

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const copyFile = promisify(fs.copyFile);
const mkdir = promisify(fs.mkdir);

const srcDir = `dist/`;
const destDir = `../../`;

async function copyFiles(source, destination) {
  try {
    const files = await readdir(source);

    for (const file of files) {
      const filePath = path.join(source, file);
      const fileStats = await stat(filePath);

      if (fileStats.isDirectory()) {
        const newDestination = path.join(destination, file);
        await mkdir(newDestination);
        await copyFiles(filePath, newDestination);
      } else {
        const fileExtension = path.extname(file);
        const fileName = path.basename(file);

        if (fileExtension !== ".html" && fileName[0] !== ".") {
          const destinationPath = path.join(destination, file);
          await copyFile(filePath, destinationPath);
          console.log("Файл успешно скопирован:", file);
        }
      }
    }
  } catch (err) {
    console.error("Ошибка при копировании файлов:", err);
  }
}

copyFiles(srcDir, destDir);

// Copies the game into www/, the folder Capacitor packages into the app.
import { cpSync, mkdirSync, rmSync } from "node:fs";

rmSync("www", { recursive: true, force: true });
mkdirSync("www");
cpSync("index.html", "www/index.html");
console.log("www/ ready");

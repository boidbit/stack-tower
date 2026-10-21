// Patches the generated android/app/build.gradle with the version and release signing.
// Env: VERSION_CODE, VERSION_NAME, and (optional) KEYSTORE_PATH, KEYSTORE_PASSWORD, KEY_ALIAS, KEY_PASSWORD.
import { readFileSync, writeFileSync } from "node:fs";

const file = "android/app/build.gradle";
let gradle = readFileSync(file, "utf8");

function replaceOnce(pattern, replacement, what) {
  if (!pattern.test(gradle)) throw new Error(`Could not find ${what} in ${file}`);
  gradle = gradle.replace(pattern, replacement);
}

const { VERSION_CODE, VERSION_NAME, KEYSTORE_PATH } = process.env;
if (VERSION_CODE) replaceOnce(/versionCode\s+\d+/, `versionCode ${VERSION_CODE}`, "versionCode");
if (VERSION_NAME) replaceOnce(/versionName\s+"[^"]*"/, `versionName "${VERSION_NAME}"`, "versionName");

if (KEYSTORE_PATH) {
  const signing = `
    signingConfigs {
        release {
            storeFile file(System.getenv("KEYSTORE_PATH"))
            storePassword System.getenv("KEYSTORE_PASSWORD")
            keyAlias System.getenv("KEY_ALIAS")
            keyPassword System.getenv("KEY_PASSWORD")
        }
    }
`;
  replaceOnce(/(buildTypes\s*\{\s*release\s*\{)/, "$1\n            signingConfig signingConfigs.release", "release build type");
  replaceOnce(/(\n\s*buildTypes\s*\{)/, `${signing}$1`, "buildTypes block");
  console.log("Release signing configured");
} else {
  console.log("No keystore provided - release signing not configured");
}

writeFileSync(file, gradle);

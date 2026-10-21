# Stack to Orbit

A one-tap stacking game in a single HTML file (`index.html`). No build step, no dependencies, works offline.

## Play

Open `index.html` in a browser, or serve the folder with any static host (GitHub Pages works as-is).

## What's inside

- **Levels:** 20 levels across 4 worlds (Night City, Desert Dusk, Snow Peaks, Neon Harbor), each with its own scenery and block material. Stars from Perfect drops open the next world (10 / 22 / 35 stars).
- **Endless:** climb from the ground through the clouds and the stratosphere into space, with an altitude readout.
- **Rising:** outrun rising lava; Perfect drops push it back. Unlocks after Level 5.
- **Skins** for Endless and Rising, unlocked by milestones.
- Menus, settings (sound, vibration, reduced motion, height meter), stats, and Android back-button support.

Progress is saved in the browser's local storage on the device.

## Android builds (APK / AAB)

The game is wrapped with [Capacitor](https://capacitorjs.com). The Android project is generated in CI, so nothing Android-specific is committed.

Run **Actions → Build APK** or **Actions → Build AAB** (or push a `v*` tag), then download the artifact from the run.

### Signing

Without secrets, the workflows build a debug-signed APK/AAB (fine for testing, rejected by Google Play). To get signed release builds:

1. Create a keystore (keep it and its passwords safe - losing it means you can't update the app under the same key):

   ```
   keytool -genkeypair -v -keystore stack-tower.jks -alias stacktower -keyalg RSA -keysize 2048 -validity 10000
   ```

2. Base64-encode it:
   - PowerShell: `[Convert]::ToBase64String([IO.File]::ReadAllBytes("stack-tower.jks")) | Set-Content keystore.b64`
   - macOS/Linux: `base64 -w0 stack-tower.jks > keystore.b64`

3. In the repo go to **Settings → Secrets and variables → Actions → New repository secret** and add:

   | Secret | Value |
   | --- | --- |
   | `ANDROID_KEYSTORE_BASE64` | contents of `keystore.b64` |
   | `ANDROID_KEYSTORE_PASSWORD` | the keystore password |
   | `ANDROID_KEY_ALIAS` | the alias (`stacktower` above) |
   | `ANDROID_KEY_PASSWORD` | the key password |

Version name comes from `package.json`; the version code is the workflow run number (Play needs it to increase on every upload).

## Privacy policy

[docs/privacy.html](docs/privacy.html) is served by GitHub Pages (Settings → Pages → `main` / `/docs`) at `https://boidbit.github.io/stack-tower/privacy.html`. It is not packaged into the app (only `index.html` is).

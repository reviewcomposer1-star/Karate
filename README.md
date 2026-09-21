# KARATE — Beginner Learning Companion PWA

A premium, offline-first karate reference/training companion built with vanilla HTML, CSS and JavaScript. V1 is designed for general karate education with Ken Ryu Du as the initial style context.

## Tech stack
- HTML5 / CSS3 / Vanilla JavaScript
- PWA manifest + Service Worker
- LocalStorage favorites
- Browser Speech Synthesis for pronunciation
- No backend, accounts, APIs or AI dependency
- GitHub Pages compatible under `/karate/` or another repository subpath

## Project structure
```text
index.html
manifest.json
sw.js
css/styles.css
js/
  app.js
  audio.js
  data.js
  favorites.js
  install.js
  router.js
  search.js
  sw-register.js
data/
  geri.js
  zuki.js
  uke.js
  dachi.js
  kata.js
  kumite.js
assets/
  animations/kicks/
  animations/punches/
  animations/blocks/
  images/stances/
  icons/
```

## Local testing
Service Workers require a secure context or localhost, so do not test by double-clicking `index.html`.

### Python
```bash
python3 -m http.server 8000
```
Open `http://localhost:8000/`.

### Node
```bash
npx http-server -p 8000
```

## GitHub Pages deployment
1. Create a GitHub repository, for example `karate`.
2. Push this project to the `main` branch.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select `main` and `/ (root)`.
6. Save and wait for GitHub Pages to publish.
7. The app should be available at:
   `https://YOUR_USERNAME.github.io/karate/`

The app uses relative URLs (`./...`) and a manifest scope of `./`, so it is designed for a repository subpath rather than assuming `/` is the site root.

## PWA installation
### Chrome / Edge / Android
- Open the deployed app over HTTPS.
- When the browser exposes `beforeinstallprompt`, KARATE shows **Install App**.
- Tap it and confirm the browser's native installation prompt.
- If the browser does not expose the event, use the browser's own Install/Add to Home Screen menu.

### iPhone / iPad
Safari does not expose the same `beforeinstallprompt` flow. Open the app in Safari, use **Share → Add to Home Screen → Add**.

The app detects standalone mode and stops showing the install action after installation.

## Offline test
1. Open the app online.
2. Wait for the initial page and media cache to finish loading.
3. Navigate through Basics, technique pages, Kata and Kumite.
4. Add a few favorites.
5. Install the PWA if supported.
6. Disable the network in DevTools or disconnect the device.
7. Reload the app.
8. Test navigation, search, technique media and favorites.

V1 precaches the supplied local media so the first successful online load can seed the offline experience. The current media set is about 20 MB.

## Asset handling
The supplied media files are preserved in normalized folders without inventing replacement filenames. All 29 supplied media assets are mapped: 14 kick files, 5 punch files, 6 block files and 4 stance files. Where multiple files represent the same technique, they are retained as media variants instead of creating duplicate technique records.

No pronunciation MP3 files were supplied, so the app uses browser Speech Synthesis for the Sensei button. If audio files are added later, the data model already supports an `audio` field.

## V1 scope
Included:
- Splash screen and premium mobile-first UI
- Basics → Geri / Zuki / Uke / Dachi
- Technique detail pages with supplied media
- Media variants for duplicate/alternate supplied assets
- Search across Japanese name, English name, category, pronunciation and aliases
- Persistent favorites
- Kata introduction, terminology and 1–10 counting
- Kumite Rules / Points / Drills tabs
- PWA install detection and native install prompt
- Versioned Service Worker and offline caching
- Responsive mobile/tablet/desktop layout
- Reduced-motion and keyboard/focus support

Not included in V1:
- Progress tracking, XP, streaks, badges or daily goals
- Accounts or cloud sync
- AI features
- Kata sequences
- Kumite drills
- Federation-specific competition rules

## Browser limitations
- Browsers control whether and when a PWA installation prompt is available; JavaScript cannot silently install an app.
- iOS uses its own Add to Home Screen flow.
- Browser speech synthesis voices differ by device and OS, so pronunciation quality is not identical everywhere.
- A GIF cannot be paused frame-by-frame reliably using a normal `<img>` element without decoding/rebuilding the animation. V1 therefore presents supplied GIFs as native animations rather than pretending they have precise pause controls.

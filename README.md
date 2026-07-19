# BubbleTea photobooth

A cute, browser-based photobooth built entirely in vanilla HTML, CSS, and JavaScript, with real-time face tracking, live background replacement, and a full editing pipeline.

**🔗 Live demo:** https://meouuii.github.io/bubbletea_photobooth/
---

## What it does

-Take a full sequence of photos with a real countdown, just like a real photobooth

-Live face-tracking stickers (glasses, ears, crowns, and more) that scale and rotate with your face in real time

-Live background removal/replacement, swap your real background for one of several presets, straight from the camera feed

-Choose landscape or portrait mode before shooting

-After capturing: apply filters (B&W, sepia, a custom vintage grain/vignette effect), add decorative frames, and arrange your photos into a strip or grid layout

-Customize the strip's background, a solid color or one of several pattern images

-Save your final result as a downloadable image

## Tech used

- **Vanilla HTML/CSS/JavaScript** no frameworks
- **[MediaPipe Tasks Vision](https://developers.google.com/mediapipe)** — Face Landmarker (face tracking) and Image Segmenter (background removal), both running fully client-side
- **Canvas API** — all image compositing, filters, and sticker rendering are done by hand with canvas, no external image libraries
- **[GSAP](https://gsap.com/)** — cursor effects, hover interactions, and smooth scrolling

## Running it locally

This project needs to be served over http:// (or https://), not opened directly as a file, camera access and module imports won't work otherwise.

1. Clone the repo
2. From the project folder, run a local server, for example:
   ```bash
   npx serve
   ```
3. Open the printed local URL in your browser

## Project structure

```
├── index.html              # page structure
├── style.css                # all styling
├── camera.js                 # capture flow, editing pipeline, view switching
├── faceTracking.js           # MediaPipe face landmark setup + sticker rendering
├── bgRemoval.js               # MediaPipe segmentation + background compositing
├── stickerMath.js             # positioning/scale/rotation math for stickers
├── stickers.js                 # sticker registry (image + anchor points per sticker)
├── framesRegistry.js           # frame image registry
├── backgrounds.js                # live-removal background registry
├── stripBackgrounds.js            # strip background image registry
├── stripBuilder.js                 # combines captured photos into a final strip/grid
├── animations.js                    # GSAP interactions
├── models/                           # MediaPipe .task model files
└── assets/                            # stickers, frames, backgrounds, UI images
```

## Note
- All face tracking and background removal happens locally in your browser. No video or images are ever uploaded anywhere.

---

Built as a personal project for fun and self indulging but also to learn real browser-native JavaScript, computer vision APIs, and canvas graphics from the ground up.

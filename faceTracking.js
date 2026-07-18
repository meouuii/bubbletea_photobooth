import { FaceLandmarker, FilesetResolver } from './node_modules/@mediapipe/tasks-vision/vision_bundle.mjs';
import { getStickerTransform, getForeheadAnchorTransform } from './stickerMath.js';
import { stickerRegistry } from './stickers.js';

const video = document.getElementById('video');
const overlay = document.getElementById('overlay');
const overlayCtx = overlay.getContext('2d');
const stickerButtons = document.getElementById('stickerButtons');

let faceLandmarker;
let activeStickerName = 'none';

function renderStickerButtons() {
  stickerButtons.innerHTML = '';

  const noneBtn = document.createElement('button');
  noneBtn.className = 'asset-btn';
  noneBtn.dataset.sticker = 'none';
  noneBtn.textContent = '—';
  stickerButtons.appendChild(noneBtn);

  stickerRegistry.forEach(sticker => {
    const btn = document.createElement('button');
    btn.className = 'asset-btn';
    btn.dataset.sticker = sticker.name;

    const img = document.createElement('img');
    img.src = sticker.src;
    btn.appendChild(img);

    stickerButtons.appendChild(btn);
  });
}

renderStickerButtons();

stickerButtons.addEventListener('click', (event) => {
  const btn = event.target.closest('button');
  if (btn && btn.dataset.sticker) {
    activeStickerName = btn.dataset.sticker;

    stickerButtons.querySelectorAll('button').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  }
});

async function setupFaceLandmarker() {
  const vision = await FilesetResolver.forVisionTasks('./node_modules/@mediapipe/tasks-vision/wasm');
  faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
    baseOptions: { modelAssetPath: './models/face_landmarker.task' },
    runningMode: 'VIDEO',
    numFaces: 2
  });
  console.log('Face Landmarker ready:', faceLandmarker);
}

setupFaceLandmarker();

function drawSticker(sticker, points) {
  if (!sticker.image.complete) return;

  sticker.placements.forEach(placement => {
    let transform;
    if (placement.type === 'landmarks') {
      transform = getStickerTransform(points, placement.indexA, placement.indexB, overlay.width, overlay.height, placement.referenceDistance);
    } else if (placement.type === 'forehead') {
      transform = getForeheadAnchorTransform(points, overlay.width, overlay.height, placement.referenceDistance, placement.extensionRatio);
    }

    const drawWidth = sticker.image.width * transform.scale;
    const drawHeight = sticker.image.height * transform.scale;

    const offsetX = (placement.offsetX || 0) * transform.scale;
    const offsetY = (placement.offsetY || 0) * transform.scale;
    const offsetAngle = placement.offsetAngle || 0;

    overlayCtx.save();
    overlayCtx.translate(transform.x, transform.y);
    overlayCtx.rotate(transform.angle + offsetAngle);
    overlayCtx.translate(offsetX, offsetY);
    overlayCtx.drawImage(sticker.image, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    overlayCtx.restore();
  });
}

function detectLoop() {
  if (faceLandmarker && video.readyState >= 2) {
    if (overlay.width !== video.videoWidth) {
      overlay.width = video.videoWidth;
      overlay.height = video.videoHeight;
    }

    const result = faceLandmarker.detectForVideo(video, performance.now());
    overlayCtx.clearRect(0, 0, overlay.width, overlay.height);

    const activeSticker = stickerRegistry.find(s => s.name === activeStickerName);
    if (activeSticker) {
      result.faceLandmarks.forEach(points => {
        drawSticker(activeSticker, points);
      });
    }
  }
  requestAnimationFrame(detectLoop);
}

detectLoop();
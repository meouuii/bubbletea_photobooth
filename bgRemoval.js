import { ImageSegmenter, FilesetResolver } from 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/vision_bundle.mjs';
import { backgroundRegistry } from './backgrounds.js';

const video = document.getElementById('video');
const compositeCanvas = document.getElementById('compositeCanvas');
const compositeCtx = compositeCanvas.getContext('2d');
const bgButtons = document.getElementById('bgButtons');

const personCanvas = document.createElement('canvas');
const personCtx = personCanvas.getContext('2d');
const maskCanvas = document.createElement('canvas');
const maskCtx = maskCanvas.getContext('2d');

let imageSegmenter;
let activeBackgroundName = 'none';

const noneButton = document.createElement('button');
noneButton.textContent = 'None';
noneButton.dataset.bg = 'none';
bgButtons.appendChild(noneButton);

backgroundRegistry.forEach(bg => {
  const button = document.createElement('button');
  button.className = 'asset-btn';
  button.dataset.bg = bg.name;

  const img = document.createElement('img');
  img.src = bg.src;
  button.appendChild(img);

  bgButtons.appendChild(button);
});

const noneBgBtn = document.createElement('button');
noneBgBtn.className = 'asset-btn';
noneBgBtn.dataset.bg = 'none';
noneBgBtn.textContent = '—';
bgButtons.appendChild(noneBgBtn);

bgButtons.addEventListener('click', (event) => {
  const btn = event.target.closest('button');
  if (btn && btn.dataset.bg) {
    activeBackgroundName = btn.dataset.bg;
    bgButtons.querySelectorAll('button').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  }
});

async function setupImageSegmenter() {
  const vision = await FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm');
  imageSegmenter = await ImageSegmenter.createFromOptions(vision, {
    baseOptions: { modelAssetPath: './models/selfie_segmenter.tflite' },
    runningMode: 'VIDEO',
    outputCategoryMask: true,
    outputConfidenceMasks: false
  });
  console.log('Image Segmenter ready:', imageSegmenter);
}

setupImageSegmenter();

function segmentLoop() {
  if (imageSegmenter && video.readyState >= 2) {
    if (compositeCanvas.width !== video.videoWidth) {
      compositeCanvas.width = video.videoWidth;
      compositeCanvas.height = video.videoHeight;
      personCanvas.width = video.videoWidth;
      personCanvas.height = video.videoHeight;
      maskCanvas.width = video.videoWidth;
      maskCanvas.height = video.videoHeight;
    }

    if (activeBackgroundName === 'none') {
      compositeCtx.drawImage(video, 0, 0, compositeCanvas.width, compositeCanvas.height);
    } else {
      const result = imageSegmenter.segmentForVideo(video, performance.now());
      const mask = result.categoryMask;

      if (mask) {
        const maskData = mask.getAsUint8Array();
        const maskImageData = maskCtx.createImageData(maskCanvas.width, maskCanvas.height);

        for (let i = 0; i < maskData.length; i++) {
          const alpha = maskData[i] === 0 ? 255 : 0;
          maskImageData.data[i * 4 + 3] = alpha;
        }

        maskCtx.putImageData(maskImageData, 0, 0);

        personCtx.globalCompositeOperation = 'source-over';
        personCtx.drawImage(video, 0, 0, personCanvas.width, personCanvas.height);
        personCtx.globalCompositeOperation = 'destination-in';
        personCtx.drawImage(maskCanvas, 0, 0);
        personCtx.globalCompositeOperation = 'source-over';

        const bgEntry = backgroundRegistry.find(b => b.name === activeBackgroundName);
        compositeCtx.clearRect(0, 0, compositeCanvas.width, compositeCanvas.height);
        if (bgEntry && bgEntry.image.complete) {
          compositeCtx.drawImage(bgEntry.image, 0, 0, compositeCanvas.width, compositeCanvas.height);
        }
        compositeCtx.drawImage(personCanvas, 0, 0);

        mask.close();
      }
      result.close();
    }
  }
  requestAnimationFrame(segmentLoop);
}

segmentLoop();

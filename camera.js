const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureBtn = document.getElementById('captureBtn');
const photos = document.getElementById('photos');
const compositeCanvas = document.getElementById('compositeCanvas');
const overlay = document.getElementById('overlay');
const boothContainer = document.getElementById('boothContainer');
const orientationButtons = document.getElementById('orientationButtons');
const countButtons = document.getElementById('countButtons');
const countdownDisplay = document.getElementById('countdownDisplay');
const filterButtons = document.getElementById('filterButtons');
const layoutButtons = document.getElementById('layoutButtons');
const whitespaceToggleBtn = document.getElementById('whitespaceToggleBtn');
const stripColorPicker = document.getElementById('stripColorPicker');
const stripBgImageButtons = document.getElementById('stripBgImageButtons');
const frameButtons = document.getElementById('frameButtons');
const editingPreview = document.getElementById('editingPreview');
const doneBtn = document.getElementById('doneBtn');
const shootingView = document.getElementById('shootingView');
const previewView = document.getElementById('previewView');
const editingView = document.getElementById('editingView');
const continueToEditingBtn = document.getElementById('continueToEditingBtn');
const landingView = document.getElementById('landingView');
const startBigBtn = document.getElementById('startBigBtn');
const resultView = document.getElementById('resultView');
const resultPreview = document.getElementById('resultPreview');
const finalSaveBtn = document.getElementById('finalSaveBtn');
const backToEditingBtn = document.getElementById('backToEditingBtn');
const startOverButtons = document.querySelectorAll('.start-over-btn');

let capturedPhotos = [];
let stripBgImageEntry = null;
let stripLayout = 'stripVertical';
let whitespaceEnabled = true;
let stripBgColor = '#ffffff';
let activeFilter = 'none';
let activeFrameName = 'none';
let currentStripCanvas = null;
let finalSaveItems = [];

function setView(viewName) {
  landingView.style.display = viewName === 'landing' ? 'flex' : 'none';
  shootingView.style.display = viewName === 'shooting' ? 'block' : 'none';
  previewView.style.display = viewName === 'preview' ? 'block' : 'none';
  editingView.style.display = viewName === 'editing' ? 'block' : 'none';
  resultView.style.display = viewName === 'result' ? 'block' : 'none';

  document.body.classList.remove('view-landing', 'view-shooting', 'view-preview', 'view-editing', 'view-result');
  document.body.classList.add('view-' + viewName);
}

setView('landing');

startBigBtn.addEventListener('click', () => {
  startCamera();
  setView('shooting');
});

async function startCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
}


const orientationAspects = {
  landscape: 4 / 3,
  portrait: 3 / 4
};

let activeOrientation = 'landscape';

function applyOrientation(orientation) {
  activeOrientation = orientation;
  boothContainer.style.aspectRatio = orientationAspects[orientation];
}

orientationButtons.addEventListener('click', (event) => {
  if (event.target.dataset.orientation) {
    applyOrientation(event.target.dataset.orientation);
  }
});

applyOrientation('landscape');

function lockOrientation() {
  orientationButtons.querySelectorAll('button').forEach(button => {
    button.disabled = true;
  });
}

function unlockOrientation() {
  orientationButtons.querySelectorAll('button').forEach(button => {
    button.disabled = false;
  });
}

let photoCount = 4;

function lockPhotoCount() {
  countButtons.querySelectorAll('button').forEach(button => {
    button.disabled = true;
  });
}

function unlockPhotoCount() {
  countButtons.querySelectorAll('button').forEach(button => {
    button.disabled = false;
  });
}

countButtons.addEventListener('click', (event) => {
  if (event.target.dataset.count) {
    photoCount = parseInt(event.target.dataset.count);
  }
});

function computeCoverCrop(sourceWidth, sourceHeight, targetAspect) {
  const sourceAspect = sourceWidth / sourceHeight;
  let sw, sh, sx, sy;

  if (sourceAspect > targetAspect) {
    sh = sourceHeight;
    sw = sh * targetAspect;
    sx = (sourceWidth - sw) / 2;
    sy = 0;
  } else {
    sw = sourceWidth;
    sh = sw / targetAspect;
    sx = 0;
    sy = (sourceHeight - sh) / 2;
  }

  return { sx, sy, sw, sh };
}

function takeSinglePhoto() {
  const targetAspect = orientationAspects[activeOrientation];
  const crop = computeCoverCrop(compositeCanvas.width, compositeCanvas.height, targetAspect);

  canvas.width = crop.sw;
  canvas.height = crop.sh;
  const ctx = canvas.getContext('2d');

  ctx.save();
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(compositeCanvas, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(overlay, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, canvas.width, canvas.height);
  ctx.restore();

  const dataUrl = canvas.toDataURL('image/png');

  const photoRecord = {
    id: capturedPhotos.length,
    originalDataUrl: dataUrl,
    currentDataUrl: dataUrl,
    frameName: 'none'
  };
  capturedPhotos.push(photoRecord);
}

function renderOriginalPreview() {
  photos.innerHTML = '';

  capturedPhotos.forEach(record => {
    const img = document.createElement('img');
    img.src = record.originalDataUrl;
    img.width = 280;
    img.style.borderRadius = '18px';
    img.style.display = 'block';
    img.style.margin = '0 auto 16px';
    photos.appendChild(img);
  });
}

function renderFrameButtons() {
  frameButtons.innerHTML = '';
  const frameList = activeOrientation === 'portrait' ? portraitFrames : landscapeFrames;

  const noneBtn = document.createElement('button');
  noneBtn.className = 'asset-btn';
  noneBtn.dataset.frameName = 'none';
  noneBtn.textContent = '—';
  frameButtons.appendChild(noneBtn);

  frameList.forEach(frame => {
    const btn = document.createElement('button');
    btn.className = 'asset-btn';
    btn.dataset.frameName = frame.name;

    const img = document.createElement('img');
    img.src = frame.src;
    btn.appendChild(img);

    frameButtons.appendChild(btn);
  });
}

async function applyFrameToAllPhotos(frameName) {
  activeFrameName = frameName;
  const frameList = activeOrientation === 'portrait' ? portraitFrames : landscapeFrames;
  const frameEntry = frameList.find(f => f.name === frameName);

  for (const record of capturedPhotos) {
    record.frameName = frameName;

    if (frameName === 'none' || !frameEntry) {
      record.currentDataUrl = record.originalDataUrl;
      continue;
    }

    const baseImg = await loadImage(record.originalDataUrl);
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = baseImg.width;
    tempCanvas.height = baseImg.height;
    const tempCtx = tempCanvas.getContext('2d');

    tempCtx.drawImage(baseImg, 0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.drawImage(frameEntry.image, 0, 0, tempCanvas.width, tempCanvas.height);

    record.currentDataUrl = tempCanvas.toDataURL('image/png');
  }
}

async function refreshEditingPreview() {
  if (capturedPhotos.length === 0) return;

  const rawImages = await Promise.all(capturedPhotos.map(record => loadImage(record.currentDataUrl)));
  const filteredImages = await Promise.all(rawImages.map(img => applyFilterToImage(img, activeFilter)));

  editingPreview.innerHTML = '';

  if (stripLayout === 'none') {
    currentStripCanvas = null;

    filteredImages.forEach((img) => {
      const displayImg = document.createElement('img');
      displayImg.src = img.src;
      displayImg.width = 260;
      displayImg.style.borderRadius = '18px';
      displayImg.style.display = 'block';
      displayImg.style.margin = '0 auto 16px';
      editingPreview.appendChild(displayImg);
    });
  } else {
    const stripCanvas = buildStrip(filteredImages, {
      layout: stripLayout,
      whitespace: whitespaceEnabled,
      bgColor: stripBgColor,
      bgImage: stripBgImageEntry ? stripBgImageEntry.image : null
    });

    currentStripCanvas = stripCanvas;

    const resultImg = document.createElement('img');
    resultImg.src = stripCanvas.toDataURL('image/png');
    resultImg.width = 320;
    resultImg.style.borderRadius = '18px';
    resultImg.style.display = 'block';
    resultImg.style.margin = '0 auto';
    editingPreview.appendChild(resultImg);
  }
}

frameButtons.addEventListener('click', async (event) => {
  const btn = event.target.closest('button');
  if (btn && btn.dataset.frameName) {
    await applyFrameToAllPhotos(btn.dataset.frameName);
    refreshEditingPreview();

    frameButtons.querySelectorAll('button').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  }
});

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runCountdown() {
  countdownDisplay.style.display = 'flex';
  for (let n = 3; n >= 1; n--) {
    countdownDisplay.textContent = n;
    await wait(700);
  }
  countdownDisplay.style.display = 'none';
}

async function runCaptureSequence() {
  captureBtn.disabled = true;

  lockOrientation();
  lockPhotoCount();

  for (let i = 0; i < photoCount; i++) {
    await runCountdown();
    takeSinglePhoto();
    await wait(500);
  }

  captureBtn.disabled = false;

  renderOriginalPreview();
  setView('preview');
}

captureBtn.addEventListener('click', () => {
  runCaptureSequence();
});

continueToEditingBtn.addEventListener('click', () => {
  renderFrameButtons();
  refreshEditingPreview();
  setView('editing');
});

startOverButtons.forEach(btn => btn.addEventListener('click', () => {
  photos.innerHTML = '';
  editingPreview.innerHTML = '';
  resultPreview.innerHTML = '';
  unlockOrientation();
  unlockPhotoCount();
  capturedPhotos = [];
  activeFrameName = 'none';
  activeFilter = 'none';
  stripLayout = 'stripVertical';
  whitespaceEnabled = true;
  stripBgColor = '#ffffff';
  stripBgImageEntry = null;
  currentStripCanvas = null;
  finalSaveItems = [];
  frameButtons.innerHTML = '';
  setView('landing');
}));

filterButtons.addEventListener('click', (event) => {
  if (event.target.dataset.filter) {
    activeFilter = event.target.dataset.filter;
    refreshEditingPreview();
  }
});

layoutButtons.addEventListener('click', (event) => {
  if (event.target.dataset.layout) {
    stripLayout = event.target.dataset.layout;
    refreshEditingPreview();
  }
});

whitespaceToggleBtn.addEventListener('click', () => {
  whitespaceEnabled = !whitespaceEnabled;
  whitespaceToggleBtn.textContent = whitespaceEnabled ? 'Whitespace: On' : 'Whitespace: Off';
  refreshEditingPreview();
});

stripColorPicker.addEventListener('input', () => {
  stripBgColor = stripColorPicker.value;
  stripBgImageEntry = null;
  refreshEditingPreview();
});

const FILTERS = {
  none: () => {},
  mono: (data) => {
    for (let i = 0; i < data.length; i += 4) {
      const g = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      data[i] = data[i + 1] = data[i + 2] = g;
    }
  },
  sepia: (data) => {
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      data[i]     = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
      data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
      data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
    }
  }
};

function applyVintageGrainAndTone(data) {
  const contrastFactor = 1.35;
  const grainAmount = 20;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    const noise = (Math.random() - 0.5) * grainAmount;
    const adjusted = (gray - 128) * contrastFactor + 128 + noise;

    data[i]     = Math.min(255, Math.max(0, adjusted + 12));
    data[i + 1] = Math.min(255, Math.max(0, adjusted + 5));
    data[i + 2] = Math.min(255, Math.max(0, adjusted - 12));
  }
}

function drawVignette(ctx, width, height) {
  const cx = width / 2;
  const cy = height / 2;
  const outerRadius = Math.sqrt(cx * cx + cy * cy);

  const gradient = ctx.createRadialGradient(cx, cy, outerRadius * 0.35, cx, cy, outerRadius * 0.95);
  gradient.addColorStop(0, 'rgba(0,0,0,0)');
  gradient.addColorStop(1, 'rgba(0,0,0,0.55)');

  ctx.globalCompositeOperation = 'multiply';
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = 'source-over';
}

function loadImage(src) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = src;
  });
}

async function applyFilterToImage(img, filterName) {
  if (filterName === 'none') return img;

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = img.width;
  tempCanvas.height = img.height;
  const tempCtx = tempCanvas.getContext('2d');

  if (filterName === 'vintage') {
    tempCtx.filter = 'blur(1px)';
    tempCtx.drawImage(img, 0, 0);
    tempCtx.filter = 'none';

    const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    applyVintageGrainAndTone(imageData.data);
    tempCtx.putImageData(imageData, 0, 0);

    drawVignette(tempCtx, tempCanvas.width, tempCanvas.height);
  } else {
    tempCtx.drawImage(img, 0, 0);
    const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    FILTERS[filterName](imageData.data);
    tempCtx.putImageData(imageData, 0, 0);
  }

  return loadImage(tempCanvas.toDataURL('image/png'));
}

async function goToResult() {
  finalSaveItems = [];

  if (stripLayout === 'none') {
    const rawImages = await Promise.all(capturedPhotos.map(record => loadImage(record.currentDataUrl)));
    const filteredImages = await Promise.all(rawImages.map(img => applyFilterToImage(img, activeFilter)));
    filteredImages.forEach((img, i) => {
      finalSaveItems.push({ url: img.src, filename: `photo${i + 1}.png` });
    });
  } else if (currentStripCanvas) {
    finalSaveItems.push({ url: currentStripCanvas.toDataURL('image/png'), filename: 'photostrip.png' });
  }

  resultPreview.innerHTML = '';
  finalSaveItems.forEach(item => {
    const img = document.createElement('img');
    img.src = item.url;
    img.width = 280;
    resultPreview.appendChild(img);
  });

  setView('result');
}

doneBtn.addEventListener('click', goToResult);

backToEditingBtn.addEventListener('click', () => {
  refreshEditingPreview();
  setView('editing');
});

finalSaveBtn.addEventListener('click', () => {
  finalSaveItems.forEach(item => {
    const link = document.createElement('a');
    link.href = item.url;
    link.download = item.filename;
    link.click();
  });
});

const noneStripBgButton = document.createElement('button');
noneStripBgButton.className = 'asset-btn';
noneStripBgButton.dataset.stripbg = 'none';
noneStripBgButton.textContent = '—';
stripBgImageButtons.appendChild(noneStripBgButton);

stripBackgroundRegistry.forEach(bg => {
  const button = document.createElement('button');
  button.className = 'asset-btn';
  button.dataset.stripbg = bg.name;

  const img = document.createElement('img');
  img.src = bg.src;
  button.appendChild(img);

  stripBgImageButtons.appendChild(button);
});

stripBgImageButtons.addEventListener('click', (event) => {
  const btn = event.target.closest('button');
  if (btn && btn.dataset.stripbg) {
    if (btn.dataset.stripbg === 'none') {
      stripBgImageEntry = null;
    } else {
      stripBgImageEntry = stripBackgroundRegistry.find(bg => bg.name === btn.dataset.stripbg);
    }
    refreshEditingPreview();

    stripBgImageButtons.querySelectorAll('button').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  }
});

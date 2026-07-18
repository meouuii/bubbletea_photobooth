function buildStrip(images, options) {
  const padding = 24;
  const gap = 14;
  const photoWidth = images[0].width;
  const photoHeight = images[0].height;

  let cols, rows;
  if (options.layout === 'grid2col') {
    cols = 2;
    rows = Math.ceil(images.length / 2);
  } else {
    cols = 1;
    rows = images.length;
  }

  const footerHeight = options.whitespace ? 110 : 0;
  const stripWidth = padding * 2 + cols * photoWidth + (cols - 1) * gap;
  const stripHeight = padding * 2 + rows * photoHeight + (rows - 1) * gap + footerHeight;

  const stripCanvas = document.createElement('canvas');
  stripCanvas.width = stripWidth;
  stripCanvas.height = stripHeight;
  const ctx = stripCanvas.getContext('2d');

  ctx.fillStyle = options.bgColor;
  ctx.fillRect(0, 0, stripWidth, stripHeight);

  if (options.bgImage && options.bgImage.complete) {
    ctx.drawImage(options.bgImage, 0, 0, stripWidth, stripHeight);
  }

  images.forEach((img, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = padding + col * (photoWidth + gap);
    const y = padding + row * (photoHeight + gap);
    ctx.drawImage(img, x, y, photoWidth, photoHeight);
  });

  return stripCanvas;
}
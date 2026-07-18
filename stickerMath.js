export function getStickerTransform(points, anchorIndexA, anchorIndexB, canvasWidth, canvasHeight, referenceDistance) {
  const pointA = points[anchorIndexA];
  const pointB = points[anchorIndexB];

  const ax = pointA.x * canvasWidth;
  const ay = pointA.y * canvasHeight;
  const bx = pointB.x * canvasWidth;
  const by = pointB.y * canvasHeight;

  const dx = bx - ax;
  const dy = by - ay;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx);

  const centerX = (ax + bx) / 2;
  const centerY = (ay + by) / 2;

  const scale = distance / referenceDistance;

  return { x: centerX, y: centerY, angle: angle, scale: scale };
}

export function getForeheadAnchorTransform(points, canvasWidth, canvasHeight, referenceDistance, extensionRatio = 0.45) {
  const chin = points[152];
  const foreheadTracked = points[10];

  const chinX = chin.x * canvasWidth;
  const chinY = chin.y * canvasHeight;
  const foreheadX = foreheadTracked.x * canvasWidth;
  const foreheadY = foreheadTracked.y * canvasHeight;

  const dx = foreheadX - chinX;
  const dy = foreheadY - chinY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx);

  const estimatedX = foreheadX + dx * extensionRatio;
  const estimatedY = foreheadY + dy * extensionRatio;

  const scale = distance / referenceDistance;

  return { x: estimatedX, y: estimatedY, angle: angle + Math.PI / 2, scale: scale };
}
export const stickerRegistry = [
  {
    name: 'glasses1',
    src: './assets/stickers/glasses1.png',
    image: new Image(),
    placements: [
      { type: 'landmarks', indexA: 205, indexB:425, referenceDistance: 230, offsetY: -95, offsetX:10}
    ]
  },
  {
    name: 'glasses2',
    src: './assets/stickers/glasses2.png',
    image: new Image(),
    placements: [
      { type: 'landmarks', indexA: 205, indexB:425, referenceDistance: 200, offsetY: -115 }
    ]
  },
  {
    name: 'glasses3',
    src: './assets/stickers/glasses3.png',
    image: new Image(),
    placements: [
      { type: 'landmarks', indexA: 205, indexB:425, referenceDistance: 255, offsetY: -115 }
    ]
  },
  {
    name: 'glasses4',
    src: './assets/stickers/glasses4.png',
    image: new Image(),
    placements: [
      { type: 'landmarks', indexA: 205, indexB:425, referenceDistance: 210, offsetY: -108, offsetX:3}
    ]
  },
  {
    name: 'glasses5',
    src: './assets/stickers/glasses5.png',
    image: new Image(),
    placements: [
      { type: 'landmarks', indexA: 205, indexB:425, referenceDistance: 160, offsetY: -70, offsetX:-10 }
    ]
  },
  {
    name: 'star',
    src: './assets/stickers/star.png',
    image: new Image(),
    placements: [
      { type: 'landmarks', indexA: 168, indexB: 1, referenceDistance: 200, offsetAngle:1 ,offsetX:40 ,offsetY:-60}
    ]
  },
  {
    name: 'blush',
    src: './assets/stickers/blush.png',
    image: new Image(),
    placements: [
      { type: 'landmarks', indexA: 220, indexB: 440, referenceDistance: 50 }
    ]
  },
  {
    name: 'ears',
    src: './assets/stickers/ears.png',
    image: new Image(),
    placements: [
      { type: 'forehead', referenceDistance: 450, extensionRatio: 0.5 }
    ]
  },
  {
    name: 'crown',
    src: './assets/stickers/crown.png',
    image: new Image(),
    placements: [
      { type: 'forehead', referenceDistance: 400, extensionRatio: 0.3, offsetX:-110}
    ]
  },
  {
    name: 'tiara',
    src: './assets/stickers/tiara.png',
    image: new Image(),
    placements: [
      { type: 'forehead', referenceDistance: 400, extensionRatio: 0.45, offsetX:-40, offsetAngle:-0.05}
    ]
  },
  {
    name: 'heartCrown',
    src: './assets/stickers/HeartCrown.png',
    image: new Image(),
    placements: [
      { type: 'forehead', referenceDistance: 200, extensionRatio: 0.05,  offsetY:60}
    ]
  },{
    name: 'bow',
    src: './assets/stickers/bow.png',
    image: new Image(),
    placements: [
      { type: 'forehead', referenceDistance: 700, extensionRatio: 0.08, offsetX: 240, offsetY: -40, offsetAngle: 0.4 }
    ]
  },{
    name: 'blush2',
    src: './assets/stickers/blush2.png',
    image: new Image(),
    placements: [
      { type: 'landmarks', indexA: 220, indexB: 440, referenceDistance: 60 ,offsetY:-20}
    ]
  },{
    name: 'plant',
    src: './assets/stickers/plant.png',
    image: new Image(),
    placements: [
      { type: 'forehead', referenceDistance: 650, extensionRatio: 0.5 }
    ]
  },{
    name: 'bunnies',
    src: './assets/stickers/bunnies.png',
    image: new Image(),
    placements: [
      { type: 'forehead', referenceDistance: 300, extensionRatio: 0.3, offsetX:-15}
    ]
  },
  {
    name: 'bdayhat1',
    src: './assets/stickers/bdayhat1.png',
    image: new Image(),
    placements: [
      { type: 'forehead', referenceDistance: 230, extensionRatio: 0.45, offsetX:-20,offsetY:-60}
    ]
  },
  {
    name: 'bdayhat2',
    src: './assets/stickers/bdayhat2.png',
    image: new Image(),
    placements: [
      { type: 'forehead', referenceDistance: 200, extensionRatio: 0.45,offsetY:80, offsetX:-20, offsetAngle:-0.18}
    ]
  },{
    name: 'animals',
    src: './assets/stickers/animals.png',
    image: new Image(),
    placements: [
      { type: 'forehead', referenceDistance: 400, extensionRatio: 0.08, offsetX: 120, offsetY: -40, offsetAngle: 0.4 }
    ]
  },{
    name: 'angryvein',
    src: './assets/stickers/angryvein.png',
    image: new Image(),
    placements: [
      { type: 'forehead', referenceDistance: 850, extensionRatio: 0.08, offsetX: -230, offsetY: 140, offsetAngle: 0.4 }
    ]
  },
  {
    name: 'dog',
    src: './assets/stickers/dog.png',
    image: new Image(),
    placements: [
      { type: 'landmarks', indexA: 205, indexB:425, referenceDistance: 160, offsetY: -130}
    ]
  }
];

stickerRegistry.forEach(sticker => {
  sticker.image.src = sticker.src;
});
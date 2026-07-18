const landscapeFrames = [];

for (let i = 1; i <= 17; i++) {
  const frame = {
    name: `landscapeFrame${i}`,
    src: `./assets/frames/landscape frames/frame (${i}).png`,
    image: new Image()
  };
  frame.image.src = frame.src;
  landscapeFrames.push(frame);
}

const portraitFrames = [];

for (let i = 1; i <= 4; i++) {
  const frame = {
    name: `portraitFrame${i}`,
    src: `./assets/frames/portrait frames/frame (${i}).png`,
    image: new Image()
  };
  frame.image.src = frame.src;
  portraitFrames.push(frame);
}
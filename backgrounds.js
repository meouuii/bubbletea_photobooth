export const backgroundRegistry = [];

for (let i = 1; i <= 14; i++) {
  const bg = {
    name: `bg${i}`,
    src: `./assets/backgrounds/bg(${i}).jpg`,
    image: new Image()
  };
  bg.image.src = bg.src;
  backgroundRegistry.push(bg);
}
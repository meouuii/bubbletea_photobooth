const stripBackgroundRegistry = [];

for (let i = 1; i <= 34; i++) {
  const bg = {
    name: `sbg${i}`,
    src: `./assets/strip_bg/sBg (${i}).jpg`,
    image: new Image()
  };
  bg.image.src = bg.src;
  stripBackgroundRegistry.push(bg);
}
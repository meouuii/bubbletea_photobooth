const starChars = ['✦', '✧', '⋆', '✩','★', '☆', '✫', '✬', '✭', '✮', '✯'];
let lastStarTime = 0;

document.addEventListener('mousemove', (e) => {
  const now = Date.now();
  if (now - lastStarTime < 60) return;
  lastStarTime = now;

  const star = document.createElement('div');
  star.className = 'cursor-star';
  star.textContent = starChars[Math.floor(Math.random() * starChars.length)];
  star.style.left = e.clientX + 'px';
  star.style.top = e.clientY + 'px';
  document.body.appendChild(star);

  gsap.to(star, {
    x: (Math.random() - 0.5) * 40,
    y: (Math.random() - 0.5) * 40 - 20,
    scale: 0,
    opacity: 0,
    rotation: (Math.random() - 0.5) * 90,
    duration: 0.9,
    ease: 'power1.out',
    onComplete: () => star.remove()
  });
});



const proximityRadius = 90;
const maxScale = 1.15;

document.addEventListener('mousemove', (e) => {
  document.querySelectorAll('button').forEach(btn => {
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dist = Math.hypot(e.clientX - cx, e.clientY - cy);

    if (dist < proximityRadius) {
      const scale = 1 + (1 - dist / proximityRadius) * (maxScale - 1);
      gsap.to(btn, { scale: scale, duration: 0.25, ease: 'power2.out' });
    } else {
      gsap.to(btn, { scale: 1, duration: 0.25, ease: 'power2.out' });
    }
  });
});


const landingLogo = document.getElementById('landingLogo');
const landingViewEl = document.getElementById('landingView');

landingViewEl.addEventListener('mousemove', (e) => {
  const rect = landingViewEl.getBoundingClientRect();
  const px = (e.clientX - rect.left) / rect.width - 0.5;
  const py = (e.clientY - rect.top) / rect.height - 0.5;

  gsap.to(landingLogo, {
    rotateY: px * 30,
    rotateX: -py * 30,
    transformPerspective: 600,
    transformOrigin: 'center',
    duration: 0.4,
    ease: 'power2.out'
  });
});

landingViewEl.addEventListener('mouseleave', () => {
  gsap.to(landingLogo, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power3.out' });
});


function initSmoothScroll(container) {
  container.addEventListener('wheel', (e) => {
    e.preventDefault();

    const maxScroll = container.scrollHeight - container.clientHeight;
    const startTarget = container._smoothTarget !== undefined ? container._smoothTarget : container.scrollTop;
    let target = startTarget + e.deltaY;
    target = Math.max(0, Math.min(target, maxScroll));
    container._smoothTarget = target;

    gsap.to(container, {
      scrollTop: target,
      duration: 0.35,
      ease: 'power3.out',
      overwrite: true
    });
  }, { passive: false });
}

document.querySelectorAll('.workspace-right').forEach(initSmoothScroll);
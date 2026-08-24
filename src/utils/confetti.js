// src/utils/confetti.js
// Pure vanilla JS confetti — no external library needed!

const COLORS = [
  '#6C47FF', '#4A2FD9', '#FF6B35', '#10b981',
  '#f59e0b', '#ec4899', '#06b6d4', '#84cc16',
];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

class Particle {
  constructor(canvas) {
    this.canvas = canvas;
    this.reset();
  }

  reset() {
    this.x = randomBetween(0, this.canvas.width);
    this.y = randomBetween(-this.canvas.height * 0.3, 0);
    this.size = randomBetween(6, 14);
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.speedX = randomBetween(-3, 3);
    this.speedY = randomBetween(3, 8);
    this.rotation = randomBetween(0, 360);
    this.rotationSpeed = randomBetween(-6, 6);
    this.opacity = 1;
    this.shape = Math.random() > 0.5 ? 'rect' : 'circle';
    this.wobble = randomBetween(0, Math.PI * 2);
    this.wobbleSpeed = randomBetween(0.05, 0.12);
    this.scaleX = 1;
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX + Math.sin(this.wobble) * 1.5;
    this.wobble += this.wobbleSpeed;
    this.rotation += this.rotationSpeed;
    this.scaleX = Math.abs(Math.cos(this.wobble));
    if (this.y > this.canvas.height * 0.85) {
      this.opacity = Math.max(0, this.opacity - 0.04);
    }
    return this.y < this.canvas.height + 20 && this.opacity > 0;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.scale(this.scaleX, 1);
    ctx.fillStyle = this.color;

    if (this.shape === 'rect') {
      ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

export function fireConfetti({ count = 120, duration = 3000 } = {}) {
  // Create canvas overlay
  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    pointer-events: none; z-index: 99999;
  `;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const particles = Array.from({ length: count }, () => new Particle(canvas));
  let animId;
  const startTime = Date.now();

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const elapsed = Date.now() - startTime;
    const alive = particles.filter((p) => {
      const stillAlive = p.update();
      if (stillAlive) p.draw(ctx);
      return stillAlive;
    });

    if (alive.length > 0 && elapsed < duration + 1000) {
      animId = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animId);
      canvas.remove();
    }
  }

  animate();
}

// Premium burst — 2-stage fire like Apple does it
export function fireDownloadConfetti() {
  fireConfetti({ count: 100, duration: 2500 });
  setTimeout(() => fireConfetti({ count: 60, duration: 2000 }), 350);
}

export function fire100Confetti() {
  fireConfetti({ count: 80, duration: 2200 });
  setTimeout(() => fireConfetti({ count: 50, duration: 1800 }), 500);
}

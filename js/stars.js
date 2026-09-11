/**
 * Cosmic Starfield & Parallax Engine
 * Renders 3D-depth stars, nebulae, shooting stars, and warp-speed acceleration.
 */

class Starfield {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Mouse parallax
    this.mouseX = this.width / 2;
    this.mouseY = this.height / 2;
    this.targetMouseX = this.mouseX;
    this.targetMouseY = this.mouseY;

    // Warp mode
    this.isWarping = false;
    this.warpSpeed = 1;

    this.stars = [];
    this.shootingStars = [];
    this.nebulae = [];

    this.init();
    this.bindEvents();
    this.animate();
  }

  init() {
    this.resize();
    this.createStars(280);
    this.createNebulae(4);
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  createStars(count) {
    this.stars = [];
    const colors = ['#ffffff', '#00f0ff', '#a855f7', '#93c5fd', '#f43f5e'];

    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: (Math.random() - 0.5) * this.width * 1.5,
        y: (Math.random() - 0.5) * this.height * 1.5,
        z: Math.random() * this.width, // Depth
        size: Math.random() * 1.6 + 0.4,
        color: colors[Math.floor(Math.random() * colors.length)],
        twinkleSpeed: 0.02 + Math.random() * 0.04,
        twinklePhase: Math.random() * Math.PI * 2
      });
    }
  }

  createNebulae(count) {
    this.nebulae = [];
    const colors = [
      'rgba(0, 240, 255, 0.035)',
      'rgba(168, 85, 247, 0.045)',
      'rgba(59, 130, 246, 0.03)',
      'rgba(189, 0, 255, 0.035)'
    ];

    for (let i = 0; i < count; i++) {
      this.nebulae.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: 250 + Math.random() * 250,
        color: colors[i % colors.length],
        driftX: (Math.random() - 0.5) * 0.15,
        driftY: (Math.random() - 0.5) * 0.15
      });
    }
  }

  spawnShootingStar() {
    if (this.isWarping || Math.random() > 0.025) return;
    if (this.shootingStars.length >= 3) return;

    const startX = Math.random() * this.width * 0.8;
    const startY = Math.random() * (this.height * 0.5);
    const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.3; // roughly 45 deg
    const speed = 14 + Math.random() * 10;

    this.shootingStars.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      length: 120 + Math.random() * 80,
      life: 1.0,
      decay: 0.015 + Math.random() * 0.015,
      color: Math.random() > 0.5 ? '#00f0ff' : '#ffffff'
    });
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.targetMouseX = e.clientX;
      this.targetMouseY = e.clientY;
    });
  }

  triggerWarp() {
    this.isWarping = true;
    this.warpSpeed = 1;
    if (window.soundFX) window.soundFX.playClick();

    const warpInterval = setInterval(() => {
      this.warpSpeed += 0.8;
      if (this.warpSpeed > 22) {
        clearInterval(warpInterval);
        setTimeout(() => {
          this.isWarping = false;
          this.warpSpeed = 1;
        }, 1200);
      }
    }, 40);
  }

  animate() {
    // Parallax easing
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

    const offsetX = (this.mouseX - this.width / 2) * 0.05;
    const offsetY = (this.mouseY - this.height / 2) * 0.05;

    // Clear background
    this.ctx.fillStyle = '#030308';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Render Nebulae
    for (const neb of this.nebulae) {
      neb.x += neb.driftX;
      neb.y += neb.driftY;
      if (neb.x < -neb.radius) neb.x = this.width + neb.radius;
      if (neb.x > this.width + neb.radius) neb.x = -neb.radius;
      if (neb.y < -neb.radius) neb.y = this.height + neb.radius;
      if (neb.y > this.height + neb.radius) neb.y = -neb.radius;

      const grad = this.ctx.createRadialGradient(
        neb.x - offsetX * 0.5, neb.y - offsetY * 0.5, 0,
        neb.x - offsetX * 0.5, neb.y - offsetY * 0.5, neb.radius
      );
      grad.addColorStop(0, neb.color);
      grad.addColorStop(1, 'transparent');

      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(neb.x - offsetX * 0.5, neb.y - offsetY * 0.5, neb.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Render 3D Stars
    const cx = this.width / 2;
    const cy = this.height / 2;

    const speed = this.isWarping ? this.warpSpeed : 0.65;

    for (let i = 0; i < this.stars.length; i++) {
      const star = this.stars[i];
      star.z -= speed;

      if (star.z <= 0) {
        star.z = this.width;
        star.x = (Math.random() - 0.5) * this.width * 1.5;
        star.y = (Math.random() - 0.5) * this.height * 1.5;
      }

      const k = 250 / star.z;
      const px = star.x * k + cx - offsetX * (1 - star.z / this.width);
      const py = star.y * k + cy - offsetY * (1 - star.z / this.width);

      if (px >= 0 && px <= this.width && py >= 0 && py <= this.height) {
        star.twinklePhase += star.twinkleSpeed;
        const brightness = 0.5 + Math.sin(star.twinklePhase) * 0.5;
        const size = Math.max(0.6, (1 - star.z / this.width) * star.size * 2.2);

        this.ctx.save();
        this.ctx.fillStyle = star.color;
        this.ctx.globalAlpha = Math.min(1, Math.max(0.1, (1 - star.z / this.width) * brightness));

        if (this.isWarping) {
          // Warp light streaks
          const prevK = 250 / (star.z + speed * 3.5);
          const prevPx = star.x * prevK + cx;
          const prevPy = star.y * prevK + cy;

          this.ctx.strokeStyle = star.color;
          this.ctx.lineWidth = size * 1.4;
          this.ctx.beginPath();
          this.ctx.moveTo(px, py);
          this.ctx.lineTo(prevPx, prevPy);
          this.ctx.stroke();
        } else {
          this.ctx.beginPath();
          this.ctx.arc(px, py, size, 0, Math.PI * 2);
          this.ctx.fill();

          // Subtle lens flare glow for large foreground stars
          if (size > 1.8) {
            this.ctx.fillStyle = 'rgba(0, 240, 255, 0.15)';
            this.ctx.beginPath();
            this.ctx.arc(px, py, size * 2.5, 0, Math.PI * 2);
            this.ctx.fill();
          }
        }
        this.ctx.restore();
      }
    }

    // Shooting Stars
    this.spawnShootingStar();
    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const s = this.shootingStars[i];
      s.x += s.vx;
      s.y += s.vy;
      s.life -= s.decay;

      if (s.life <= 0 || s.x > this.width || s.y > this.height) {
        this.shootingStars.splice(i, 1);
        continue;
      }

      this.ctx.save();
      const grad = this.ctx.createLinearGradient(
        s.x, s.y,
        s.x - s.vx * (s.length / 18),
        s.y - s.vy * (s.length / 18)
      );
      grad.addColorStop(0, s.color);
      grad.addColorStop(1, 'transparent');

      this.ctx.strokeStyle = grad;
      this.ctx.lineWidth = 1.8;
      this.ctx.globalAlpha = s.life;
      this.ctx.beginPath();
      this.ctx.moveTo(s.x, s.y);
      this.ctx.lineTo(s.x - s.vx * (s.length / 18), s.y - s.vy * (s.length / 18));
      this.ctx.stroke();
      this.ctx.restore();
    }

    requestAnimationFrame(() => this.animate());
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.starfield = new Starfield('starfield-canvas');
});

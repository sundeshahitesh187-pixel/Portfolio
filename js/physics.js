/**
 * Anti-Gravity 2D Physics Engine
 * Handles Zero-G float, drag & toss, momentum, angular velocity, elastic rebounds,
 * body-to-body collisions, magnetic cursor tractor-beam, and gravity modes.
 */

class PhysicsEngine {
  constructor() {
    this.bodies = [];
    this.gravityMode = 'zero-g'; // 'zero-g', 'moon', 'earth', 'vortex', 'docked'
    this.cursor = { x: -9999, y: -9999, isDown: false, targetBody: null };
    this.tetherCanvas = document.getElementById('physics-tether-canvas');
    this.tetherCtx = this.tetherCanvas ? this.tetherCanvas.getContext('2d') : null;

    this.rafId = null;
    this.lastTime = performance.now();

    this.initTetherCanvas();
    this.bindEvents();
    this.start();
  }

  initTetherCanvas() {
    if (!this.tetherCanvas) return;
    this.tetherCanvas.width = window.innerWidth;
    this.tetherCanvas.height = window.innerHeight;
    window.addEventListener('resize', () => {
      this.tetherCanvas.width = window.innerWidth;
      this.tetherCanvas.height = window.innerHeight;
    });
  }

  setGravityMode(mode) {
    this.gravityMode = mode;
    if (window.soundFX) window.soundFX.playGravitySwitch(mode);

    if (mode === 'docked') {
      this.bodies.forEach(b => {
        b.isDocked = true;
      });
    } else {
      this.bodies.forEach(b => {
        b.isDocked = false;
        // Give a little un-docking impulse if releasing from docked
        if (Math.abs(b.vx) < 0.1 && Math.abs(b.vy) < 0.1) {
          b.vx = (Math.random() - 0.5) * 3;
          b.vy = (Math.random() - 0.5) * 3;
          b.vAngle = (Math.random() - 0.5) * 1.5;
        }
      });
    }

    // Update HUD indicator if present
    document.querySelectorAll('.hud-mode-btn').forEach(btn => {
      if (btn.dataset.mode === mode) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  registerBody(element, options = {}) {
    const container = options.container || element.parentElement;
    const rect = element.getBoundingClientRect();
    const cRect = container.getBoundingClientRect();

    const body = {
      element,
      container,
      isCircle: options.isCircle !== undefined ? options.isCircle : true,
      width: rect.width || 80,
      height: rect.height || 40,
      radius: options.radius || Math.max(rect.width, rect.height) / 2,
      x: options.initialX !== undefined ? options.initialX : rect.left - cRect.left,
      y: options.initialY !== undefined ? options.initialY : rect.top - cRect.top,
      vx: options.vx !== undefined ? options.vx : (Math.random() - 0.5) * 2,
      vy: options.vy !== undefined ? options.vy : (Math.random() - 0.5) * 2,
      angle: options.initialAngle || (Math.random() - 0.5) * 20,
      vAngle: options.vAngle !== undefined ? options.vAngle : (Math.random() - 0.5) * 0.8,
      mass: options.mass || 1,
      restitution: options.restitution || 0.82,
      damping: options.damping || 0.995,
      isDragging: false,
      isDocked: false,
      dockX: rect.left - cRect.left,
      dockY: rect.top - cRect.top,
      dockAngle: 0,
      historyPointer: [],
      category: options.category || 'generic'
    };

    this.attachDragEvents(body);
    this.bodies.push(body);
    return body;
  }

  attachDragEvents(body) {
    const el = body.element;

    const onPointerDown = (e) => {
      if (e.button !== undefined && e.button !== 0) return; // Only left click
      // Don't drag if clicking an anchor button inside card unless it's the card background
      if (e.target.tagName === 'A' || e.target.classList.contains('btn-card-action')) {
        return;
      }

      body.isDragging = true;
      body.isDocked = false;
      this.cursor.targetBody = body;

      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      const cRect = body.container.getBoundingClientRect();

      body.dragOffsetX = clientX - cRect.left - body.x;
      body.dragOffsetY = clientY - cRect.top - body.y;
      body.historyPointer = [{ x: clientX, y: clientY, t: performance.now() }];

      if (window.soundFX) window.soundFX.playClick();
      e.preventDefault();
    };

    el.addEventListener('mousedown', onPointerDown);
    el.addEventListener('touchstart', onPointerDown, { passive: false });
  }

  bindEvents() {
    const onMove = (e) => {
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);

      this.cursor.x = clientX;
      this.cursor.y = clientY;

      if (this.cursor.targetBody && this.cursor.targetBody.isDragging) {
        const body = this.cursor.targetBody;
        const cRect = body.container.getBoundingClientRect();

        const targetX = clientX - cRect.left - body.dragOffsetX;
        const targetY = clientY - cRect.top - body.dragOffsetY;

        body.x = targetX;
        body.y = targetY;

        const now = performance.now();
        body.historyPointer.push({ x: clientX, y: clientY, t: now });
        if (body.historyPointer.length > 6) body.historyPointer.shift();
      }
    };

    const onUp = () => {
      if (this.cursor.targetBody && this.cursor.targetBody.isDragging) {
        const body = this.cursor.targetBody;
        body.isDragging = false;
        this.cursor.targetBody = null;

        // Calculate toss velocity from history
        if (body.historyPointer.length >= 2) {
          const oldest = body.historyPointer[0];
          const latest = body.historyPointer[body.historyPointer.length - 1];
          const dt = Math.max(10, latest.t - oldest.t);

          body.vx = ((latest.x - oldest.x) / dt) * 14;
          body.vy = ((latest.y - oldest.y) / dt) * 14;

          // Clamp max throw velocity
          const speed = Math.hypot(body.vx, body.vy);
          if (speed > 25) {
            body.vx = (body.vx / speed) * 25;
            body.vy = (body.vy / speed) * 25;
          }

          body.vAngle = (body.vx * 0.2 + (Math.random() - 0.5) * 2);
          if (window.soundFX) window.soundFX.playThrow(speed);
        }
      }
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);
  }

  start() {
    const loop = (now) => {
      const dt = Math.min(32, now - this.lastTime) / 16.666; // Normalized to 60fps
      this.lastTime = now;

      this.update(dt);
      this.renderTethers();

      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }

  update(dt) {
    // 1. Apply Gravitational Forces & Velocities
    for (let i = 0; i < this.bodies.length; i++) {
      const b = this.bodies[i];
      if (b.isDragging) continue;

      if (b.isDocked || this.gravityMode === 'docked') {
        // Damped spring to docked position
        const k = 0.08;
        const c = 0.82;
        const fx = -k * (b.x - b.dockX);
        const fy = -k * (b.y - b.dockY);
        b.vx = (b.vx + fx) * c;
        b.vy = (b.vy + fy) * c;
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        b.angle += (b.dockAngle - b.angle) * 0.15;
        b.vAngle = 0;
        continue;
      }

      // Gravity Modes
      switch (this.gravityMode) {
        case 'zero-g':
          // Subtle cosmic micro-drift to prevent dead halts
          if (Math.hypot(b.vx, b.vy) < 0.3) {
            b.vx += (Math.random() - 0.5) * 0.1;
            b.vy += (Math.random() - 0.5) * 0.1;
          }
          break;
        case 'moon':
          b.vy += 0.15 * dt;
          break;
        case 'earth':
          b.vy += 0.65 * dt;
          break;
        case 'vortex':
          const cRect = b.container.getBoundingClientRect();
          const cx = cRect.width / 2;
          const cy = cRect.height / 2;
          const dx = cx - b.x;
          const dy = cy - b.y;
          const dist = Math.max(30, Math.hypot(dx, dy));
          const force = (250 / (dist + 50)) * dt;
          // Inward radial pull + tangential orbital swirl
          b.vx += (dx / dist) * force - (dy / dist) * (force * 0.8);
          b.vy += (dy / dist) * force + (dx / dist) * (force * 0.8);
          b.vAngle += 0.05 * dt;
          break;
      }

      // Magnetic Tractor Beam / Cursor Interaction
      // Hovering slows down element or magnetically attracts
      const cRect = b.container.getBoundingClientRect();
      const bodyScreenX = cRect.left + b.x + b.width / 2;
      const bodyScreenY = cRect.top + b.y + b.height / 2;
      const distToCursor = Math.hypot(this.cursor.x - bodyScreenX, this.cursor.y - bodyScreenY);

      if (distToCursor < 140) {
        // Slow down smoothly when cursor hovers
        b.vx *= 0.92;
        b.vy *= 0.92;
        b.vAngle *= 0.9;

        // Gentle magnetic snap towards cursor if within 70px
        if (distToCursor < 70) {
          const pull = (70 - distToCursor) * 0.03;
          b.vx += ((this.cursor.x - bodyScreenX) / distToCursor) * pull;
          b.vy += ((this.cursor.y - bodyScreenY) / distToCursor) * pull;
        }
      } else {
        b.vx *= Math.pow(b.damping, dt);
        b.vy *= Math.pow(b.damping, dt);
        b.vAngle *= Math.pow(0.992, dt);
      }

      // Update positions
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.angle += b.vAngle * dt;

      // Container Boundary Collisions
      const minX = 0;
      const maxX = Math.max(10, cRect.width - b.width);
      const minY = 0;
      const maxY = Math.max(10, cRect.height - b.height);

      let bounced = false;
      if (b.x < minX) {
        b.x = minX;
        b.vx = -b.vx * b.restitution;
        b.vAngle += (Math.random() - 0.5) * 1.5;
        bounced = true;
      } else if (b.x > maxX) {
        b.x = maxX;
        b.vx = -b.vx * b.restitution;
        b.vAngle += (Math.random() - 0.5) * 1.5;
        bounced = true;
      }

      if (b.y < minY) {
        b.y = minY;
        b.vy = -b.vy * b.restitution;
        b.vAngle += (Math.random() - 0.5) * 1.5;
        bounced = true;
      } else if (b.y > maxY) {
        b.y = maxY;
        b.vy = -b.vy * b.restitution;
        b.vAngle += (Math.random() - 0.5) * 1.5;
        bounced = true;
      }

      if (bounced && Math.hypot(b.vx, b.vy) > 2) {
        if (window.soundFX) window.soundFX.playBounce(Math.min(1, Math.hypot(b.vx, b.vy) / 10));
      }
    }

    // 2. Body-to-Body Elastic Collision Resolution (Within same container)
    for (let i = 0; i < this.bodies.length; i++) {
      for (let j = i + 1; j < this.bodies.length; j++) {
        const b1 = this.bodies[i];
        const jBody = this.bodies[j];
        if (b1.container !== jBody.container) continue;

        const c1x = b1.x + b1.width / 2;
        const c1y = b1.y + b1.height / 2;
        const c2x = jBody.x + jBody.width / 2;
        const c2y = jBody.y + jBody.height / 2;

        const dx = c2x - c1x;
        const dy = c2y - c1y;
        const dist = Math.hypot(dx, dy);
        const minDist = (b1.radius + jBody.radius) * 0.9;

        if (dist < minDist && dist > 0.001) {
          // Elastic collision impulse
          const nx = dx / dist;
          const ny = dy / dist;
          const overlap = minDist - dist;

          // Separate bodies
          b1.x -= nx * overlap * 0.5;
          b1.y -= ny * overlap * 0.5;
          jBody.x += nx * overlap * 0.5;
          jBody.y += ny * overlap * 0.5;

          // Relative velocity along normal
          const kx = b1.vx - jBody.vx;
          const ky = b1.vy - jBody.vy;
          const p = 2 * (nx * kx + ny * ky) / (b1.mass + jBody.mass);

          b1.vx -= p * jBody.mass * nx * 0.85;
          b1.vy -= p * jBody.mass * ny * 0.85;
          jBody.vx += p * b1.mass * nx * 0.85;
          jBody.vy += p * b1.mass * ny * 0.85;

          b1.vAngle += (Math.random() - 0.5) * 1.2;
          jBody.vAngle += (Math.random() - 0.5) * 1.2;

          if (Math.hypot(b1.vx, b1.vy) > 2.5 && window.soundFX) {
            window.soundFX.playBounce(0.4);
          }
        }
      }
    }

    // 3. Render DOM Transforms
    for (let i = 0; i < this.bodies.length; i++) {
      const b = this.bodies[i];
      b.element.style.transform = `translate3d(${b.x}px, ${b.y}px, 0) rotate(${b.angle}deg)`;
    }
  }

  renderTethers() {
    if (!this.tetherCtx) return;
    this.tetherCtx.clearRect(0, 0, this.tetherCanvas.width, this.tetherCanvas.height);

    for (const b of this.bodies) {
      const cRect = b.container.getBoundingClientRect();
      const bodyScreenX = cRect.left + b.x + b.width / 2;
      const bodyScreenY = cRect.top + b.y + b.height / 2;
      const dist = Math.hypot(this.cursor.x - bodyScreenX, this.cursor.y - bodyScreenY);

      if (dist < 140) {
        const alpha = (1 - dist / 140) * 0.65;
        this.tetherCtx.save();
        this.tetherCtx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
        this.tetherCtx.lineWidth = 1.5;
        this.tetherCtx.setLineDash([4, 4]);

        this.tetherCtx.beginPath();
        this.tetherCtx.moveTo(this.cursor.x, this.cursor.y);
        this.tetherCtx.lineTo(bodyScreenX, bodyScreenY);
        this.tetherCtx.stroke();

        // Glow circle at anchor
        this.tetherCtx.fillStyle = `rgba(0, 240, 255, ${alpha * 0.8})`;
        this.tetherCtx.beginPath();
        this.tetherCtx.arc(bodyScreenX, bodyScreenY, 4, 0, Math.PI * 2);
        this.tetherCtx.fill();
        this.tetherCtx.restore();
      }
    }
  }
}

// Global Physics Engine instance
window.physicsEngine = new PhysicsEngine();

/**
 * Interactive Deep Space CLI Terminal & Transmission Dispatcher
 */

class OrbitalTerminal {
  constructor() {
    this.output = document.getElementById('terminal-output');
    this.input = document.getElementById('terminal-cmd-input');
    this.form = document.getElementById('terminal-form');
    this.progressBar = document.getElementById('transmission-progress-box');
    this.progressBarInner = document.getElementById('transmission-bar-inner');
    this.progressStatus = document.getElementById('transmission-status-text');

    this.commandHistory = [];
    this.historyIndex = -1;

    this.init();
  }

  init() {
    this.bindEvents();
    this.renderWelcome();
  }

  renderWelcome() {
    this.printLine('SYSTEM: Orbital Telemetry Terminal v4.2 initialized.', 'system');
    this.printLine('SESSION: Authenticated user: guest@orbital-receiver', 'purple');
    this.printLine('TIP: Type "help" or click any command chip to test interactive subroutines.', 'system');
  }

  printLine(text, type = 'system') {
    if (!this.output) return;
    const line = document.createElement('div');
    line.className = `term-line ${type}`;
    line.innerHTML = text;
    this.output.appendChild(line);
    this.output.scrollTop = this.output.scrollHeight;
  }

  executeCommand(rawCmd) {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    this.printLine(`hitesh@orbital-core:~$ ${trimmed}`, 'user');
    this.commandHistory.push(trimmed);
    this.historyIndex = this.commandHistory.length;

    const parts = trimmed.split(' ');
    const cmd = parts[0].toLowerCase();
    const arg = parts[1] ? parts[1].toLowerCase() : null;

    if (window.soundFX) window.soundFX.playClick();

    switch (cmd) {
      case 'help':
        this.printLine('--- AVAILABLE SUBSYSTEM COMMANDS ---', 'system');
        this.printLine('  <span style="color:var(--neon-cyan)">about</span>       : Telemetry overview of Hitesh Sundesha', 'system');
        this.printLine('  <span style="color:var(--neon-cyan)">skills</span>      : Query Asteroid Belt technical skills', 'system');
        this.printLine('  <span style="color:var(--neon-cyan)">projects</span>    : Review orbital software & AI modules', 'system');
        this.printLine('  <span style="color:var(--neon-cyan)">gravity [mode]</span>: Alter physics (zero-g, moon, earth, vortex, docked)', 'system');
        this.printLine('  <span style="color:var(--neon-cyan)">warp</span>        : Engage hyperspace starfield acceleration', 'system');
        this.printLine('  <span style="color:var(--neon-cyan)">audio</span>       : Toggle sci-fi audio synthesizer', 'system');
        this.printLine('  <span style="color:var(--neon-cyan)">clear</span>       : Purge terminal display logs', 'system');
        this.printLine('  <span style="color:var(--neon-cyan)">contact</span>     : Focus deep-space transmission form', 'system');
        break;

      case 'about':
        this.printLine('NAME: Hitesh Sundesha', 'purple');
        this.printLine('ROLE: B.Tech Computer Science & Engineering Student', 'system');
        this.printLine('SPECIALIZATION: Distributed Systems, Full-Stack Architecture, AI & Cloud Computing', 'system');
        this.printLine('MISSION: Architecting resilient, high-performance software with state-of-the-art interactive aesthetics.', 'system');
        break;

      case 'skills':
        this.printLine('--- ASTEROID BELT TECHNICAL SPECS ---', 'purple');
        this.printLine('  [Programming] : Python, C++, Java, JavaScript, TypeScript, DSA', 'system');
        this.printLine('  [Web Dev]     : HTML5/CSS3, React, Node.js, Express, REST APIs, WebSockets', 'success');
        this.printLine('  [Cloud]       : AWS (EC2, S3), Docker, Linux, CI/CD, Git Architecture', 'system');
        this.printLine('  [AI & ML]     : PyTorch, Neural Networks, Computer Vision, LLM Agents', 'purple');
        break;

      case 'projects':
        this.printLine('--- ACTIVE ORBITAL PROJECTS ---', 'system');
        this.printLine('  1. Aegis Cloud: Distributed Microservice Orchestration Engine', 'success');
        this.printLine('  2. NeuroSync: Autonomous Multi-Modal Agentic Knowledge Hub', 'purple');
        this.printLine('  3. OrbitalSense: Real-Time Zero-G Physics Simulation Engine', 'system');
        break;

      case 'gravity':
        if (!arg) {
          this.printLine('Usage: gravity [zero-g | moon | earth | vortex | docked]', 'warning');
        } else if (['zero-g', 'moon', 'earth', 'vortex', 'docked'].includes(arg)) {
          if (window.physicsEngine) {
            window.physicsEngine.setGravityMode(arg);
            this.printLine(`GRAV-DECK: Gravity field calibrated to [${arg.toUpperCase()}].`, 'success');
          }
        } else {
          this.printLine(`Invalid gravity parameter: "${arg}". Options: zero-g, moon, earth, vortex, docked.`, 'warning');
        }
        break;

      case 'warp':
        this.printLine('HYPERSPACE: Engaging interstellar warp drive! Coordinates locked.', 'purple');
        if (window.starfield) window.starfield.triggerWarp();
        break;

      case 'audio':
        if (window.soundFX) {
          const enabled = window.soundFX.toggleSound();
          this.printLine(`AUDIO SYNTHESIZER: ${enabled ? 'ONLINE (ENABLED)' : 'OFFLINE (MUTED)'}`, enabled ? 'success' : 'warning');
          const audioToggle = document.getElementById('audio-toggle-btn');
          if (audioToggle) audioToggle.innerHTML = enabled ? '🔊' : '🔇';
        }
        break;

      case 'clear':
        if (this.output) this.output.innerHTML = '';
        this.renderWelcome();
        break;

      case 'contact':
        this.printLine('COMM LINK: Initializing quantum transmission buffers below...', 'system');
        const nameInput = document.getElementById('contact-name');
        if (nameInput) nameInput.focus();
        break;

      case 'matrix':
        this.printLine('Wake up, Neo... The Matrix has you.', 'success');
        break;

      default:
        this.printLine(`Command not recognized: "${trimmed}". Type "help" for valid subroutines.`, 'warning');
        break;
    }
  }

  bindEvents() {
    // Quick command chips
    document.querySelectorAll('.cmd-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const cmd = chip.dataset.cmd;
        if (cmd) {
          this.executeCommand(cmd);
        }
      });
    });

    // Command line input
    if (this.input) {
      this.input.addEventListener('keydown', (e) => {
        if (window.soundFX) window.soundFX.playKey();

        if (e.key === 'Enter') {
          const val = this.input.value;
          this.input.value = '';
          this.executeCommand(val);
        } else if (e.key === 'ArrowUp') {
          if (this.historyIndex > 0) {
            this.historyIndex--;
            this.input.value = this.commandHistory[this.historyIndex];
          }
        } else if (e.key === 'ArrowDown') {
          if (this.historyIndex < this.commandHistory.length - 1) {
            this.historyIndex++;
            this.input.value = this.commandHistory[this.historyIndex];
          } else {
            this.historyIndex = this.commandHistory.length;
            this.input.value = '';
          }
        }
      });
    }

    // Form transmission
    if (this.form) {
      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.transmitMessage();
      });
    }
  }

  transmitMessage() {
    const name = document.getElementById('contact-name')?.value.trim();
    const email = document.getElementById('contact-email')?.value.trim();
    const msg = document.getElementById('contact-message')?.value.trim();

    if (!name || !email || !msg) {
      this.printLine('TRANSMISSION ERROR: All telemetry fields (Name, Frequency, Message) are mandatory.', 'warning');
      return;
    }

    if (window.soundFX) window.soundFX.playTransmit();

    // Show transmission progress simulation
    if (this.progressBar) this.progressBar.style.display = 'block';
    if (this.progressBarInner) this.progressBarInner.style.width = '0%';
    if (this.progressStatus) this.progressStatus.innerText = 'ENCRYPTING PACKET (0%)...';

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 22) + 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);

        if (this.progressBarInner) this.progressBarInner.style.width = '100%';
        if (this.progressStatus) this.progressStatus.innerText = 'TRANSMISSION COMPLETE (100%)';

        setTimeout(() => {
          this.printLine(`[ORBITAL-LINK]: Packet from "${name}" &lt;${email}&gt; verified.`, 'system');
          this.printLine('[ENCRYPTION]: SHA-256 Quantum Key handshake approved.', 'purple');
          this.printLine(`[DISPATCH]: Packet routed to Hitesh's neural terminal. ACK Status: 200 OK.`, 'success');
          this.printLine(`MESSAGE LOGGED: "${msg.slice(0, 50)}${msg.length > 50 ? '...' : ''}"`, 'system');

          // Reset form
          if (this.form) this.form.reset();
          setTimeout(() => {
            if (this.progressBar) this.progressBar.style.display = 'none';
          }, 3500);
        }, 400);
      } else {
        if (this.progressBarInner) this.progressBarInner.style.width = `${progress}%`;
        if (this.progressStatus) this.progressStatus.innerText = `TRANSMITTING PACKET (${progress}%)...`;
      }
    }, 120);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.orbitalTerminal = new OrbitalTerminal();
});

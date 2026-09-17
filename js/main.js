/**
 * Main Application Orchestrator
 * Controls typing animations, 3D typography tilt, physics registration,
 * skills telemetry modal, project cards mode toggle, and HUD controls.
 */

// Skill Telemetry Database for the interactive modal
const SKILLS_DATABASE = {
  // Programming
  'Python': {
    category: 'Programming',
    categoryClass: 'prog',
    level: 95,
    icon: '🐍',
    experience: '3+ Years',
    concepts: ['Object-Oriented Programming', 'Data Structures & Algorithms', 'AsyncIO & Concurrency', 'NumPy & SciPy', 'Automation Scripting'],
    projects: ['Aegis Cloud Worker Queues', 'NeuroSync Embeddings Pipeline', 'AlgoVisualizer Engine'],
    summary: 'Primary language for distributed backend services, algorithm development, and machine learning workflows.'
  },
  'C++': {
    category: 'Programming',
    categoryClass: 'prog',
    level: 90,
    icon: '⚡',
    experience: '2.5 Years',
    concepts: ['STL (Standard Template Library)', 'Memory Management & Pointers', 'Low-Latency Systems', 'Time & Space Optimization'],
    projects: ['Zero-G Physics Collision Core', 'Graph Algorithms Benchmark', 'Competitive Programming (250+ DSA Problems)'],
    summary: 'High-performance computing, complex data structure implementations, and competitive algorithmic challenges.'
  },
  'Java': {
    category: 'Programming',
    categoryClass: 'prog',
    level: 88,
    icon: '☕',
    experience: '2 Years',
    concepts: ['Core Java & OOP', 'Multithreading & JVM Internals', 'Collections Framework', 'Spring Boot Basics'],
    projects: ['Enterprise Student Management System', 'Microservices API Gateway'],
    summary: 'Solid foundation in object-oriented architecture, design patterns, and enterprise backend engineering.'
  },
  'JavaScript': {
    category: 'Programming',
    categoryClass: 'prog',
    level: 94,
    icon: '📜',
    experience: '3 Years',
    concepts: ['ES6+ Modern Syntax', 'Asynchronous Promises/Await', 'Event Loop & Closures', 'DOM & Canvas Physics APIs'],
    projects: ['Anti-Gravity Interactive Portfolio', 'Real-time WebSocket Chat', 'Kinetic 3D Canvas Engine'],
    summary: 'Deep expertise in vanilla JavaScript, reactive UI development, and interactive browser physics.'
  },
  'TypeScript': {
    category: 'Programming',
    categoryClass: 'prog',
    level: 86,
    icon: '🔷',
    experience: '2 Years',
    concepts: ['Strict Typing & Generics', 'Interface & Type Aliases', 'AST & Type Guards', 'Scalable Architecture'],
    projects: ['NeuroSync Agent Dashboard', 'Distributed Telemetry SDK'],
    summary: 'Type-safe modern web application architecture ensuring maintainability and robust interfaces.'
  },
  'DSA': {
    category: 'Programming',
    categoryClass: 'prog',
    level: 92,
    icon: '🧩',
    experience: '3 Years',
    concepts: ['Trees, Graphs & Dynamic Programming', 'Heap & Segment Trees', 'Greedy & Divide & Conquer', 'Complexity Analysis'],
    projects: ['LeetCode & Codeforces Problem Solving', 'Topological Sort Task Scheduler'],
    summary: 'Strong algorithmic reasoning and problem-solving skills across complex data structures.'
  },

  // Web Development
  'React': {
    category: 'Web Development',
    categoryClass: 'web',
    level: 90,
    icon: '⚛️',
    experience: '2 Years',
    concepts: ['Custom Hooks & Context API', 'Virtual DOM & Reconciliation', 'State Management', 'Component Lifecycle Optimization'],
    projects: ['Cloud Management Console', 'AI Agent Orchestration Portal'],
    summary: 'Designing responsive, high-performance user interfaces with clean component composition.'
  },
  'Node.js': {
    category: 'Web Development',
    categoryClass: 'web',
    level: 88,
    icon: '🟢',
    experience: '2.5 Years',
    concepts: ['Event-Driven Non-Blocking I/O', 'Express.js Framework', 'Authentication & JWT', 'Stream & Buffer Processing'],
    projects: ['Aegis Cloud Event Broker', 'RESTful Microservices APIs'],
    summary: 'Building scalable backend APIs, real-time message streams, and server-side utilities.'
  },
  'HTML5 / CSS3': {
    category: 'Web Development',
    categoryClass: 'web',
    level: 95,
    icon: '🌐',
    experience: '3+ Years',
    concepts: ['CSS Grid & Flexbox', 'Glassmorphism & Neon Design Tokens', 'Web Animations & Keyframes', 'Semantic HTML5 & Accessibility'],
    projects: ['Anti-Gravity Cosmic UI System', 'Futuristic Cyberpunk Web Apps'],
    summary: 'Creating visually stunning, responsive, and accessible web experiences from scratch.'
  },
  'REST APIs': {
    category: 'Web Development',
    categoryClass: 'web',
    level: 92,
    icon: '🔌',
    experience: '2.5 Years',
    concepts: ['API Design & Versioning', 'CRUD & Stateless Endpoints', 'Rate Limiting & CORS', 'Swagger / Postman Documentation'],
    projects: ['Microservice Communication Mesh', 'Secure Authentication Microservice'],
    summary: 'Architecting clean, idempotent, and well-documented HTTP endpoints for web and mobile clients.'
  },

  // Cloud Computing
  'AWS': {
    category: 'Cloud Computing',
    categoryClass: 'cloud',
    level: 85,
    icon: '☁️',
    experience: '1.5 Years',
    concepts: ['EC2 Virtual Instances', 'S3 Object Storage', 'IAM Roles & Security Groups', 'Lambda Serverless Computing'],
    projects: ['Cloud Asset Bucket Pipeline', 'Scalable Node Deployment on EC2'],
    summary: 'Deploying, managing, and securing cloud infrastructure on Amazon Web Services.'
  },
  'Docker': {
    category: 'Cloud Computing',
    categoryClass: 'cloud',
    level: 88,
    icon: '🐳',
    experience: '2 Years',
    concepts: ['Dockerfile Multi-Stage Builds', 'Docker Compose Orchestration', 'Volume & Network Isolation', 'Container Optimization'],
    projects: ['Containerized Microservices Cluster', 'Isolated Development Environments'],
    summary: 'Containerizing services for reproducible, consistent deployments across dev and production.'
  },
  'Linux': {
    category: 'Cloud Computing',
    categoryClass: 'cloud',
    level: 90,
    icon: '🐧',
    experience: '3 Years',
    concepts: ['Bash Scripting & Automation', 'Process & Daemon Management (systemd)', 'Permissions & SSH Keys', 'Network Diagnostics'],
    projects: ['Self-Hosted Cloud Server', 'Automated Backup & Telemetry Cron Scripts'],
    summary: 'Proficient in Unix/Linux environment navigation, system administration, and shell scripting.'
  },
  'Git & GitHub': {
    category: 'Cloud Computing',
    categoryClass: 'cloud',
    level: 94,
    icon: '🐙',
    experience: '3+ Years',
    concepts: ['Branching & Gitflow', 'Rebase & Merge Conflict Resolution', 'GitHub Actions CI/CD Pipelines', 'Collaborative Pull Requests'],
    projects: ['Automated Build & Test Workflows', 'Open-Source Project Maintenance'],
    summary: 'Version control mastery and continuous integration pipeline automation.'
  },

  // Artificial Intelligence
  'Machine Learning': {
    category: 'Artificial Intelligence',
    categoryClass: 'ai',
    level: 88,
    icon: '🤖',
    experience: '2 Years',
    concepts: ['Supervised & Unsupervised Learning', 'Regression, Classification & Clustering', 'Feature Engineering & PCA', 'Model Evaluation & Cross-Validation'],
    projects: ['Predictive Telemetry Sensor Model', 'Customer Churn & Anomaly Detector'],
    summary: 'Applying statistical learning algorithms to real-world datasets for predictive intelligence.'
  },
  'PyTorch': {
    category: 'Artificial Intelligence',
    categoryClass: 'ai',
    level: 86,
    icon: '🔥',
    experience: '1.5 Years',
    concepts: ['Tensors & Autograd', 'Custom Neural Network Architectures', 'Loss Functions & Optimizers', 'GPU Acceleration (CUDA)'],
    projects: ['Convolutional Image Classifier', 'Deep Sequence Autoencoder'],
    summary: 'Constructing and training custom deep learning models with modular PyTorch modules.'
  },
  'Neural Networks': {
    category: 'Artificial Intelligence',
    categoryClass: 'ai',
    level: 88,
    icon: '🧠',
    experience: '2 Years',
    concepts: ['Backpropagation & Gradient Descent', 'CNNs for Vision', 'RNNs & Transformers', 'Activation Functions & Regularization'],
    projects: ['Deep Vision Pattern Recognizer', 'Semantic Latent Space Visualizer'],
    summary: 'Understanding deep representations, non-linear mappings, and latent vector spaces.'
  },
  'LLMs & Prompting': {
    category: 'Artificial Intelligence',
    categoryClass: 'ai',
    level: 90,
    icon: '✨',
    experience: '1.5 Years',
    concepts: ['RAG (Retrieval-Augmented Generation)', 'Vector Databases (Chroma, Pinecone)', 'Agentic Tool Calling', 'Prompt Optimization'],
    projects: ['NeuroSync Multi-Agent Knowledge Hub', 'Autonomous Code Review Assistant'],
    summary: 'Engineering agentic AI pipelines with embedding retrieval, memory, and structured reasoning.'
  }
};

// Project Details Database
const PROJECTS_DATABASE = {
  'software': {
    title: 'Aegis Cloud: Distributed Microservice Orchestrator',
    tag: 'SOFTWARE DEVELOPMENT PROJECT',
    category: 'Distributed Systems & Cloud Architecture',
    summary: 'A resilient, high-throughput microservice orchestrator designed to handle asynchronous task distribution, fault-tolerant worker clustering, and real-time event telemetry.',
    features: [
      'Asynchronous task queuing with Redis and distributed worker nodes.',
      'Dynamic load balancing with auto-rebalancing across cluster shards.',
      'Real-time WebSocket telemetry dashboard with sub-10ms event latency.',
      'Dockerized multi-container setup with health-check watchdog circuits.'
    ],
    techStack: ['Node.js', 'Express', 'Redis', 'Docker', 'WebSockets', 'AWS EC2', 'Linux'],
    stats: {
      'Throughput': '14,500 req/sec',
      'Avg Latency': '12ms',
      'Fault Tolerance': '99.99%',
      'Worker Shards': '16 Active'
    },
    status: 'Operational Architecture'
  },
  'ai': {
    title: 'NeuroSync: Autonomous Multi-Modal Agentic Knowledge Hub',
    tag: 'AI / TECH INTEGRATION',
    category: 'Artificial Intelligence & Agent Workflows',
    summary: 'An intelligent multi-agent system combining high-dimensional vector embeddings, semantic retrieval, and autonomous tool calling to synthesize complex technical repositories.',
    features: [
      'Multi-agent role coordination (Researcher, Synthesizer, Code Evaluator).',
      'Dense vector retrieval using cosine similarity over localized embeddings.',
      'Context-aware memory buffer enabling multi-turn autonomous problem solving.',
      'Interactive holographic graph UI showing real-time synaptic node activations.'
    ],
    techStack: ['Python', 'PyTorch', 'FastAPI', 'ChromaDB', 'Transformers', 'React', 'TypeScript'],
    stats: {
      'Embedding Space': '1536-dim',
      'Retrieval Accuracy': '96.4%',
      'Agent Response Time': '620ms',
      'Knowledge Nodes': '10,000+'
    },
    status: 'Active Innovation Pipeline'
  },
  'telemetry': {
    title: 'OrbitalSense: Zero-G Trajectory & Telemetry Engine',
    tag: 'SPACE TECH & INTERACTIVE PHYSICS',
    category: 'Computational Physics & Graphics',
    summary: 'A 60fps hardware-accelerated 2D/3D physics simulation simulating gravitational orbital mechanics, momentum conservation, and elastic collision dynamics in real-time.',
    features: [
      'Vector mechanics with Newton/Euler integration for zero-g and planetary gravities.',
      'Dynamic magnetic cursor tractor beam with procedural laser tethers.',
      'Seamless transition between floating chaos and orderly docked layout.',
      'Web Audio API synthesized real-time acoustic feedback.'
    ],
    techStack: ['Vanilla JavaScript ES6+', 'HTML5 Canvas', 'Vanilla CSS3', 'Web Audio API'],
    stats: {
      'Framerate': '60 FPS Lock',
      'Physics Restitution': '0.82',
      'Tether Radius': '140px',
      'Zero Dependencies': '100% Native'
    },
    status: 'Live on Current Portfolio'
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initDynamicTyping();
  init3DTypography();
  initEducationInteractions();
  initPhysicsElements();
  initSkillsInteractions();
  initProjectsInteractions();
  initModalListeners();
  initHudControls();
  initAudioToggle();
  initCopyButtons();
});

/* --------------------------------------------------------------------------
   1. CUSTOM CURSOR & TRACTOR BEAM
   -------------------------------------------------------------------------- */
function initCustomCursor() {
  const dot = document.querySelector('.custom-cursor-dot');
  const ring = document.querySelector('.custom-cursor-ring');
  if (!dot || !ring) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  // Smooth ring follow
  function renderCursor() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Hover expansion on interactive elements
  const hoverTargets = 'a, button, .skill-asteroid, .project-card, .btn-cyber, .cmd-chip, .hud-mode-btn, .edu-card, .edu-pill, .edu-university-link';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.classList.add('active-gravity');
      if (window.soundFX) window.soundFX.playHover();
    });
    el.addEventListener('mouseleave', () => {
      ring.classList.remove('active-gravity');
    });
  });
}

/* --------------------------------------------------------------------------
   2. DYNAMIC TYPING EFFECT
   -------------------------------------------------------------------------- */
function initDynamicTyping() {
  const target = document.getElementById('typing-target');
  if (!target) return;

  const phrases = [
    'B.Tech CSE Student | Developer | Tech Enthusiast',
    'Architecting Distributed Systems & Cloud Infrastructure',
    'Deep Learning & Autonomous AI Agent Builder',
    'Pioneering Zero-Gravity Interactive Web Experiences'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 70;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      target.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 35;
    } else {
      target.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 70;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 2200; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400; // Pause before new word
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* --------------------------------------------------------------------------
   3. 3D TYPOGRAPHY MOUSE TILT
   -------------------------------------------------------------------------- */
function init3DTypography() {
  const heroWrapper = document.querySelector('.hero-name-wrapper');
  const heroName = document.querySelector('.hero-name');
  if (!heroWrapper || !heroName) return;

  heroWrapper.addEventListener('mousemove', (e) => {
    const rect = heroWrapper.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = -(y / (rect.height / 2)) * 14;
    const rotY = (x / (rect.width / 2)) * 14;

    heroName.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(20px)`;
  });

  heroWrapper.addEventListener('mouseleave', () => {
    heroName.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px)';
  });
}

/* --------------------------------------------------------------------------
   4. PHYSICS ENGINE REGISTRATION
   -------------------------------------------------------------------------- */
function initPhysicsElements() {
  if (!window.physicsEngine) return;

  // 1. Hero Floating Astronaut
  const astronaut = document.getElementById('hero-astronaut-entity');
  const astronautContainer = document.getElementById('hero-visual-stage');
  if (astronaut && astronautContainer) {
    window.physicsEngine.registerBody(astronaut, {
      container: astronautContainer,
      isCircle: true,
      radius: 140,
      initialX: (astronautContainer.clientWidth - 280) / 2,
      initialY: (astronautContainer.clientHeight - 280) / 2,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      damping: 0.998,
      restitution: 0.85,
      mass: 3
    });
  }

  // 2. Skill Asteroid Orbs in Asteroid Belt Containment
  const containmentField = document.getElementById('asteroid-containment-field');
  const skillAsteroids = document.querySelectorAll('.skill-asteroid');

  if (containmentField && skillAsteroids.length > 0) {
    const cWidth = containmentField.clientWidth || 900;
    const cHeight = containmentField.clientHeight || 550;

    // Distribute nicely inside container
    const cols = 5;
    skillAsteroids.forEach((el, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const posX = 40 + col * ((cWidth - 180) / (cols - 1)) + (Math.random() - 0.5) * 40;
      const posY = 50 + row * ((cHeight - 140) / 3) + (Math.random() - 0.5) * 30;

      const body = window.physicsEngine.registerBody(el, {
        container: containmentField,
        isCircle: true,
        radius: 48,
        initialX: Math.max(10, Math.min(cWidth - 140, posX)),
        initialY: Math.max(10, Math.min(cHeight - 60, posY)),
        vx: (Math.random() - 0.5) * 1.8,
        vy: (Math.random() - 0.5) * 1.8,
        damping: 0.996,
        restitution: 0.88,
        mass: 1.2,
        category: el.dataset.category || 'generic'
      });

      // Save initial dock position
      body.dockX = body.x;
      body.dockY = body.y;
    });
  }

  // 3. Floating LinkedIn Beacon Card
  const linkedinBeacon = document.getElementById('linkedin-floating-beacon');
  const beaconContainer = document.getElementById('beacon-constellation-container');
  if (linkedinBeacon && beaconContainer) {
    window.physicsEngine.registerBody(linkedinBeacon, {
      container: beaconContainer,
      isCircle: false,
      initialX: 0,
      initialY: 0,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      damping: 0.995,
      restitution: 0.75,
      mass: 2
    });
  }
}

/* --------------------------------------------------------------------------
   5. SKILLS ASTEROID BELT INTERACTIONS
   -------------------------------------------------------------------------- */
function initSkillsInteractions() {
  const filterButtons = document.querySelectorAll('.skill-filter-btn');
  const skillAsteroids = document.querySelectorAll('.skill-asteroid');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.category;
      if (window.soundFX) window.soundFX.playClick();

      skillAsteroids.forEach(orb => {
        const orbCat = orb.dataset.category;
        if (cat === 'all' || orbCat === cat) {
          orb.classList.remove('dimmed');
          orb.classList.add('highlighted');
        } else {
          orb.classList.add('dimmed');
          orb.classList.remove('highlighted');
        }
      });
    });
  });

  // Clicking an asteroid opens Telemetry HUD Modal
  skillAsteroids.forEach(orb => {
    orb.addEventListener('click', (e) => {
      // If user was violently dragging, don't trigger modal
      const name = orb.dataset.skill;
      if (name && SKILLS_DATABASE[name]) {
        openSkillModal(name, SKILLS_DATABASE[name]);
      }
    });
  });
}

function openSkillModal(name, data) {
  const modal = document.getElementById('telemetry-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  if (!modal || !modalTitle || !modalBody) return;

  if (window.soundFX) window.soundFX.playClick();

  modalTitle.innerHTML = `<span style="font-size:1.6rem; margin-right:8px;">${data.icon}</span> ${name} // TELEMETRY`;

  modalBody.innerHTML = `
    <div style="margin-bottom: 20px;">
      <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-family:var(--font-code); font-size:0.8rem;">
        <span style="color:var(--text-secondary)">CATEGORY: <strong style="color:var(--neon-cyan)">${data.category.toUpperCase()}</strong></span>
        <span style="color:var(--neon-cyan)">PROFICIENCY: ${data.level}%</span>
      </div>
      <div style="width:100%; height:8px; background:rgba(255,255,255,0.1); border-radius:4px; overflow:hidden;">
        <div style="width:${data.level}%; height:100%; background:linear-gradient(90deg, var(--neon-cyan), var(--neon-purple)); box-shadow:0 0 10px var(--neon-cyan);"></div>
      </div>
    </div>

    <p style="color:var(--text-primary); font-size:0.95rem; line-height:1.6; margin-bottom:20px;">
      ${data.summary}
    </p>

    <div style="margin-bottom:20px;">
      <h4 style="font-size:0.82rem; color:var(--neon-cyan); letter-spacing:0.1em; margin-bottom:10px;">CORE CONCEPTS & PRACTICES</h4>
      <div style="display:flex; flex-wrap:wrap; gap:8px;">
        ${data.concepts.map(c => `<span style="font-family:var(--font-code); font-size:0.75rem; background:rgba(0,240,255,0.08); border:1px solid var(--glass-border-cyan); padding:4px 10px; border-radius:4px; color:#fff;">${c}</span>`).join('')}
      </div>
    </div>

    <div>
      <h4 style="font-size:0.82rem; color:var(--neon-purple); letter-spacing:0.1em; margin-bottom:10px;">INTEGRATED PROJECTS</h4>
      <ul style="list-style:none; display:flex; flex-direction:column; gap:6px; font-family:var(--font-code); font-size:0.82rem; color:var(--text-secondary);">
        ${data.projects.map(p => `<li>🛰️ <strong style="color:#ffffff">${p}</strong></li>`).join('')}
      </ul>
    </div>
  `;

  modal.classList.add('active');
}

/* --------------------------------------------------------------------------
   6. PROJECTS VIEW MODE TOGGLE & MODALS
   -------------------------------------------------------------------------- */
function initProjectsInteractions() {
  const dockedBtn = document.getElementById('view-docked-btn');
  const floatBtn = document.getElementById('view-float-btn');
  const projectsGrid = document.getElementById('projects-grid-container');
  const projectCards = document.querySelectorAll('.project-card');

  if (dockedBtn && floatBtn && projectsGrid) {
    dockedBtn.addEventListener('click', () => {
      dockedBtn.classList.add('active');
      floatBtn.classList.remove('active');

      if (window.soundFX) window.soundFX.playClick();

      // Return to regular CSS grid
      projectsGrid.classList.remove('floating-field-mode');
      projectCards.forEach(c => {
        c.classList.remove('floating-mode');
        c.style.transform = '';
      });

      if (window.physicsEngine) {
        // Unregister or set docked
        window.physicsEngine.bodies = window.physicsEngine.bodies.filter(b => !b.element.classList.contains('project-card'));
      }
    });

    floatBtn.addEventListener('click', () => {
      floatBtn.classList.add('active');
      dockedBtn.classList.remove('active');

      if (window.soundFX) window.soundFX.playThrow(2);

      projectsGrid.classList.add('floating-field-mode');
      const cRect = projectsGrid.getBoundingClientRect();

      projectCards.forEach((c, idx) => {
        c.classList.add('floating-mode');
        if (window.physicsEngine) {
          const body = window.physicsEngine.registerBody(c, {
            container: projectsGrid,
            isCircle: false,
            initialX: 30 + idx * 360,
            initialY: 40 + (idx % 2) * 60,
            vx: (Math.random() - 0.5) * 2.2,
            vy: (Math.random() - 0.5) * 2.2,
            damping: 0.995,
            restitution: 0.78,
            mass: 2.5
          });
          body.dockX = 30 + idx * 360;
          body.dockY = 40;
        }
      });
    });
  }

  // Project Details Modal Triggers
  document.querySelectorAll('.btn-project-details').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projId = btn.dataset.project;
      if (projId && PROJECTS_DATABASE[projId]) {
        openProjectModal(PROJECTS_DATABASE[projId]);
      }
    });
  });

  // Detach Card Button on Card Top Right
  document.querySelectorAll('.project-detach-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (floatBtn) floatBtn.click();
    });
  });
}

function openProjectModal(data) {
  const modal = document.getElementById('telemetry-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  if (!modal || !modalTitle || !modalBody) return;

  if (window.soundFX) window.soundFX.playClick();

  modalTitle.innerHTML = `🛰️ ${data.title}`;

  modalBody.innerHTML = `
    <div style="margin-bottom: 16px;">
      <span style="font-family:var(--font-code); font-size:0.75rem; background:rgba(0,240,255,0.1); border:1px solid var(--glass-border-cyan); color:var(--neon-cyan); padding:4px 10px; border-radius:var(--radius-full);">${data.tag}</span>
      <span style="font-family:var(--font-code); font-size:0.75rem; color:var(--text-muted); margin-left:10px;">${data.category}</span>
    </div>

    <p style="color:var(--text-primary); font-size:0.95rem; line-height:1.6; margin-bottom:20px;">
      ${data.summary}
    </p>

    <!-- Telemetry Stats Grid -->
    <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:12px; margin-bottom:20px;">
      ${Object.entries(data.stats).map(([k, v]) => `
        <div style="background:rgba(255,255,255,0.04); border:1px solid var(--glass-border); padding:10px 14px; border-radius:8px;">
          <div style="font-family:var(--font-code); font-size:0.68rem; color:var(--text-secondary); text-transform:uppercase;">${k}</div>
          <div style="font-family:var(--font-display); font-size:1.15rem; font-weight:800; color:var(--neon-cyan);">${v}</div>
        </div>
      `).join('')}
    </div>

    <div style="margin-bottom:20px;">
      <h4 style="font-size:0.82rem; color:var(--neon-purple); letter-spacing:0.1em; margin-bottom:10px;">KEY ARCHITECTURAL FEATURES</h4>
      <ul style="list-style:none; display:flex; flex-direction:column; gap:8px; font-size:0.88rem; color:var(--text-secondary);">
        ${data.features.map(f => `<li style="display:flex; align-items:flex-start; gap:8px;"><span style="color:var(--neon-cyan)">▸</span> ${f}</li>`).join('')}
      </ul>
    </div>

    <div>
      <h4 style="font-size:0.82rem; color:var(--neon-cyan); letter-spacing:0.1em; margin-bottom:10px;">DEPLOYED TECH STACK</h4>
      <div style="display:flex; flex-wrap:wrap; gap:8px;">
        ${data.techStack.map(t => `<span style="font-family:var(--font-code); font-size:0.75rem; background:rgba(255,255,255,0.06); border:1px solid var(--glass-border); padding:4px 10px; border-radius:4px; color:#ffffff;">${t}</span>`).join('')}
      </div>
    </div>
  `;

  modal.classList.add('active');
}

/* --------------------------------------------------------------------------
   7. MODAL LISTENERS (CLOSE & ESCAPE)
   -------------------------------------------------------------------------- */
function initModalListeners() {
  const modal = document.getElementById('telemetry-modal');
  const closeBtn = document.getElementById('modal-close-btn');

  if (modal && closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      if (window.soundFX) window.soundFX.playClick();
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        if (window.soundFX) window.soundFX.playClick();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
        if (window.soundFX) window.soundFX.playClick();
      }
    });
  }
}

/* --------------------------------------------------------------------------
   8. GRAV-DECK HUD CONTROLS
   -------------------------------------------------------------------------- */
function initHudControls() {
  document.querySelectorAll('.hud-mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      if (mode && window.physicsEngine) {
        window.physicsEngine.setGravityMode(mode);
      }
    });
  });

  // Warp Drive Button
  const warpBtn = document.getElementById('hud-warp-btn');
  if (warpBtn) {
    warpBtn.addEventListener('click', () => {
      if (window.starfield) window.starfield.triggerWarp();
    });
  }

  // Hero launch zero-g trigger button
  const heroLaunchBtn = document.getElementById('hero-launch-zerog');
  if (heroLaunchBtn) {
    heroLaunchBtn.addEventListener('click', () => {
      if (window.physicsEngine) {
        window.physicsEngine.setGravityMode('zero-g');
      }
      // Scroll smoothly to asteroid belt
      const skillsSection = document.getElementById('skills');
      if (skillsSection) {
        skillsSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

/* --------------------------------------------------------------------------
   9. AUDIO TOGGLE
   -------------------------------------------------------------------------- */
function initAudioToggle() {
  const toggleBtn = document.getElementById('audio-toggle-btn');
  if (toggleBtn && window.soundFX) {
    toggleBtn.addEventListener('click', () => {
      const enabled = window.soundFX.toggleSound();
      toggleBtn.innerHTML = enabled ? '🔊' : '🔇';
      toggleBtn.setAttribute('title', enabled ? 'Sound FX: Enabled' : 'Sound FX: Muted');
      if (window.orbitalTerminal) {
        window.orbitalTerminal.printLine(`AUDIO SYNTHESIZER: ${enabled ? 'ONLINE (ENABLED)' : 'MUTED'}`, enabled ? 'success' : 'warning');
      }
    });
  }
}

/* --------------------------------------------------------------------------
   10. CONTACT FREQUENCIES COPY TO CLIPBOARD
   -------------------------------------------------------------------------- */
function initCopyButtons() {
  document.querySelectorAll('.channel-copy-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const val = btn.getAttribute('data-copy');
      if (!val) return;

      const notifyCopied = () => {
        const originalText = btn.innerHTML;
        btn.innerHTML = '✓ Copied';
        btn.classList.add('copied');
        if (window.soundFX && window.soundFX.playClick) {
          window.soundFX.playClick();
        }
        if (window.orbitalTerminal) {
          window.orbitalTerminal.printLine(`TELEMETRY COPIED: "${val}" copied to clipboard buffer.`, 'success');
        }
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.classList.remove('copied');
        }, 2200);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(val);
          notifyCopied();
          return;
        } catch (err) {
          console.warn('Clipboard API failed, using fallback', err);
        }
      }

      // Fallback
      const ta = document.createElement('textarea');
      ta.value = val;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      notifyCopied();
    });
  });
}

/* --------------------------------------------------------------------------
   11. EDUCATION CARDS 3D TILT & SOUND INTERACTION
   -------------------------------------------------------------------------- */
function initEducationInteractions() {
  const cards = document.querySelectorAll('.edu-card');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotX = -(y / (rect.height / 2)) * 6;
      const rotY = (x / (rect.width / 2)) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-14px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // Sound triggers on university link click
  const univLinks = document.querySelectorAll('.edu-university-link, .edu-visit-link, .edu-spec-link');
  univLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.soundFX && window.soundFX.playClick) {
        window.soundFX.playClick();
      }
    });
  });
}


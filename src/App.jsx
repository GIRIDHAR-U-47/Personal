import React, { useState, useEffect, useRef } from 'react';
import { 
  profileData, 
  codingData, 
  photographyData, 
  natureData, 
  musicData, 
  foodData, 
  entrepreneurData 
} from './mockData';

export default function App() {
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const [booting, setBooting] = useState(true);
  const [bootProgress, setBootProgress] = useState(0);
  const [bootLogs, setBootLogs] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const [currentTime, setCurrentTime] = useState("");
  
  // Terminal IDE Simulator State
  const [activeIDETab, setActiveIDETab] = useState(" सॉल्यूशन.cpp");
  const [cliInput, setCliInput] = useState("");
  const [cliLogs, setCliLogs] = useState([
    { text: "System initialization completed.", type: "system" },
    { text: "Type help to list available security commands.", type: "system" }
  ]);

  // Photography State
  const [cameraShutter, setCameraShutter] = useState(100);
  const [cameraAperture, setCameraAperture] = useState(0);
  const [cameraIso, setCameraIso] = useState(20);
  const [activePhoto, setActivePhoto] = useState(photographyData.gallery[0]);

  // Nature State
  const [breathingText, setBreathingText] = useState("INHALATION (4s)");
  const [breathingScale, setBreathingScale] = useState(1.0);
  const [natureMuted, setNatureMuted] = useState({ rain: false, river: false, wind: false, birds: false });
  const [natureVolume, setNatureVolume] = useState({ rain: 65, river: 40, wind: 50, birds: 25 });

  // Music State
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [musicProgress, setMusicProgress] = useState(0);
  const [activeLyricIndex, setActiveLyricIndex] = useState(0);

  // Food Branding Mixer State
  const [selectedMixPills, setSelectedMixPills] = useState([]);
  const [synthesizedConcept, setSynthesizedConcept] = useState("");

  // Entrepreneur State
  const [hoveredChartPoint, setHoveredChartPoint] = useState(null);
  const [chartTooltipPos, setChartTooltipPos] = useState({ x: 0, y: 0 });
  const [selectedMindNode, setSelectedMindNode] = useState(null);

  // Refs for HTML5 Canvases
  const natureCanvasRef = useRef(null);
  const musicCanvasRef = useRef(null);
  const growthCanvasRef = useRef(null);
  const lyricsScrollerRef = useRef(null);

  // ==========================================
  // EFFECT 1: SYSTEM BOOT LOADER & TIMER IST
  // ==========================================
  useEffect(() => {
    // 1. Live Clock IST (UTC+5:30)
    const updateTime = () => {
      const now = new Date();
      const istTime = new Date(now.getTime() + (now.getTimezoneOffset() + 330) * 60000);
      let hours = istTime.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const minutes = String(istTime.getMinutes()).padStart(2, '0');
      const seconds = String(istTime.getSeconds()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds} ${ampm} // UTC+5:30`);
    };
    updateTime();
    const timeInterval = setInterval(updateTime, 1000);

    // 2. Boot Logs simulation
    const logs = [
      "SYSTEM INITIATED // DEPLOYING GIRIDHAR_U_PORTFOLIO_OS",
      "ESTABLISHING 3D MODULAR GRID COORDINATES...",
      "LOADING ASSET: PHOTOGRAPHY_NATURE.PNG (SUNRISE FILM)... OK",
      "LOADING ASSET: FOOD_LUXURY.PNG (CULINARY METADATA)... OK",
      "MOUNTING ALGORITHMIC TERMINAL & INTERACTIVE CLI SYSTEMS...",
      "SYNCHRONIZING AUDIO CHANNELS & VINYL EMULATORS...",
      "PREPARING ENVIRONMENT SECTIONS (SAGE / SENSORY)... OK",
      "GIRIDHAR PORTFOLIO OS IS ACTIVE."
    ];

    let currentLog = 0;
    const logInterval = setInterval(() => {
      if (currentLog < logs.length) {
        setBootLogs(prev => [...prev, logs[currentLog]]);
        currentLog++;
      }
    }, 280);

    // 3. Boot Progress bar
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.floor(Math.random() * 8) + 4;
      if (progress >= 100) {
        progress = 100;
        clearInterval(progressInterval);
        clearInterval(logInterval);
        setTimeout(() => {
          setBooting(false);
        }, 500);
      }
      setBootProgress(progress);
    }, 120);

    return () => {
      clearInterval(timeInterval);
      clearInterval(logInterval);
      clearInterval(progressInterval);
    };
  }, []);

  // ==========================================
  // EFFECT 2: BREATHING CYCLE CONTROLLER
  // ==========================================
  useEffect(() => {
    if (booting) return;
    const breathStates = [
      { text: "INHALATION (4s)", scale: 2.2, duration: 4000 },
      { text: "HOLD BREATH (4s)", scale: 2.2, duration: 4000 },
      { text: "EXHALATION (4s)", scale: 1.0, duration: 4000 },
      { text: "HOLD BREATH (4s)", scale: 1.0, duration: 4000 }
    ];
    let stateIdx = 0;

    const runCycle = () => {
      const current = breathStates[stateIdx];
      setBreathingText(current.text);
      setBreathingScale(current.scale);
      
      const timer = setTimeout(() => {
        stateIdx = (stateIdx + 1) % breathStates.length;
        runCycle();
      }, current.duration);
      
      return timer;
    };

    const activeTimer = runCycle();
    return () => clearTimeout(activeTimer);
  }, [booting]);

  // ==========================================
  // EFFECT 3: MUSIC SLEEVE / TIMELINE MANAGER
  // ==========================================
  useEffect(() => {
    if (!isMusicPlaying) return;

    const musicInterval = setInterval(() => {
      setMusicProgress(prev => {
        const next = prev + 0.5;
        if (next >= 100) {
          setIsMusicPlaying(false);
          clearInterval(musicInterval);
          return 0;
        }
        
        // Update Lyrics Index based on percentages
        let activeIdx = 0;
        if (next > 75) activeIdx = 4;
        else if (next > 50) activeIdx = 3;
        else if (next > 25) activeIdx = 2;
        else if (next > 8) activeIdx = 1;
        
        setActiveLyricIndex(activeIdx);
        
        // Auto scroll lyrics container
        if (lyricsScrollerRef.current) {
          const lines = lyricsScrollerRef.current.children;
          if (lines[activeIdx]) {
            lyricsScrollerRef.current.scrollTop = lines[activeIdx].offsetTop - 45;
          }
        }

        return next;
      });
    }, 100);

    return () => clearInterval(musicInterval);
  }, [isMusicPlaying]);

  // ==========================================
  // EFFECT 4: CANVAS RENDERERS (LEAF & WAVE & GROWTH)
  // ==========================================
  // A. Nature Leaf Canvas
  useEffect(() => {
    if (activeModal !== 'modal-nature' || !natureCanvasRef.current) return;
    const canvas = natureCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const parent = canvas.parentElement;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;

    const colors = ['#8ba888', '#5b8565', '#dfb15b', '#e07a5f'];
    let leaves = Array.from({ length: 35 }, () => createLeaf(canvas));

    function createLeaf(cv, fromTop = false) {
      return {
        x: Math.random() * cv.width,
        y: fromTop ? -20 : Math.random() * cv.height,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedY: Math.random() * 0.8 + 0.4,
        speedX: Math.random() * 1 - 0.5,
        oscillation: Math.random() * 0.05,
        angle: Math.random() * 360,
        rotationSpeed: Math.random() * 2 - 1
      };
    }

    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      leaves.forEach((l, idx) => {
        l.y += l.speedY;
        l.x += l.speedX + Math.sin(l.y * l.oscillation) * 0.3;
        l.angle += l.rotationSpeed;

        ctx.save();
        ctx.translate(l.x, l.y);
        ctx.rotate((l.angle * Math.PI) / 180);
        ctx.fillStyle = l.color;
        ctx.globalAlpha = 0.65;

        ctx.beginPath();
        ctx.moveTo(0, -l.size);
        ctx.quadraticCurveTo(l.size / 2, 0, 0, l.size);
        ctx.quadraticCurveTo(-l.size / 2, 0, 0, -l.size);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        if (l.y > canvas.height + 20) {
          leaves[idx] = createLeaf(canvas, true);
        }
      });
      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, [activeModal]);

  // B. Music Waveform Canvas
  useEffect(() => {
    if (activeModal !== 'modal-music' || !musicCanvasRef.current) return;
    const canvas = musicCanvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 60;

    let animationId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const count = 30;
      const spacing = canvas.width / count;
      ctx.fillStyle = '#ec4899';
      ctx.globalAlpha = 0.75;

      for (let i = 0; i < count; i++) {
        let height = 0;
        if (isMusicPlaying) {
          height = Math.abs(Math.sin((Date.now() / 150) + i)) * 35 + 4;
        } else {
          height = Math.abs(Math.sin((Date.now() / 800) + i)) * 8 + 2;
        }
        const x = i * spacing + (spacing / 4);
        const y = (canvas.height - height) / 2;

        ctx.beginPath();
        ctx.roundRect(x, y, spacing / 2, height, 4);
        ctx.fill();
      }
      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationId);
  }, [activeModal, isMusicPlaying]);

  // C. Growth Blueprint Valuations Canvas
  useEffect(() => {
    if (activeModal !== 'modal-mindset' || !growthCanvasRef.current) return;
    const canvas = growthCanvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = 220;

    const w = canvas.width;
    const h = canvas.height;

    // Draw blueprint lines
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;

    const xStep = w / 8;
    for (let x = 0; x < w; x += xStep) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    const yStep = h / 5;
    for (let y = 0; y < h; y += yStep) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Scale coordinates
    const points = entrepreneurData.chartPoints.map(p => ({
      x: (p.pctX / 100) * w,
      y: (p.pctY / 100) * h,
      label: p.label,
      value: p.value
    }));

    // Draw volumetric gradient fill
    const fillGrad = ctx.createLinearGradient(0, 0, 0, h);
    fillGrad.addColorStop(0, 'rgba(223, 177, 91, 0.22)');
    fillGrad.addColorStop(1, 'rgba(223, 177, 91, 0)');

    ctx.beginPath();
    ctx.moveTo(points[0].x, h);
    ctx.lineTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const xc = (points[i-1].x + points[i].x) / 2;
      const yc = (points[i-1].y + points[i].y) / 2;
      ctx.quadraticCurveTo(points[i-1].x, points[i-1].y, xc, yc);
    }
    ctx.lineTo(points[points.length-1].x, points[points.length-1].y);
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fillStyle = fillGrad;
    ctx.fill();

    // Draw trend stroke
    ctx.strokeStyle = '#dfb15b';
    ctx.lineWidth = 3;
    ctx.shadowColor = 'rgba(223, 177, 91, 0.4)';
    ctx.shadowBlur = 10;

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();

    // Reset shadow & draw node points
    ctx.shadowBlur = 0;
    points.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#08080c';
      ctx.strokeStyle = '#dfb15b';
      ctx.lineWidth = 2;
      ctx.fill();
      ctx.stroke();
    });

  }, [activeModal]);

  // Handle valuations canvas hover state
  const handleValuationsMouseMove = (e) => {
    if (!growthCanvasRef.current) return;
    const canvas = growthCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const w = canvas.width;
    const h = canvas.height;

    const points = entrepreneurData.chartPoints.map(p => ({
      x: (p.pctX / 100) * w,
      y: (p.pctY / 100) * h,
      label: p.label,
      value: p.value
    }));

    let activePoint = null;
    points.forEach(p => {
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 18) {
        activePoint = p;
      }
    });

    if (activePoint) {
      setHoveredChartPoint(activePoint);
      setChartTooltipPos({ x: activePoint.x, y: activePoint.y });
    } else {
      setHoveredChartPoint(null);
    }
  };

  // ==========================================
  // INTERACTIVE TRIGGERS
  // ==========================================
  // Card neomorphic tilt engine
  const handleCardMouseMove = (e, cardType) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPct = (x / rect.width) * 100;
    const yPct = (y / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${xPct}%`);
    card.style.setProperty('--mouse-y', `${yPct}%`);

    const xRot = ((x / rect.width) - 0.5) * 12;
    const yRot = -((y / rect.height) - 0.5) * 12;
    card.style.transform = `perspective(1000px) rotateY(${xRot}deg) rotateX(${yRot}deg) scale3d(1.015, 1.015, 1.015)`;

    // Parallax sub-offsets
    const pStrength = -15;
    const xShift = ((x / rect.width) - 0.5) * pStrength;
    const yShift = ((y / rect.height) - 0.5) * pStrength;

    const laptop = card.querySelector('.floating-laptop');
    const term = card.querySelector('.terminal-mock');
    const pols = card.querySelector('.polaroid-stack');
    const river = card.querySelector('.animated-river-svg');
    const vinyl = card.querySelector('.vinyl-mock');
    const dashboard = card.querySelector('.startup-dashboard-mini');

    if (laptop) laptop.style.transform = `translate3d(${xShift}px, ${yShift}px, 20px)`;
    if (term) term.style.transform = `translate3d(${xShift}px, ${yShift}px, 20px)`;
    if (pols) pols.style.transform = `translate3d(${xShift}px, ${yShift}px, 20px)`;
    if (river) river.style.transform = `translate3d(${xShift / 2}px, 0, 10px)`;
    if (vinyl) vinyl.style.transform = `translate3d(${xShift}px, ${yShift}px, 20px)`;
    if (dashboard) dashboard.style.transform = `translate3d(${xShift}px, ${yShift}px, 20px)`;
  };

  const handleCardMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)';

    const laptop = card.querySelector('.floating-laptop');
    const term = card.querySelector('.terminal-mock');
    const pols = card.querySelector('.polaroid-stack');
    const river = card.querySelector('.animated-river-svg');
    const vinyl = card.querySelector('.vinyl-mock');
    const dashboard = card.querySelector('.startup-dashboard-mini');

    if (laptop) laptop.style.transform = 'translate3d(0, 0, 20px)';
    if (term) term.style.transform = 'translate3d(0, 0, 20px)';
    if (pols) pols.style.transform = 'translate3d(0, 0, 20px)';
    if (river) river.style.transform = 'translate3d(0, 0, 10px)';
    if (vinyl) vinyl.style.transform = 'translate3d(0, 0, 20px)';
    if (dashboard) dashboard.style.transform = 'translate3d(0, 0, 20px)';
  };

  // CLI Command processor
  const handleCLISubmit = (e) => {
    if (e.key === 'Enter') {
      const cmd = cliInput.trim().toLowerCase();
      setCliInput("");

      const logsCopy = [...cliLogs, { text: `giridhar@system:~$ ${cmd}`, type: 'prompt' }];
      let outputText = "";

      switch (cmd) {
        case 'help':
          outputText = codingData.terminalOutputs.help;
          break;
        case 'skills':
          outputText = codingData.terminalOutputs.skills;
          break;
        case 'streak':
          outputText = codingData.terminalOutputs.streak;
          break;
        case 'github':
          outputText = codingData.terminalOutputs.github;
          break;
        case 'about':
          outputText = codingData.terminalOutputs.about;
          break;
        case 'matrix':
          outputText = codingData.terminalOutputs.matrix;
          break;
        case 'clear':
          setCliLogs([]);
          return;
        case '':
          setCliLogs(logsCopy);
          return;
        default:
          outputText = `<span class="cmd-err">Command unrecognized: '${cmd}'. Type 'help' to review guidelines.</span>`;
      }

      setCliLogs([...logsCopy, { text: outputText, type: 'output' }]);

      // Scroll to bottom of terminal
      setTimeout(() => {
        const cliPane = document.getElementById('ide-tab-term');
        if (cliPane) cliPane.scrollTop = cliPane.scrollHeight;
      }, 50);
    }
  };

  // Food Branding Mixer
  const toggleMixPill = (id) => {
    if (selectedMixPills.includes(id)) {
      setSelectedMixPills(prev => prev.filter(p => p !== id));
    } else {
      setSelectedMixPills(prev => [...prev, id]);
    }
  };

  const handleMixSynthesize = () => {
    if (selectedMixPills.length === 0) {
      alert("Please select at least one concept parameter node to fuse.");
      return;
    }
    setSynthesizedConcept("Processing matrices... Synthesizing target model...");
    setTimeout(() => {
      let outcome = "";
      if (selectedMixPills.includes('d-tech') && selectedMixPills.includes('d-plate')) {
        outcome = "GASTROBYTE PLATFORM: A private membership culinary club which utilizes neomorphic layout profiles to live-tailor gourmet plating styles based on local organic supply parameters.";
      } else if (selectedMixPills.includes('d-tech') && selectedMixPills.includes('d-cloud')) {
        outcome = "AUTO-KITCHEN BOT SYSTEMS: High-volume culinary micro-facilities operated via automated Docker nodes. Reduces prep-overhead cost indexes by 48.2% through smart routing loops.";
      } else if (selectedMixPills.includes('d-farm') && selectedMixPills.includes('d-plate')) {
        outcome = "THE SACRED TABLE: An eco-luxury culinary experience matching mountain ingredient cycles directly to artistic table dynamics. Showcases organic simplicity.";
      } else if (selectedMixPills.includes('d-cloud') && selectedMixPills.includes('d-farm')) {
        outcome = "FARM-STREAM: B2B automated marketplace establishing encrypted supply agreements directly between mountain food hubs and cloud hubs.";
      } else {
        outcome = "CULINIQUE LABS: A modern tech-forward bakery/kitchen merging bespoke brand identities with high-efficiency culinary delivery systems. Fusing food culture with digital utility.";
      }
      setSynthesizedConcept(outcome);
    }, 800);
  };

  // ==========================================
  // RENDERING COMPONENTS
  // ==========================================
  return (
    <div>
      {/* 1. CINEMATIC BOOT LOADER SCREEN */}
      {booting && (
        <div id="boot-screen" className="boot-screen">
          <div className="boot-loader">
            <div className="boot-logo">
              <svg viewBox="0 0 100 100" className="pulsing-logo">
                <polygon points="50,15 90,38 90,82 50,60" fill="none" stroke="url(#logo-grad)" strokeWidth="2"/>
                <polygon points="50,15 10,38 10,82 50,60" fill="none" stroke="url(#logo-grad)" strokeWidth="2"/>
                <polygon points="50,60 90,82 50,95 10,82" fill="none" stroke="url(#logo-grad)" strokeWidth="2"/>
                <defs>
                  <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#dfb15b"/>
                    <stop offset="50%" stopColor="#e07a5f"/>
                    <stop offset="100%" stopColor="#6366f1"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="boot-console">
              {bootLogs.join("\n")}
            </div>
            <div className="boot-progress-bar">
              <div className="boot-progress" style={{ width: `${bootProgress}%` }}></div>
            </div>
          </div>
        </div>
      )}

      {/* 2. MASTER APPLICATION CONTAINER */}
      {!booting && (
        <main className="app-wrapper">
          {/* Top header navigation block */}
          <header className="app-header">
            <div className="header-logo">
              <span className="logo-text">GIRIDHAR<span className="gold-dot">.</span>U</span>
            </div>
            <div className="header-status">
              <div className="pulse-indicator"></div>
              <span>PORTFOLIO OS v2.6.0 // REACT STATE ACTIVE</span>
            </div>
            <div className="header-clock">
              {currentTime}
            </div>
          </header>

          {/* Ambient atmosphere flows */}
          <div className="ambient-glows">
            <div className="glow-orb orb-1"></div>
            <div className="glow-orb orb-2"></div>
            <div className="glow-orb orb-3"></div>
          </div>

          {/* 3. DYNAMIC MODULAR GRID (OTTO UI INSPIRED) */}
          <section className="portfolio-grid">
            
            {/* HERO CARD (2x1 Column layout block) */}
            <article 
              className="portfolio-card hero-card"
              onMouseMove={(e) => handleCardMouseMove(e, 'hero')}
              onMouseLeave={handleCardMouseLeave}
              onClick={() => setActiveModal('modal-hero')}
            >
              <div className="card-inner">
                <div className="card-glow"></div>
                <div className="card-visual">
                  <div className="floating-laptop-wrapper">
                    <svg viewBox="0 0 300 200" className="floating-laptop">
                      <rect x="50" y="30" width="200" height="120" rx="6" fill="#14141d" stroke="#ffffff1a" strokeWidth="2"/>
                      <rect x="53" y="33" width="194" height="114" rx="4" fill="url(#screen-glow)" />
                      <path d="M65,48 L120,48 M65,60 L235,60 M65,72 L180,72 M65,84 L140,84 M65,96 L210,96" stroke="#ffffff15" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M65,115 L85,115 M95,115 L125,115" stroke="#dfb15b" strokeWidth="3" strokeLinecap="round"/>
                      <circle cx="150" cy="90" r="25" fill="#6366f1" opacity="0.15" filter="blur(8px)"/>
                      <rect x="30" y="150" width="240" height="12" rx="4" fill="#2d2d3a"/>
                      <rect x="110" y="150" width="80" height="4" fill="#1a1a24"/>
                      <polygon points="20,162 280,162 265,172 35,172" fill="#21212b"/>
                      <rect x="120" y="162" width="60" height="3" rx="1.5" fill="#14141d"/>
                      <defs>
                        <linearGradient id="screen-glow" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#19192b"/>
                          <stop offset="100%" stopColor="#0f0f15"/>
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <div className="mini-git-graph">
                    <span className="tech-metric">// GIT STREAM</span>
                    <div className="git-nodes">
                      <div className="git-node active"></div>
                      <div className="git-node"></div>
                      <div className="git-node blue"></div>
                      <div className="git-node"></div>
                      <div className="git-node active"></div>
                      <div className="git-node"></div>
                      <div className="git-node"></div>
                      <div className="git-node blue"></div>
                      <div className="git-node active"></div>
                      <div className="git-node"></div>
                      <div className="git-node"></div>
                      <div className="git-node blue"></div>
                    </div>
                  </div>
                </div>
                <div className="card-content">
                  <h1 className="card-title display-title">{profileData.name}</h1>
                  <p className="card-subtitle">{profileData.subtitle}</p>
                  <p className="card-description">{profileData.description}</p>
                  <span className="explore-btn">EXPLORE DOSSIER <i className="fa-solid fa-arrow-right-long"></i></span>
                </div>
              </div>
            </article>

            {/* CARD 1 — CODING LIFE */}
            <article 
              className="portfolio-card coding-card"
              onMouseMove={(e) => handleCardMouseMove(e, 'coding')}
              onMouseLeave={handleCardMouseLeave}
              onClick={() => setActiveModal('modal-coding')}
            >
              <div className="card-inner">
                <div className="card-glow"></div>
                <div className="card-visual">
                  <div className="terminal-mock">
                    <div className="term-header">
                      <span className="dot red"></span>
                      <span className="dot yellow"></span>
                      <span className="dot green"></span>
                      <span className="term-title">build_main.cpp</span>
                    </div>
                    <div className="term-body">
                      <p><span className="tok-kw">const</span> <span class="tok-type">auto</span> <span className="tok-fn">builder</span> = <span className="tok-cls">Giridhar</span>();</p>
                      <p><span className="tok-fn">builder</span>.<span className="tok-meth">deploy</span>({`{`}</p>
                      <p>&nbsp;&nbsp;<span className="tok-str">"consistency"</span>,</p>
                      <p>&nbsp;&nbsp;<span className="tok-str">"ambition"</span></p>
                      <p>{`});`}</p>
                    </div>
                  </div>
                  <div className="leetcode-mini-widget">
                    <div className="streak-ring">
                      <svg viewBox="0 0 36 36" className="circular-chart">
                        <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#222" strokeWidth="2"/>
                        <path className="circle" strokeDasharray="85, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#6366f1" strokeWidth="2"/>
                      </svg>
                      <div className="streak-text">
                        <span className="streak-num">{codingData.streak}</span>
                        <span className="streak-lbl">STREAK</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-content">
                  <h2 className="card-title">CODING LIFE</h2>
                  <p className="card-tagline">Late-night builder energy.</p>
                  <p className="card-description">Solving problems daily. Building consistency through code.</p>
                  <span className="explore-btn">COMPILE & RUN <i className="fa-solid fa-code"></i></span>
                </div>
              </div>
            </article>

            {/* CARD 2 — PHOTOGRAPHY */}
            <article 
              className="portfolio-card photography-card"
              onMouseMove={(e) => handleCardMouseMove(e, 'photography')}
              onMouseLeave={handleCardMouseLeave}
              onClick={() => setActiveModal('modal-photography')}
            >
              <div className="card-inner">
                <div className="card-glow"></div>
                <div className="card-visual">
                  <div className="polaroid-stack">
                    <div className="polaroid polaroid-3">
                      <img src="/photography_nature.png" alt="Nature slide 3" />
                    </div>
                    <div className="polaroid polaroid-2">
                      <img src="/food_luxury.png" alt="Food slide 2" />
                    </div>
                    <div className="polaroid polaroid-1">
                      <img src="/photography_nature.png" alt="Nature active slide 1" />
                      <div className="polaroid-caption">35mm Film // Mountain Mist</div>
                    </div>
                  </div>
                  <svg viewBox="0 0 100 100" className="floating-lens-svg">
                    <circle cx="50" cy="50" r="30" fill="none" stroke="#dfb15b" strokeWidth="1.5" opacity="0.3"/>
                    <circle cx="50" cy="50" r="20" fill="none" stroke="#dfb15b" strokeWidth="1" opacity="0.5"/>
                    <line x1="20" y1="50" x2="80" y2="50" stroke="#dfb15b" strokeWidth="0.5" opacity="0.2"/>
                    <line x1="50" y1="20" x2="50" y2="80" stroke="#dfb15b" strokeWidth="0.5" opacity="0.2"/>
                  </svg>
                </div>
                <div className="card-content">
                  <h2 className="card-title">PHOTOGRAPHY</h2>
                  <p className="card-tagline">Creative and cinematic.</p>
                  <p className="card-description">Capturing moments that feel alive.</p>
                  <span className="explore-btn">OPEN VIEWFINDER <i class="fa-solid fa-camera"></i></span>
                </div>
              </div>
            </article>

            {/* CARD 3 — NATURE */}
            <article 
              className="portfolio-card nature-card"
              onMouseMove={(e) => handleCardMouseMove(e, 'nature')}
              onMouseLeave={handleCardMouseLeave}
              onClick={() => setActiveModal('modal-nature')}
            >
              <div className="card-inner">
                <div className="card-glow"></div>
                <div className="card-visual">
                  <div className="nature-canvas-wrapper">
                    <svg viewBox="0 0 200 120" className="animated-river-svg">
                      <path id="river-wave-1" d="M0,80 Q50,60 100,80 T200,80 L200,120 L0,120 Z" fill="url(#river-gradient-1)" opacity="0.7"/>
                      <path id="river-wave-2" d="M0,90 Q50,75 100,90 T200,90 L200,120 L0,120 Z" fill="url(#river-gradient-2)" opacity="0.8"/>
                      <defs>
                        <linearGradient id="river-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#122c2a"/>
                          <stop offset="100%" stopColor="#0f1a24"/>
                        </linearGradient>
                        <linearGradient id="river-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#8ba888" stopOpacity="0.2"/>
                          <stop offset="100%" stopColor="#1b4d3e" stopOpacity="0.6"/>
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="mini-clouds">
                      <div className="mini-cloud c1"></div>
                      <div className="mini-cloud c2"></div>
                    </div>
                  </div>
                </div>
                <div className="card-content">
                  <h2 className="card-title">NATURE</h2>
                  <p className="card-tagline">Peaceful and immersive.</p>
                  <p className="card-description">Nature resets my mind.</p>
                  <span className="explore-btn">ENTER SANCTUARY <i className="fa-solid fa-mountain-sun"></i></span>
                </div>
              </div>
            </article>

            {/* CARD 4 — MUSIC */}
            <article 
              className="portfolio-card music-card"
              onMouseMove={(e) => handleCardMouseMove(e, 'music')}
              onMouseLeave={handleCardMouseLeave}
              onClick={() => setActiveModal('modal-music')}
            >
              <div className="card-inner">
                <div className="card-glow"></div>
                <div className="card-visual">
                  <div className="vinyl-mock">
                    <div className="vinyl-sleeve">
                      <svg viewBox="0 0 100 100" className="floating-mic-sleeve">
                        <path d="M50,20 C42,20 38,26 38,34 L38,50 C38,58 42,64 50,64 C58,64 62,58 62,50 L62,34 C62,26 58,20 50,20 Z" fill="none" stroke="#ec4899" strokeWidth="2" opacity="0.6"/>
                        <path d="M30,45 L30,50 C30,62 40,70 50,70 C60,70 70,62 70,50 L70,45" fill="none" stroke="#ec4899" strokeWidth="2" opacity="0.6"/>
                        <line x1="50" y1="70" x2="50" y2="85" stroke="#ec4899" strokeWidth="3" opacity="0.6"/>
                        <line x1="40" y1="85" x2="60" y2="85" stroke="#ec4899" strokeWidth="3" opacity="0.6"/>
                      </svg>
                    </div>
                    <div className="vinyl-record">
                      <div className="record-center"></div>
                    </div>
                  </div>
                  <div className="music-wave-bars">
                    <span className="bar b1"></span>
                    <span className="bar b2"></span>
                    <span className="bar b3"></span>
                    <span className="bar b4"></span>
                    <span className="bar b5"></span>
                    <span className="bar b6"></span>
                    <span className="bar b7"></span>
                  </div>
                </div>
                <div className="card-content">
                  <h2 className="card-title">MUSIC</h2>
                  <p className="card-tagline">Emotional and artistic.</p>
                  <p className="card-description">Singing is my escape.</p>
                  <span className="explore-btn">TUNE IN <i className="fa-solid fa-music"></i></span>
                </div>
              </div>
            </article>

            {/* CARD 5 — FOOD INDUSTRY */}
            <article 
              className="portfolio-card food-card"
              onMouseMove={(e) => handleCardMouseMove(e, 'food')}
              onMouseLeave={handleCardMouseLeave}
              onClick={() => setActiveModal('modal-food')}
            >
              <div className="card-inner">
                <div className="card-glow"></div>
                <div className="card-visual" style={{ backgroundImage: "url('/food_luxury.png')", backgroundSize: 'cover', backgroundPosition: 'center', filter: 'saturate(0.85) brightness(0.65)' }}>
                  <div className="food-brand-overlay">
                    <div className="brand-crest">
                      <svg viewBox="0 0 100 100" className="brand-logo-svg">
                        <path d="M50,15 L75,35 L75,70 L50,85 L25,70 L25,35 Z" fill="none" stroke="#dfb15b" strokeWidth="1.5"/>
                        <path d="M50,22 L68,37 L68,66 L50,78 L32,66 L32,37 Z" fill="none" stroke="#dfb15b" strokeWidth="0.75" opacity="0.5"/>
                        <circle cx="50" cy="50" r="10" fill="none" stroke="#dfb15b" strokeWidth="1"/>
                      </svg>
                    </div>
                    <span className="brand-name">{foodData.brandName}</span>
                    <span className="brand-tag">{foodData.brandTag}</span>
                  </div>
                </div>
                <div className="card-content">
                  <h2 className="card-title">FOOD INDUSTRY</h2>
                  <p className="card-tagline">Warm entrepreneurial energy.</p>
                  <p className="card-description">Passionate about experiences, people, and food culture.</p>
                  <span className="explore-btn">VIEW CONCEPT <i className="fa-solid fa-utensils"></i></span>
                </div>
              </div>
            </article>

            {/* CARD 6 — ENTREPRENEUR MINDSET */}
            <article 
              className="portfolio-card mindset-card"
              onMouseMove={(e) => handleCardMouseMove(e, 'mindset')}
              onMouseLeave={handleCardMouseLeave}
              onClick={() => setActiveModal('modal-mindset')}
            >
              <div className="card-inner">
                <div className="card-glow"></div>
                <div className="card-visual">
                  <div className="startup-dashboard-mini">
                    <div className="chart-header">
                      <span className="title">MRR / TRACTION</span>
                      <span className="growth-metric">+145.8%</span>
                    </div>
                    <svg viewBox="0 0 200 80" className="trend-chart-mini">
                      <path d="M 0 65 Q 25 60 50 48 T 100 50 T 150 25 T 200 12 L 200 80 L 0 80 Z" fill="url(#growth-chart-gradient)" />
                      <path d="M 0 65 Q 25 60 50 48 T 100 50 T 150 25 T 200 12" fill="none" stroke="#dfb15b" strokeWidth="2" />
                      <circle cx="200" cy="12" r="4" fill="#dfb15b" />
                      <circle cx="200" cy="12" r="8" fill="none" stroke="#dfb15b" strokeWidth="1" opacity="0.5" className="pulsing-chart-dot"/>
                      <defs>
                        <linearGradient id="growth-chart-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#dfb15b" stopOpacity="0.3"/>
                          <stop offset="100%" stopColor="#dfb15b" stopOpacity="0"/>
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
                <div className="card-content">
                  <h2 className="card-title">ENTREPRENEUR MINDSET</h2>
                  <p className="card-tagline">Futuristic ambition.</p>
                  <p className="card-description">Obsessed with growth, impact, and building wealth through creativity.</p>
                  <span className="explore-btn">ACCESS PIPELINE <i className="fa-solid fa-arrow-trend-up"></i></span>
                </div>
              </div>
            </article>

          </section>

          {/* ==========================================
              4. IMMERSIVE COMPONENT OVERLAY (MODALS)
              ========================================== */}
          <div className={`immersive-modal-container ${activeModal ? 'active' : ''}`}>
            
            {activeModal && (
              <button 
                className="close-modal-btn" 
                onClick={() => {
                  setActiveModal(null);
                  setIsMusicPlaying(false);
                }}
              >
                <span className="btn-cross"></span>
                <span>CLOSE DOSSIER</span>
              </button>
            )}

            {/* A. HERO CARD EXPANDED */}
            {activeModal === 'modal-hero' && (
              <section className="modal-section">
                <div className="modal-grid-layout hero-expanded">
                  <div className="modal-left-col glass-panel">
                    <h2 className="modal-section-title">{profileData.name}</h2>
                    <p className="modal-section-subtitle">// FOUNDER • DEVELOPER • ARTIST</p>
                    <div className="bio-paragraph">
                      {profileData.bio.map((p, i) => <p key={i}>{p}</p>)}
                    </div>
                    
                    <div className="core-metrics-list">
                      <div className="metric-item">
                        <span className="lbl">FOCUS</span>
                        <span className="val">{profileData.focus}</span>
                      </div>
                      <div className="metric-item">
                        <span className="lbl">ENTREPRENEURIAL PILLARS</span>
                        <span className="val">{profileData.entrepreneurialPillars}</span>
                      </div>
                      <div className="metric-item">
                        <span className="lbl">DISCIPLINE</span>
                        <span className="val">{profileData.discipline}</span>
                      </div>
                    </div>
                    
                    <div className="quick-status-board">
                      <span className="board-header">PORTFOLIO OS // HOST CONNECTION</span>
                      <div className="ping-block">
                        <span><i className="fa-solid fa-network-wired"></i> Live Status:</span>
                        <span className="ping-value positive">{profileData.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="modal-right-col glass-panel scrollable-y">
                    <h3>JOURNEY TIMELINE</h3>
                    <div className="timeline-tree">
                      {profileData.timeline.map((node, i) => (
                        <div className="timeline-node" key={i}>
                          <div className="node-year">{node.year}</div>
                          <div className="node-content">
                            <h4>{node.title}</h4>
                            <p>{node.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="connect-form-wrapper">
                      <h3>SECURE TRANSMISSION</h3>
                      <form className="cinematic-form" onSubmit={(e) => { e.preventDefault(); alert('Transmission secured. Giridhar will contact you shortly.'); }}>
                        <div className="form-row">
                          <div className="form-group">
                            <label>IDENTIFIER</label>
                            <input type="text" placeholder="Your Name" required />
                          </div>
                          <div className="form-group">
                            <label>COMM CHANNEL</label>
                            <input type="email" placeholder="email@address.com" required />
                          </div>
                        </div>
                        <div className="form-group">
                          <label>ENCRYPTED MESSAGE</label>
                          <textarea rows="4" placeholder="Describe the venture..." required></textarea>
                        </div>
                        <button type="submit" className="submit-form-btn">TRANSMIT PACKET <i className="fa-solid fa-paper-plane"></i></button>
                      </form>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* B. CODING LIFE EXPANDED */}
            {activeModal === 'modal-coding' && (
              <section className="modal-section">
                <div className="modal-grid-layout coding-expanded">
                  <div className="modal-left-col glass-panel flex-column">
                    <h2 className="modal-section-title">ENGINEERING HUB</h2>
                    <p className="modal-section-subtitle">// PROBLEM SOLVING & CODE STREAKS</p>
                    
                    <div className="detailed-leetcode-stats">
                      <div className="stats-header">
                        <i className="fa-solid fa-code-fork icon-indigo"></i>
                        <span>ALGORITHMIC EFFICIENCY</span>
                      </div>
                      <div className="stats-grid">
                        {codingData.categories.map((c, i) => (
                          <div className="stat-card" key={i}>
                            <span className="val">{c.value}</span>
                            <span className="lbl">{c.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="github-heatmap-container">
                      <div className="heatmap-header">
                        <span>GIT COMMIT DENSITY (365 DAYS)</span>
                        <span className="count">2,481 Contributions</span>
                      </div>
                      <div className="heatmap-grid">
                        {Array.from({ length: 28 * 7 }).map((_, idx) => {
                          const levels = [0, 1, 2, 3, 4];
                          const level = levels[Math.floor(Math.sin(idx * 0.15) * 2.5 + 2)] || 0;
                          return <div key={idx} className={`heatmap-cell level-${level}`}></div>;
                        })}
                      </div>
                      <div className="heatmap-legend">
                        <span>Less</span>
                        <div className="legend-cells">
                          <div className="cell level-0"></div>
                          <div className="cell level-1"></div>
                          <div className="cell level-2"></div>
                          <div className="cell level-3"></div>
                          <div className="cell level-4"></div>
                        </div>
                        <span>More</span>
                      </div>
                    </div>
                  </div>

                  <div className="modal-right-col glass-panel ide-layout">
                    <div className="ide-tabs-bar">
                      <button className={`ide-tab ${activeIDETab === 'Solution.cpp' ? 'active' : ''}`} onClick={() => setActiveIDETab('Solution.cpp')}>
                        <i className="fa-solid fa-file-code text-cyan"></i> Solution.cpp
                      </button>
                      <button className={`ide-tab ${activeIDETab === 'App.js' ? 'active' : ''}`} onClick={() => setActiveIDETab('App.js')}>
                        <i className="fa-brands fa-js text-gold"></i> App.js
                      </button>
                      <button className={`ide-tab ${activeIDETab === 'terminal' ? 'active' : ''}`} onClick={() => setActiveIDETab('terminal')}>
                        <i className="fa-solid fa-terminal text-indigo"></i> giridhar@system:~
                      </button>
                    </div>

                    <div className="ide-content-area">
                      {activeIDETab === 'Solution.cpp' && (
                        <div className="ide-pane active">
                          <pre className="code-editor"><code>{codingData.codeSnippets.cpp}</code></pre>
                        </div>
                      )}
                      
                      {activeIDETab === 'App.js' && (
                        <div className="ide-pane active">
                          <pre className="code-editor"><code>{codingData.codeSnippets.js}</code></pre>
                        </div>
                      )}

                      {activeIDETab === 'terminal' && (
                        <div className="ide-pane active flex-column justify-start" id="ide-tab-term">
                          <div className="terminal-cli">
                            <div className="term-log">
                              {cliLogs.map((log, i) => (
                                <p key={i} className={`term-prompt-line ${log.type === 'output' ? 'cmd-out' : ''}`} dangerouslySetInnerHTML={{ __html: log.text }} />
                              ))}
                            </div>
                            <div className="term-input-wrapper">
                              <span className="cli-prompt">giridhar@system:~$ </span>
                              <input 
                                type="text" 
                                className="cli-input" 
                                value={cliInput}
                                onChange={(e) => setCliInput(e.target.value)}
                                onKeyDown={handleCLISubmit}
                                autoFocus
                                autoComplete="off"
                                spellCheck="false"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="ide-footer">
                      <span>// UTF-8 // LF // Git branch: main //</span>
                      <span>Ln 14, Col 27 // React Sandbox</span>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* C. PHOTOGRAPHY EXPANDED */}
            {activeModal === 'modal-photography' && (
              <section className="modal-section">
                <div className="modal-grid-layout photography-expanded">
                  <div className="modal-left-col glass-panel flex-column scrollable-y">
                    <h2 class="modal-section-title">CREATIVE VIEWFINDER</h2>
                    <p className="modal-section-subtitle">// THE WORLD IN 35MM FRAMES</p>
                    <p className="section-desc">Photography is the discipline of catching raw light, frozen structures, and fluid horizons. I travel to capture natural architecture, rivers, and rugged mountains.</p>
                    
                    <div className="camera-lens-widget">
                      <h4>LENS SETTINGS (INTERACTIVE FILTER)</h4>
                      
                      <div className="slider-group">
                        <div className="slider-label">
                          <span>SHUTTER SPEED (BRIGHTNESS)</span>
                          <span className="lbl-val">1/{cameraShutter}s</span>
                        </div>
                        <input 
                          type="range" 
                          className="camera-slider" 
                          min="50" 
                          max="200" 
                          value={cameraShutter}
                          onChange={(e) => setCameraShutter(parseInt(e.target.value))}
                        />
                      </div>

                      <div className="slider-group">
                        <div className="slider-label">
                          <span>APERTURE (DEPTH BLUR)</span>
                          <span className="lbl-val">f/{(cameraAperture / 2 + 1.2).toFixed(1)}</span>
                        </div>
                        <input 
                          type="range" 
                          className="camera-slider" 
                          min="0" 
                          max="10" 
                          value={cameraAperture}
                          onChange={(e) => setCameraAperture(parseInt(e.target.value))}
                        />
                      </div>

                      <div className="slider-group">
                        <div className="slider-label">
                          <span>ISO (FILM GRAIN)</span>
                          <span className="lbl-val">ISO {cameraIso * 20}</span>
                        </div>
                        <input 
                          type="range" 
                          className="camera-slider" 
                          min="0" 
                          max="100" 
                          value={cameraIso}
                          onChange={(e) => setCameraIso(parseInt(e.target.value))}
                        />
                      </div>

                      <button 
                        className="reset-filter-btn" 
                        onClick={() => {
                          setCameraShutter(100);
                          setCameraAperture(0);
                          setCameraIso(20);
                        }}
                      >
                        RESET EXPOSURE
                      </button>
                    </div>

                    <div className="lens-meta-card">
                      <span className="meta-title">// HARDWARE SPEC</span>
                      <div className="meta-row"><span>BODY:</span> <span>{photographyData.hardware.body}</span></div>
                      <div className="meta-row"><span>FAV GLASS:</span> <span>{photographyData.hardware.glass}</span></div>
                      <div className="meta-row"><span>LOCATION:</span> <span>{photographyData.hardware.location}</span></div>
                    </div>
                  </div>

                  <div className="modal-right-col glass-panel scrollable-y flex-column">
                    <div className="viewfinder-lens-wrapper">
                      <div className="camera-focus-reticle">
                        <span className="focus-bracket top-left"></span>
                        <span className="focus-bracket top-right"></span>
                        <span class="focus-bracket bottom-left"></span>
                        <span className="focus-bracket bottom-right"></span>
                        <span className="focus-indicator">AF-C</span>
                      </div>
                      
                      <div className="photography-canvas">
                        <img 
                          src={activePhoto.image} 
                          alt="Cinematic frame capture" 
                          style={{
                            filter: `brightness(${ (150 / cameraShutter) * 100 }%) blur(${ cameraAperture * 0.8 }px) contrast(105%)`,
                            transition: 'filter 0.05s linear, opacity 0.2s ease',
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                        <div className="noise-overlay" style={{ opacity: cameraIso / 120 }}></div>
                      </div>
                    </div>

                    <div className="photo-info-bar">
                      <span className="photo-title">{activePhoto.title}</span>
                      <span className="photo-coords">// {activePhoto.coordinates} //</span>
                    </div>

                    <div className="thumbnail-gallery-grid">
                      {photographyData.gallery.map((photo) => (
                        <div 
                          key={photo.id} 
                          className={`thumb-cell ${activePhoto.id === photo.id ? 'active' : ''}`}
                          onClick={() => setActivePhoto(photo)}
                        >
                          <img src={photo.image} alt={photo.title} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* D. NATURE EXPANDED */}
            {activeModal === 'modal-nature' && (
              <section className="modal-section">
                <div className="modal-grid-layout nature-expanded">
                  <div className="modal-left-col glass-panel flex-column justify-between">
                    <div>
                      <h2 className="modal-section-title">THE SANCTUARY</h2>
                      <p className="modal-section-subtitle">// RESETS NEURAL STATE & CORTISOL</p>
                      <p className="section-desc">Nature is not a luxury; it is a profound biological reset. Walking through forests, watching flowing rivers, and standing before mountain scopes is where complex structures dissolve into clarity.</p>
                    </div>

                    <div className="breathing-widget">
                      <h4>MINDFULNESS BREATHING REGULATOR</h4>
                      <p className="breathing-desc">Sync your breathing to the expanding circle to reset neural cortisol levels.</p>
                      <div className="breath-ring-container">
                        <div 
                          className="breathing-ring" 
                          style={{ 
                            transform: `scale(${breathingScale})`,
                            transition: 'transform 4s ease-in-out'
                          }}
                        ></div>
                        <div className="breathing-label">{breathingText}</div>
                      </div>
                    </div>
                  </div>

                  <div className="modal-right-col glass-panel relative flex-column">
                    <canvas ref={natureCanvasRef} className="nature-canvas"></canvas>
                    
                    <div className="soundscape-controls-card">
                      <h3>AMBIENT NATURE SOUND MIXER</h3>
                      <p>Simulate calm natural acoustics by configuring the decibel filters below.</p>
                      
                      <div className="mixer-sliders">
                        {natureData.sounds.map((sound) => (
                          <div className="mixer-channel" key={sound.id}>
                            <div className="ch-info">
                              <span className="ch-name"><i className={sound.icon}></i> {sound.label}</span>
                              <button 
                                className={`mute-btn ${natureMuted[sound.id] ? 'active' : ''}`}
                                onClick={() => setNatureMuted(prev => ({ ...prev, [sound.id]: !prev[sound.id] }))}
                              >
                                <i className={`fa-solid ${natureMuted[sound.id] ? 'fa-volume-xmark' : 'fa-volume-high'}`}></i>
                              </button>
                            </div>
                            <input 
                              type="range" 
                              className="mixer-slider"
                              min="0"
                              max="100"
                              disabled={natureMuted[sound.id]}
                              value={natureVolume[sound.id]}
                              onChange={(e) => setNatureVolume(prev => ({ ...prev, [sound.id]: parseInt(e.target.value) }))}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="nature-quote-block">
                      <span className="quote">{natureData.quote}</span>
                      <span className="author">— {natureData.author}</span>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* E. MUSIC EXPANDED */}
            {activeModal === 'modal-music' && (
              <section className="modal-section">
                <div className="modal-grid-layout music-expanded">
                  <div className="modal-left-col glass-panel flex-column justify-between">
                    <div>
                      <h2 className="modal-section-title">THE ACOUSTIC LOUNGE</h2>
                      <p className="modal-section-subtitle">// SINGING IS MY ESCAPE</p>
                      <p className="section-desc">Music provides an anchor to the emotional self. As a singer, I use voice control, resonance, and acoustic soundscapes to escape logical systems and channel creative vibration.</p>
                    </div>

                    <div className="vinyl-controller-widget">
                      <div className="track-info">
                        <span className="track-title">{musicData.trackTitle}</span>
                        <span className="track-artist">{musicData.trackArtist}</span>
                      </div>
                      <div className="player-progress-bar">
                        <div className="progress-filled" style={{ width: `${musicProgress}%` }}></div>
                      </div>
                      <div className="player-buttons">
                        <button className="play-control-btn"><i className="fa-solid fa-backward-step"></i></button>
                        <button 
                          className="play-control-btn play-main-btn"
                          onClick={() => setIsMusicPlaying(!isMusicPlaying)}
                        >
                          <i className={`fa-solid ${isMusicPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                        </button>
                        <button className="play-control-btn"><i className="fa-solid fa-forward-step"></i></button>
                      </div>
                    </div>
                  </div>

                  <div className="modal-right-col glass-panel visualizer-layout">
                    <div className="vinyl-player-turntable">
                      <div className="turntable-platter">
                        <div className={`platter-vinyl ${isMusicPlaying ? 'spinning' : ''}`}>
                          <div className="vinyl-label-center"></div>
                        </div>
                        <div className={`tonearm ${isMusicPlaying ? 'active' : ''}`}></div>
                      </div>
                    </div>

                    <div className="visualizer-container">
                      <span className="vis-lbl">WAVEFORM SPECTRUM (SIMULATED)</span>
                      <canvas ref={musicCanvasRef} className="waveform-canvas"></canvas>
                    </div>

                    <div className="lyrics-scroller" ref={lyricsScrollerRef}>
                      {musicData.lyrics.map((line, i) => (
                        <div 
                          key={i} 
                          className={`lyric-line ${activeLyricIndex === i ? 'active' : ''}`}
                        >
                          {line.text}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* F. FOOD INDUSTRY EXPANDED */}
            {activeModal === 'modal-food' && (
              <section className="modal-section">
                <div className="modal-grid-layout food-expanded">
                  <div className="modal-left-col glass-panel flex-column justify-between scrollable-y">
                    <div>
                      <h2 className="modal-section-title">GASTRO CULTURE</h2>
                      <p className="modal-section-subtitle">// BRAND FUSIONS & FOOD DESIGN</p>
                      <p className="section-desc">Food is the ultimate intersection of anthropology, creative plating, sensory pleasure, and hospitality. I look at food not just as culinary craft, but as a robust brand model ripe for technological automation and design.</p>
                    </div>

                    <div className="branding-mixer-widget">
                      <h4>BRAND CONCEPTS MIXER</h4>
                      <p className="breathing-desc">Select branding parameters to synthesize a gourmet food-tech venture concept.</p>
                      
                      <div className="mixer-buttons-list">
                        {foodData.mixPills.map((pill) => (
                          <button 
                            key={pill.id} 
                            className={`mix-pill ${selectedMixPills.includes(pill.id) ? 'selected' : ''}`}
                            onClick={() => toggleMixPill(pill.id)}
                          >
                            {pill.label}
                          </button>
                        ))}
                      </div>

                      <button className="synthesize-btn" onClick={handleMixSynthesize}>SYNTHESIZE VENTURE</button>
                      
                      {synthesizedConcept && (
                        <div className="synthesis-result">
                          <span className="res-lbl">// SYS SYNTHESIS OUT:</span>
                          <p className="res-text">{synthesizedConcept}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div 
                    className="modal-right-col glass-panel flex-column food-brand-details" 
                    style={{ 
                      backgroundImage: `linear-gradient(180deg, rgba(8,8,12,0.85) 0%, rgba(8,8,12,0.98) 100%), url('/food_luxury.png')`,
                      backgroundSize: 'cover', 
                      backgroundPosition: 'center' 
                    }}
                  >
                    <div className="brand-showcase-panel">
                      <span className="tag-gold">// THE BRAND MANUAL</span>
                      <h3>CULINIQUE CONCEPT</h3>
                      <p className="brand-long-desc">{foodData.longDescription}</p>
                      
                      <div className="brand-pillars">
                        {foodData.pillars.map((pillar) => (
                          <div className="pillar-card" key={pillar.id}>
                            <h5>{pillar.id} / {pillar.title}</h5>
                            <p>{pillar.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="culinary-gallery-slide">
                      <span className="gallery-title">// VIBE BOARD</span>
                      <div className="vibe-carousel">
                        <img src="/food_luxury.png" alt="Chef food luxury visual design" className="vibe-img" />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* G. ENTREPRENEUR MINDSET EXPANDED */}
            {activeModal === 'modal-mindset' && (
              <section className="modal-section">
                <div className="modal-grid-layout mindset-expanded">
                  <div className="modal-left-col glass-panel flex-column justify-between scrollable-y">
                    <div>
                      <h2 className="modal-section-title">THE CAPTAINS BRIDGE</h2>
                      <p className="modal-section-subtitle">// GROWING WEALTH THROUGH CREATION</p>
                      <p className="section-desc">Obsessed with execution. True leverage lies in building products that scale, assembling automated networks, and maintaining extreme mental discipline. I design companies, track asset lines, and optimize execution algorithms.</p>
                    </div>

                    <div className="financials-canvas-wrapper">
                      <div className="canvas-chart-header">
                        <span>SIMULATED SYSTEM TRACTION</span>
                        <span className="curr-val">
                          {hoveredChartPoint ? `${hoveredChartPoint.label}: ${hoveredChartPoint.value}` : "Hover node for metric"}
                        </span>
                      </div>
                      
                      <div style={{ position: 'relative' }}>
                        <canvas 
                          ref={growthCanvasRef} 
                          className="growth-canvas"
                          onMouseMove={handleValuationsMouseMove}
                          onMouseLeave={() => setHoveredChartPoint(null)}
                        ></canvas>
                        
                        {hoveredChartPoint && (
                          <div 
                            className="valuation-point-tooltip"
                            style={{ 
                              position: 'absolute',
                              left: `${chartTooltipPos.x}px`,
                              top: `${chartTooltipPos.y}px`
                            }}
                          >
                            <strong>{hoveredChartPoint.label}</strong>
                            <div>{hoveredChartPoint.value}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="modal-right-col glass-panel flex-column mindset-right scrollable-y">
                    <h3>THE MATRIX OF IDEAS</h3>
                    <p className="mindmap-desc">Click key nodes in Giridhar's entrepreneurial mental network to project their metrics.</p>
                    
                    <div className="svg-mindmap-wrapper">
                      <svg viewBox="0 0 400 240" className="mindmap-svg">
                        {/* Connector paths */}
                        <line x1="200" y1="120" x2="100" y2="60" stroke="#dfb15b" strokeWidth="1.5" className="line-animate"/>
                        <line x1="200" y1="120" x2="300" y2="60" stroke="#dfb15b" strokeWidth="1.5" className="line-animate"/>
                        <line x1="200" y1="120" x2="100" y2="180" stroke="#dfb15b" strokeWidth="1.5" className="line-animate"/>
                        <line x1="200" y1="120" x2="300" y2="180" stroke="#dfb15b" strokeWidth="1.5" className="line-animate"/>
                        
                        {/* Central Hub Node */}
                        <g className="mind-node root">
                          <circle cx="200" cy="120" r="18" fill="#121218" stroke="#dfb15b" strokeWidth="2"/>
                          <text x="200" y="124" textAnchor="middle" fill="#dfb15b" fontSize="8" fontFamily="Outfit">CORE</text>
                        </g>

                        {/* Mind Leaf Nodes */}
                        {entrepreneurData.mindmapNodes.map((node) => (
                          <g 
                            key={node.id} 
                            className="mind-node leaf"
                            onClick={() => setSelectedMindNode(node)}
                          >
                            <circle cx={node.cx} cy={node.cy} r="14" fill="#121218" stroke={node.color} strokeWidth="1.5"/>
                            <text x={node.cx} y={node.cy + 3} textAnchor="middle" fill="#f4f4f7" fontSize="7" fontFamily="Outfit">{node.text}</text>
                          </g>
                        ))}
                      </svg>
                      
                      <div className="node-explanation-card">
                        <span className="exp-title">
                          {selectedMindNode ? `// SELECTED PILLAR: ${selectedMindNode.text}` : "// SELECTED PILLAR SYSTEM"}
                        </span>
                        <p className="exp-body">
                          {selectedMindNode ? selectedMindNode.details : "Select a node above to inspect its entrepreneurial alignment metrics."}
                        </p>
                      </div>
                    </div>

                    <div className="mindset-milestones">
                      <h4>AMBITION ROADMAP</h4>
                      {entrepreneurData.roadmap.map((m, i) => (
                        <div className="milestone-row" key={i}>
                          <span className="m-title">{m.title}</span>
                          <div className="m-status">
                            <span className={`badge ${m.type}`}>{m.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

          </div>
        </main>
      )}
    </div>
  );
}

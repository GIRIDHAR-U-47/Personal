import { useState, useEffect, useRef } from 'react';
import { 
  Code as CodeIcon, 
  Github as GithubIcon, 
  Camera as CameraIcon, 
  Mountain as MountainIcon, 
  Music as MusicIcon, 
  ChefHat as FoodIcon, 
  TrendingUp as GrowthIcon, 
  BookOpen as JourneyIcon,
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  SkipForward, 
  X, 
  Terminal, 
  Flame, 
  Target, 
  Check, 
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  RefreshCw,
  Search,
  Sparkles,
  Sun,
  Compass
} from 'lucide-react';
import audioHelper from './audioHelper';
import './App.css';

// Mock Data for timeline
const TIMELINE_DATA = {
  2020: {
    title: "The Awakening: First Hello World",
    subtitle: "Entry into the Digital Universe",
    desc: "Coded my first interactive application. Discovered a deep, burning passion for engineering, problem solving, and building digital art. Laid down the foundation of computer science fundamentals.",
    achievement: "Mastered Python, JS basics & simple hardware hacks."
  },
  2022: {
    title: "Graduation & Engineering Leap",
    subtitle: "Diving into Enterprise Architecture",
    desc: "Graduated with honors in Computer Science. Built and scaled complex full-stack web and mobile apps. Started contributing to major open-source web ecosystems and building scalable backends.",
    achievement: "Developed 12 fully functional commercial systems."
  },
  2024: {
    title: "The Entrepreneurial Shift",
    subtitle: "Pioneering Tech & Food Innovation",
    desc: "Co-founded a culinary tech startup. Integrated smart operations, inventory management algorithms, and digital interfaces, mixing the culinary art with high-tech software workflows.",
    achievement: "Secured $150K initial funding, managed 10+ devs."
  },
  2026: {
    title: "Mastering Ethereal Digital Spaces",
    subtitle: "Building Today for a Better Tomorrow",
    desc: "Synthesizing full human sensory digital portals. Merging sound design, GPU shaders, physics-based simulations, and sleek architectural layouts to forge the next wave of interactive media.",
    achievement: "Creating fully custom audio-visual software installations."
  }
};

// Culinary suggested dishes based on profile score
const getCulinaryRecommendation = (sweet, savory, spicy, umami, acid) => {
  const sum = sweet + savory + spicy + umami + acid;
  if (sum === 0) return { name: "Symphony of Flavors", desc: "Balance your sliders to craft a recipe!" };
  
  if (spicy >= 70 && umami >= 70) {
    return { name: "Smoked Himalayan Truffle Chili Ramen", desc: "A fiery broth enriched with organic shiitake essence and cold-smoked black truffle paste, topped with fresh hand-pulled noodles." };
  }
  if (sweet >= 70 && acid >= 70) {
    return { name: "Deconstructed Tangy Wildberry Pavlova", desc: "Crisp vanilla bean meringue shards with a sour lemon-verbena curd and a warm, wild mountain blackberry reduction." };
  }
  if (savory >= 70 && umami >= 70) {
    return { name: "48-Hour Slow-Cooked Herb Glazed Ribeye", desc: "A robust cut slow-braised with rosemary, garlic confit, and red-wine reduction, served over a charred parsnip mousseline." };
  }
  if (acid >= 70 && savory >= 70) {
    return { name: "Charred Coastal Seabass with Citrus Gremolata", desc: "Fresh flaky seabass seared in cast iron, drizzled with blood-orange emulsion and a micro-herb salsa verde." };
  }
  if (sweet >= 70 && savory >= 60) {
    return { name: "Salted Caramel Apple Tarte Tatin", desc: "Caramelized Granny Smith apples inside a flaky puff pastry, served with flaky Fleur de Sel and bourbon vanilla ice cream." };
  }
  
  // Default dynamic calculation
  const primary = Object.entries({ sweet, savory, spicy, umami, acid })
    .sort((a,b) => b[1] - a[1])[0][0];
    
  switch (primary) {
    case 'spicy': return { name: "Szechuan Pepper Dust Octopus", desc: "Crisp tender baby octopus dry-rubbed with Szechuan peppercorns, bird's eye chili, and cilantro root." };
    case 'sweet': return { name: "Cardamom Spiced Saffron Kulfi", desc: "Traditional slow-reduced Indian ice cream infused with hand-crushed green cardamom and organic Kashmiri saffron." };
    case 'umami': return { name: "Pan-Seared Matsutake with Miso Glaze", desc: "Wild forest Matsutake mushrooms seared in brown butter, brushed with white miso and toasted sesame oil." };
    case 'acid': return { name: "Yuzu Infused Salmon Ceviche", desc: "Cured salmon cubes marinated in fresh Japanese yuzu juice, green apple slices, red radish, and pickled ginger." };
    default: return { name: "Artisanal Garden Herb Risotto", desc: "Creamy arborio rice simmered in vegetable stock, loaded with fresh tarragon, chervil, and aged Parmigiano Reggiano." };
  }
};

function App() {
  // Global states
  const [audioActive, setAudioActive] = useState(false);
  const [activeNode, setActiveNode] = useState(null);
  const [activeCard, setActiveCard] = useState(null);
  const [activeWidget, setActiveWidget] = useState(null); // 'leetcode' | 'focus' | null
  
  // Custom interactive sub-module states
  // 1. Code IDE states
  const [codeRunning, setCodeRunning] = useState(false);
  const [codeConsole, setCodeConsole] = useState([]);
  
  // 2. GitHub Contributions Grid states
  const [githubGrid, setGithubGrid] = useState(
    Array.from({ length: 48 }, (_, i) => ({
      id: i,
      lvl: i === 0 ? 0 : Math.floor(Math.random() * 4), // random green level (0-3)
      commits: Math.floor(Math.random() * 8)
    }))
  );
  
  // 3. Photography polaroids states
  const [photoIndex, setPhotoIndex] = useState(0);
  const photos = [
    { title: "Rohtang Pass", desc: "Himalayas, 13,058 ft", gradient: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)" },
    { title: "Silent Valley", desc: "Western Ghats", gradient: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)" },
    { title: "Misty Sunrise", desc: "Wayand Hills", gradient: "linear-gradient(135deg, #e65c00 0%, #f9d423 100%)" },
    { title: "Monsoon Flow", desc: "Athirappilly Cascade", gradient: "linear-gradient(135deg, #4b6cb7 0%, #182848 100%)" }
  ];

  // 4. Nature states
  const [windSpeed, setWindSpeed] = useState(15);
  const [chimeAngles, setChimeAngles] = useState([0, 0, 0, 0, 0]);

  // 5. Music Player states
  const [isPlayingSong, setIsPlayingSong] = useState(false);
  const [songProgress, setSongProgress] = useState(30);

  // 6. Food states
  const [tasteProfile, setTasteProfile] = useState({
    sweet: 30,
    savory: 75,
    spicy: 40,
    umami: 80,
    acid: 20
  });

  // 7. Growth compound slider states
  const [monthlyInvest, setMonthlyInvest] = useState(500);
  const [returnRate, setReturnRate] = useState(12);
  const [compoundYears, setCompoundYears] = useState(15);

  // 8. Journey timeline states
  const [selectedTimelineYear, setSelectedTimelineYear] = useState(2026);

  // Habit Tracker states
  const [habitStreak, setHabitStreak] = useState(112);
  const [checkedHabits, setCheckedHabits] = useState({
    code: true,
    read: false,
    meditate: false
  });

  // References
  const canvasRef = useRef(null);
  const waveCanvasRef = useRef(null);
  const waveAnimRef = useRef(null);

  // Audio system toggler
  const toggleAudio = () => {
    const newState = !audioActive;
    setAudioActive(newState);
    audioHelper.setMute(!newState);
  };

  // Sound play helper on actions
  const playSoundEffect = (type) => {
    if (audioActive) {
      audioHelper.playClick();
    }
  };

  // Synthesize specific hover sound for nodes
  const handleNodeHover = (nodeId) => {
    setActiveNode(nodeId);
    if (audioActive) {
      audioHelper.playHover(nodeId);
    }
  };

  // Visualizer bar animation (top right)
  useEffect(() => {
    if (audioActive) {
      audioHelper.startAmbient();
    }
  }, [audioActive]);

  // Rising embers and white foam particle engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    // Embers rising from central rocks
    const particles = [];
    const particleCount = 45;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 200,
        radius: 0.8 + Math.random() * 2,
        speedY: -0.3 - Math.random() * 0.8,
        speedX: Math.sin(Math.random() * Math.PI) * 0.15,
        alpha: 0.1 + Math.random() * 0.45,
        color: i % 3 === 0 ? '#d4af37' : i % 3 === 1 ? '#06b6d4' : '#a855f7' // gold, cyan, purple theme
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // White river foam splattering at bottom river area
      if (Math.random() < 0.22) {
        particles.push({
          x: canvas.width * 0.35 + Math.random() * (canvas.width * 0.65),
          y: canvas.height * 0.72 + Math.random() * (canvas.height * 0.28),
          radius: 0.4 + Math.random() * 1.4,
          speedY: -0.05 - Math.random() * 0.15,
          speedX: -0.6 - Math.random() * 0.9, // flowing downstream leftwards
          alpha: 0.1 + Math.random() * 0.3,
          color: '#ffffff',
          life: 80 + Math.random() * 40
        });
      }

      particles.forEach((p, index) => {
        p.y += p.speedY;
        p.x += p.speedX;

        if (p.life !== undefined) {
          p.life--;
          p.alpha -= 0.0035;
        }

        // Loop regular particles
        if (p.y < -10 && p.life === undefined) {
          p.y = canvas.height + 20;
          p.x = Math.random() * canvas.width;
          p.alpha = 0.1 + Math.random() * 0.45;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fill();

        // splice dead water foam
        if (p.life <= 0) {
          particles.splice(index, 1);
        }
      });

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Music Visualizer Canvas rendering
  useEffect(() => {
    const canvas = waveCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let phase = 0;

    const renderWave = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const width = canvas.width;
      const height = canvas.height;
      
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      
      // Draw 3 layers of glowing mathematical waves
      for (let i = 0; i < width; i++) {
        // Amplitude fluctuates if playing
        const amp1 = isPlayingSong ? 20 + Math.sin(phase * 2) * 8 : 4;
        const freq1 = 0.015;
        
        const y = height / 2 + Math.sin(i * freq1 + phase) * amp1;
        if (i === 0) ctx.moveTo(i, y);
        else ctx.lineTo(i, y);
      }
      ctx.stroke();

      ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      for (let i = 0; i < width; i++) {
        const amp2 = isPlayingSong ? 12 + Math.cos(phase * 1.5) * 5 : 2;
        const freq2 = 0.022;
        const y = height / 2 + Math.sin(i * freq2 - phase * 1.2) * amp2;
        if (i === 0) ctx.moveTo(i, y);
        else ctx.lineTo(i, y);
      }
      ctx.stroke();
      
      phase += isPlayingSong ? 0.08 : 0.01;
      waveAnimRef.current = requestAnimationFrame(renderWave);
    };

    renderWave();

    return () => {
      if (waveAnimRef.current) cancelAnimationFrame(waveAnimRef.current);
    };
  }, [isPlayingSong]);

  // Code IDE runner simulation logic
  const runCodeSolution = () => {
    if (codeRunning) return;
    playSoundEffect();
    setCodeRunning(true);
    setCodeConsole(["[System] Running solution in Node Sandbox...", "[System] Loading Two-Sum test-suite..."]);
    
    setTimeout(() => {
      setCodeConsole(prev => [...prev, "[Test Suite] Running Case #1: nums = [2,7,11,15], target = 9"]);
    }, 800);
    
    setTimeout(() => {
      setCodeConsole(prev => [...prev, "✔ SUCCESS: Case #1 Passed! Output: [0, 1]"]);
    }, 1500);

    setTimeout(() => {
      setCodeConsole(prev => [...prev, "[Test Suite] Running Case #2: nums = [3,2,4], target = 6"]);
    }, 2100);

    setTimeout(() => {
      setCodeConsole(prev => [
        ...prev, 
        "✔ SUCCESS: Case #2 Passed! Output: [1, 2]",
        "",
        "------------------------------------",
        "STATUS: ALL TESTS COMPLETED SUCCESSFULLY!",
        "Runtime: 16ms (Beats 99.2% of JS submissions)",
        "Memory: 41.2 MB (Beats 95.8% of JS submissions)"
      ]);
      setCodeRunning(false);
      if (audioActive) {
        audioHelper.playClick();
      }
    }, 3000);
  };

  // GitHub grid contribution click action
  const handleGithubCellClick = (cellId) => {
    setGithubGrid(prev => prev.map(c => {
      if (c.id === cellId) {
        const nextLvl = (c.lvl + 1) % 5;
        if (audioActive) {
          // Play ascending scales depending on level clicked
          audioHelper.playChime(nextLvl + 3);
        }
        return {
          ...c,
          lvl: nextLvl,
          commits: c.commits + 1
        };
      }
      return c;
    }));
  };

  // Polaroid picture shuffle action
  const shufflePhotos = () => {
    playSoundEffect();
    setPhotoIndex(prev => (prev + 1) % photos.length);
    if (audioActive) {
      // Synthesize DSLR shutter snap!
      audioHelper.playHover('photography');
    }
  };

  // Nature wind slider adjustments
  const handleWindSlider = (e) => {
    const val = parseInt(e.target.value);
    setWindSpeed(val);
    audioHelper.setWindSpeed(val);
  };

  // Zen physical Wind Chime stroke physics
  const triggerChime = (chimeIdx) => {
    if (audioActive) {
      audioHelper.playChime(chimeIdx + 2); // Pentatonic scale note
    }
    
    // Animate visual rotation/swing using temporary state
    setChimeAngles(prev => prev.map((a, i) => i === chimeIdx ? 12 : a));
    setTimeout(() => {
      setChimeAngles(prev => prev.map((a, i) => i === chimeIdx ? -8 : a));
    }, 150);
    setTimeout(() => {
      setChimeAngles(prev => prev.map((a, i) => i === chimeIdx ? 4 : a));
    }, 350);
    setTimeout(() => {
      setChimeAngles(prev => prev.map((a, i) => i === chimeIdx ? 0 : a));
    }, 600);
  };

  // Compound wealth calculation formula
  const getCompoundProjectedVal = () => {
    const P = monthlyInvest;
    const r = returnRate / 100;
    const n = compoundYears * 12;
    if (r === 0) return P * n;
    
    // S = P * (((1 + r/12)^(n) - 1) / (r/12)) * (1 + r/12)
    const monthlyRate = r / 12;
    const S = P * ((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate) * (1 + monthlyRate);
    return Math.round(S);
  };

  const getCompoundInvestedVal = () => {
    return monthlyInvest * compoundYears * 12;
  };

  // Render curved SVG charts based on slider states
  const generateCompoundSvgPath = () => {
    const points = [];
    const maxVal = getCompoundProjectedVal();
    const P = monthlyInvest;
    const r = returnRate / 100;
    const totalMonths = compoundYears * 12;
    const monthlyRate = r / 12;
    
    // Sample 10 coordinate points for the SVG bezier curve
    for (let i = 0; i <= 9; i++) {
      const currentMonth = Math.round((totalMonths / 9) * i);
      const val = monthlyRate === 0 
        ? P * currentMonth 
        : P * ((Math.pow(1 + monthlyRate, currentMonth) - 1) / monthlyRate) * (1 + monthlyRate);
        
      const x = (i / 9) * 100; // percent wide
      const y = 90 - (val / maxVal) * 80; // scale y value (reserve padding bottom/top)
      points.push(`${x},${y}`);
    }
    
    const linePath = `M ${points.join(' L ')}`;
    const areaPath = `${linePath} L 100,90 L 0,90 Z`;
    return { linePath, areaPath };
  };

  const compoundPaths = generateCompoundSvgPath();

  // Habit toggling triggers fire particle
  const toggleHabit = (key) => {
    playSoundEffect();
    setCheckedHabits(prev => {
      const nextChecked = { ...prev, [key]: !prev[key] };
      const numChecked = Object.values(nextChecked).filter(Boolean).length;
      if (numChecked === 3) {
        setHabitStreak(h => h + 1);
        if (audioActive) {
          audioHelper.playEchoChime(880, audioHelper.audioCtx.currentTime);
        }
      }
      return nextChecked;
    });
  };

  return (
    <div className="app-container">
      
      {/* SVG Water Turbulence Filters for Flowing River */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="water-flow-filter">
            {/* Dynamic turbulence animated via slow fractal frequency warping */}
            <feTurbulence type="fractalNoise" baseFrequency="0.015 0.06" numOctaves="3" result="noise">
              <animate attributeName="baseFrequency" dur="18s" values="0.015 0.06;0.015 0.12;0.015 0.06" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* Background Scenic Layers */}
      <div className="background-wrapper">
        <img 
          src="/master_bg.png" 
          alt="Ethereal Mountain River Forest Backdrop" 
          className="master-background"
        />
        {/* River layer with the actual turbulent displacement filter applied */}
        <div className="river-flow-overlay" />
        
        {/* Slowly floating misty overlay */}
        <div className="mist-layer" />
      </div>

      {/* Canvas for floating magical embers & river vapor */}
      <canvas ref={canvasRef} className="particles-canvas" />

      {/* SVG Connection Energy lines (Desktop Only) */}
      <svg className="connections-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M 50 48 Q 35 33, 25 18" className={`connection-path ${activeNode === 'code' ? 'active' : ''}`} style={{ '--active-glow': 'var(--color-cyan)' }} />
        <path d="M 50 48 Q 32 40, 19 35" className={`connection-path ${activeNode === 'github' ? 'active' : ''}`} style={{ '--active-glow': 'var(--color-emerald)' }} />
        <path d="M 50 48 Q 31 50, 18 52" className={`connection-path ${activeNode === 'photography' ? 'active' : ''}`} style={{ '--active-glow': 'var(--color-rose)' }} />
        <path d="M 50 48 Q 35 63, 24 78" className={`connection-path ${activeNode === 'nature' ? 'active' : ''}`} style={{ '--active-glow': 'var(--color-amber)' }} />
        <path d="M 50 48 Q 65 33, 75 18" className={`connection-path ${activeNode === 'music' ? 'active' : ''}`} style={{ '--active-glow': 'var(--color-purple)' }} />
        <path d="M 50 48 Q 68 40, 81 35" className={`connection-path ${activeNode === 'food' ? 'active' : ''}`} style={{ '--active-glow': 'var(--color-amber)' }} />
        <path d="M 50 48 Q 69 50, 82 52" className={`connection-path ${activeNode === 'growth' ? 'active' : ''}`} style={{ '--active-glow': 'var(--color-emerald)' }} />
        <path d="M 50 48 Q 65 63, 76 78" className={`connection-path ${activeNode === 'journey' ? 'active' : ''}`} style={{ '--active-glow': 'var(--color-blue)' }} />
      </svg>

      {/* Header Bar */}
      <header className="header-bar">
        <div className="header-left">
          <Compass className="node-icon" />
          <span>Explore My World</span>
        </div>
        
        <div className="header-center">
          <h1 className="main-title" id="main-heading">GIRIDHAR U</h1>
          <p className="subtitle">ENGINEER • CREATOR • BUILDER</p>
        </div>

        <div className="header-right">
          <span className="quote-tag">"Building today for a better tomorrow."</span>
          {/* Audio toggle button with reactive visualizer bars */}
          <button 
            type="button"
            className={`audio-visualizer-toggle ${audioActive ? 'audio-active' : ''}`} 
            onClick={toggleAudio}
            aria-label="Toggle Ethereal Soundscape"
          >
            <div className="visualizer-bars">
              <div className="bar" />
              <div className="bar" />
              <div className="bar" />
              <div className="bar" />
            </div>
            {audioActive ? <Volume2 size={13} style={{color: '#d4af37'}} /> : <VolumeX size={13} style={{color: 'rgba(255,255,255,0.4)'}} />}
          </button>
        </div>
      </header>

      {/* Glowing aura background behind multi-armed avatar */}
      <div className="center-halo-glow" />

      {/* Interactive Radial Spatial Nodes */}
      <main className="nodes-container" aria-label="Interactive portfolio nodes">
        {/* Node 1: CODE */}
        <div 
          className={`interactive-node node-code ${activeCard === 'code' ? 'active' : ''}`}
          onMouseEnter={() => handleNodeHover('code')}
          onMouseLeave={() => setActiveNode(null)}
          onClick={() => { playSoundEffect(); setActiveCard('code'); }}
        >
          <div className="node-trigger">
            <CodeIcon className="node-icon" />
          </div>
          <div className="node-label">
            <p className="node-title">Code</p>
            <p className="node-desc">Problem Solver & Sandbox</p>
          </div>
        </div>

        {/* Node 2: GITHUB */}
        <div 
          className={`interactive-node node-github ${activeCard === 'github' ? 'active' : ''}`}
          onMouseEnter={() => handleNodeHover('github')}
          onMouseLeave={() => setActiveNode(null)}
          onClick={() => { playSoundEffect(); setActiveCard('github'); }}
        >
          <div className="node-trigger">
            <GithubIcon className="node-icon" />
          </div>
          <div className="node-label">
            <p className="node-title">GitHub</p>
            <p className="node-desc">Open Source Contributor</p>
          </div>
        </div>

        {/* Node 3: PHOTOGRAPHY */}
        <div 
          className={`interactive-node node-photography ${activeCard === 'photography' ? 'active' : ''}`}
          onMouseEnter={() => handleNodeHover('photography')}
          onMouseLeave={() => setActiveNode(null)}
          onClick={() => { playSoundEffect(); setActiveCard('photography'); }}
        >
          <div className="node-trigger">
            <CameraIcon className="node-icon" />
          </div>
          <div className="node-label">
            <p className="node-title">Photography</p>
            <p className="node-desc">Capturing Ethereal Moments</p>
          </div>
        </div>

        {/* Node 4: NATURE */}
        <div 
          className={`interactive-node node-nature ${activeCard === 'nature' ? 'active' : ''}`}
          onMouseEnter={() => handleNodeHover('nature')}
          onMouseLeave={() => setActiveNode(null)}
          onClick={() => { playSoundEffect(); setActiveCard('nature'); }}
        >
          <div className="node-trigger">
            <MountainIcon className="node-icon" />
          </div>
          <div className="node-label">
            <p className="node-title">Nature</p>
            <p className="node-desc">Wind Chimes & Harmony</p>
          </div>
        </div>

        {/* Node 5: MUSIC */}
        <div 
          className={`interactive-node node-music ${activeCard === 'music' ? 'active' : ''}`}
          onMouseEnter={() => handleNodeHover('music')}
          onMouseLeave={() => setActiveNode(null)}
          onClick={() => { playSoundEffect(); setActiveCard('music'); }}
        >
          <div className="node-trigger">
            <MusicIcon className="node-icon" />
          </div>
          <div className="node-label">
            <p className="node-title">Music</p>
            <p className="node-desc">Singer & Waveform Mixer</p>
          </div>
        </div>

        {/* Node 6: FOOD INDUSTRY */}
        <div 
          className={`interactive-node node-food ${activeCard === 'food' ? 'active' : ''}`}
          onMouseEnter={() => handleNodeHover('food')}
          onMouseLeave={() => setActiveNode(null)}
          onClick={() => { playSoundEffect(); setActiveCard('food'); }}
        >
          <div className="node-trigger">
            <FoodIcon className="node-icon" />
          </div>
          <div className="node-label">
            <p className="node-title">Gastronomy</p>
            <p className="node-desc">Artisanal Flavor Planner</p>
          </div>
        </div>

        {/* Node 7: GROWTH */}
        <div 
          className={`interactive-node node-growth ${activeCard === 'growth' ? 'active' : ''}`}
          onMouseEnter={() => handleNodeHover('growth')}
          onMouseLeave={() => setActiveNode(null)}
          onClick={() => { playSoundEffect(); setActiveCard('growth'); }}
        >
          <div className="node-trigger">
            <GrowthIcon className="node-icon" />
          </div>
          <div className="node-label">
            <p className="node-title">Growth</p>
            <p className="node-desc">Wealth Compound Calculator</p>
          </div>
        </div>

        {/* Node 8: JOURNEY */}
        <div 
          className={`interactive-node node-journey ${activeCard === 'journey' ? 'active' : ''}`}
          onMouseEnter={() => handleNodeHover('journey')}
          onMouseLeave={() => setActiveNode(null)}
          onClick={() => { playSoundEffect(); setActiveCard('journey'); }}
        >
          <div className="node-trigger">
            <JourneyIcon className="node-icon" />
          </div>
          <div className="node-label">
            <p className="node-title">Journey</p>
            <p className="node-desc">Documenting My Timeline</p>
          </div>
        </div>
      </main>

      {/* Central motto signature */}
      <div className="central-callout">
        <p className="cursive-phrase">I build. I create. I explore.</p>
        <p className="motto">A never ending journey of becoming.</p>
        
        <div className="scroll-indicator">
          <span>Explore Interactive Realms</span>
          <div className="mouse-icon">
            <div className="mouse-wheel" />
          </div>
        </div>
      </div>

      {/* Ambient Backdrop Dimmer when overlay card is open */}
      <div 
        className={`ambient-dimmer ${activeCard ? 'active' : ''}`} 
        onClick={() => { playSoundEffect(); setActiveCard(null); }}
      />

      {/* HIGH FIDELITY DETAILED OVERLAY CARDS */}
      <div className={`overlay-panel-container ${activeCard ? 'active' : ''}`}>
        {activeCard === 'code' && (
          <div className="interactive-card glass-panel" style={{ '--accent-color': 'var(--color-cyan)' }}>
            <div className="card-header">
              <div className="card-title-group">
                <div className="card-icon-wrapper"><CodeIcon /></div>
                <div>
                  <h2 className="card-title">Problem Solver Sandbox</h2>
                  <p className="card-subtitle">Two Sum Algorithm Solver</p>
                </div>
              </div>
              <button 
                type="button"
                className="card-close-btn" 
                onClick={() => { playSoundEffect(); setActiveCard(null); }}
                aria-label="Close panel"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="card-content">
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '16px', lineHeight: '1.5' }}>
                Write an efficient algorithm to identify two indices that compound to the target sum. Below is my optimized solution.
              </p>
              
              <div className="ide-container">
                <div className="ide-header">
                  <div className="ide-dots">
                    <div className="ide-dot" />
                    <div className="ide-dot" />
                    <div className="ide-dot" />
                  </div>
                  <span>twoSumSolver.js</span>
                  <button 
                    type="button"
                    className="ide-btn" 
                    onClick={runCodeSolution} 
                    disabled={codeRunning}
                  >
                    <Play size={11} fill="currentColor" />
                    {codeRunning ? 'Running Sandbox...' : 'Run Code Solution'}
                  </button>
                </div>
                
                <div className="ide-body">
                  <span className="ide-comment">// Time Complexity: O(n) | Space Complexity: O(n)</span><br />
                  <span className="ide-keyword">function</span> <span className="ide-code">twoSum</span>(nums, target) &#123;<br />
                  &nbsp;&nbsp;<span className="ide-keyword">const</span> map = <span className="ide-keyword">new</span> <span className="ide-code">Map</span>();<br />
                  &nbsp;&nbsp;<span className="ide-keyword">for</span> (<span className="ide-keyword">let</span> i = 0; i &lt; nums.length; i++) &#123;<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;<span className="ide-keyword">const</span> complement = target - nums[i];<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;<span className="ide-keyword">if</span> (map.has(complement)) &#123;<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="ide-keyword">return</span> [map.get(complement), i];<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&#125;<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;map.set(nums[i], i);<br />
                  &nbsp;&nbsp;&#125;<br />
                  &#125;
                  
                  {codeConsole.length > 0 && (
                    <div className="ide-output" style={{ '--ide-status-color': codeRunning ? '#eab308' : '#10b981' }}>
                      {codeConsole.map((line, idx) => (
                        <div key={idx} style={{ color: line.startsWith('✔') ? '#34d399' : line.startsWith('[System]') ? '#60a5fa' : '#f3f4f6', fontFamily: 'monospace' }}>
                          {line}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeCard === 'github' && (
          <div className="interactive-card glass-panel" style={{ '--accent-color': 'var(--color-emerald)' }}>
            <div className="card-header">
              <div className="card-title-group">
                <div className="card-icon-wrapper"><GithubIcon /></div>
                <div>
                  <h2 className="card-title">GitHub Open Source Hub</h2>
                  <p className="card-subtitle">Daily Contributions Grid</p>
                </div>
              </div>
              <button 
                type="button"
                className="card-close-btn" 
                onClick={() => { playSoundEffect(); setActiveCard(null); }}
                aria-label="Close panel"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="card-content">
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '20px', lineHeight: '1.5' }}>
                Interact with the commitment chart below! Click any node cell to submit a mock git push, increase contribution density, and trigger synthesized musical scale ripples.
              </p>
              
              <div className="github-grid-wrapper">
                <div className="github-grid">
                  {githubGrid.map(cell => (
                    <button
                      key={cell.id}
                      type="button"
                      className={`github-cell lvl-${cell.lvl}`}
                      onClick={() => handleGithubCellClick(cell.id)}
                      style={{ color: cell.lvl > 0 ? '#39d353' : 'rgba(255,255,255,0.1)' }}
                      title={`${cell.commits} commits on cell ${cell.id}`}
                      aria-label={`${cell.commits} commits on contribution square ${cell.id}`}
                    />
                  ))}
                </div>
                
                <div className="github-stats-row">
                  <div className="github-stat-card">
                    <h3 style={{ fontSize: '20px', color: '#39d353', fontWeight: 'bold' }}>2,847</h3>
                    <p style={{ fontSize: '10px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>Contributions past year</p>
                  </div>
                  <div className="github-stat-card">
                    <h3 style={{ fontSize: '20px', color: '#39d353', fontWeight: 'bold' }}>48 Days</h3>
                    <p style={{ fontSize: '10px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>Current Commit Streak</p>
                  </div>
                  <div className="github-stat-card">
                    <h3 style={{ fontSize: '20px', color: '#39d353', fontWeight: 'bold' }}>TypeScript</h3>
                    <p style={{ fontSize: '10px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>Favorite language</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeCard === 'photography' && (
          <div className="interactive-card glass-panel" style={{ '--accent-color': 'var(--color-rose)' }}>
            <div className="card-header">
              <div className="card-title-group">
                <div className="card-icon-wrapper"><CameraIcon /></div>
                <div>
                  <h2 className="card-title">Photography Deck</h2>
                  <p className="card-subtitle">Ethereal Nature Captures</p>
                </div>
              </div>
              <button 
                type="button"
                className="card-close-btn" 
                onClick={() => { playSoundEffect(); setActiveCard(null); }}
                aria-label="Close panel"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="card-content">
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '20px', lineHeight: '1.5', textAlign: 'center' }}>
                Click the deck to trigger a synthesized DSLR camera shutter snap, shuffling beautiful gradient scenic polaroid captures.
              </p>
              
              <div className="photography-container" onClick={shufflePhotos}>
                {photos.map((photo, idx) => {
                  // Calculate offsets to lay cards out in a 3D deck stack
                  const offset = (idx - photoIndex + photos.length) % photos.length;
                  const zIndex = photos.length - offset;
                  const scale = 1 - offset * 0.05;
                  const rotate = (idx % 2 === 0 ? 5 : -5) + offset * 4;
                  const translateY = offset * -12;
                  const opacity = offset === 3 ? 0 : 1;
                  
                  return (
                    <div 
                      key={idx}
                      className="polaroid-photo"
                      style={{
                        zIndex,
                        transform: `scale(${scale}) rotate(${rotate}deg) translateY(${translateY}px)`,
                        opacity,
                        pointerEvents: offset === 0 ? 'auto' : 'none'
                      }}
                    >
                      <div className="polaroid-img-box" style={{ background: photo.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        <CameraIcon size={36} opacity={0.2} />
                      </div>
                      <div className="polaroid-caption">
                        {photo.title}
                        <p style={{ fontFamily: 'sans-serif', fontSize: '9px', color: '#64748b', marginTop: '2px', fontWeight: 'normal' }}>
                          {photo.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeCard === 'nature' && (
          <div className="interactive-card glass-panel" style={{ '--accent-color': 'var(--color-amber)' }}>
            <div className="card-header">
              <div className="card-title-group">
                <div className="card-icon-wrapper"><MountainIcon /></div>
                <div>
                  <h2 className="card-title">Zen Nature Garden</h2>
                  <p className="card-subtitle">Wind Chimes & Sound Synthesis</p>
                </div>
              </div>
              <button 
                type="button"
                className="card-close-btn" 
                onClick={() => { playSoundEffect(); setActiveCard(null); }}
                aria-label="Close panel"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="card-content">
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '16px', lineHeight: '1.5' }}>
                Harness the Web Audio API synthesizer. Adjust wind intensity to modulate real-time synthesized LFO white noise, or stroke the wind chimes to swing them and sound a melodic pentatonic scale.
              </p>
              
              <div className="nature-slider-box">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span>Wind Intensity: {windSpeed}%</span>
                  <span style={{ color: 'var(--color-amber)' }}>{windSpeed > 60 ? 'Howling Storm' : windSpeed > 25 ? 'Fresh Breeze' : 'Calm Whisper'}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={windSpeed} 
                  onChange={handleWindSlider}
                  className="custom-range-slider"
                  aria-label="Wind Intensity"
                />
                
                {/* Visual physics-based wind-chime simulator */}
                <div className="wind-chimes-frame">
                  {chimeAngles.map((angle, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="wind-chime-string"
                      onClick={() => triggerChime(idx)}
                      style={{ 
                        height: `${100 + idx * 15}px`,
                        transform: `rotate(${angle}deg)`
                      }}
                      title={`Stroke Wind Chime ${idx + 1}`}
                      aria-label={`Wind chime ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeCard === 'music' && (
          <div className="interactive-card glass-panel" style={{ '--accent-color': 'var(--color-purple)' }}>
            <div className="card-header">
              <div className="card-title-group">
                <div className="card-icon-wrapper"><MusicIcon /></div>
                <div>
                  <h2 className="card-title">Music Wave Mixer</h2>
                  <p className="card-subtitle">Acoustic Covers & Math Waves</p>
                </div>
              </div>
              <button 
                type="button"
                className="card-close-btn" 
                onClick={() => { playSoundEffect(); setActiveCard(null); }}
                aria-label="Close panel"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="card-content">
              <div className="music-player-panel">
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>Golden Hour (Acoustic Cover)</h3>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '2px', textTransform: 'uppercase' }}>Giridhar U • Vocals & Guitar</p>
                </div>
                
                {/* Waveform mixer canvas */}
                <canvas ref={waveCanvasRef} className="music-visualizer-canvas" width="600" height="80" />
                
                <div className="player-controls">
                  <button type="button" className="player-btn" onClick={() => playSoundEffect()} aria-label="Previous Track">
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    type="button"
                    className="player-btn play-pause" 
                    onClick={() => {
                      playSoundEffect();
                      setIsPlayingSong(p => !p);
                    }}
                    aria-label={isPlayingSong ? "Pause Track" : "Play Track"}
                  >
                    {isPlayingSong ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" style={{ marginLeft: '4px' }} />}
                  </button>
                  <button type="button" className="player-btn" onClick={() => playSoundEffect()} aria-label="Next Track">
                    <ChevronRight size={20} />
                  </button>
                </div>
                
                {/* Dynamic player timeline slider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                  <span>0:45</span>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={songProgress} 
                    onChange={(e) => setSongProgress(parseInt(e.target.value))}
                    className="custom-range-slider"
                    style={{ flex: 1 }}
                    aria-label="Song progress"
                  />
                  <span>3:12</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeCard === 'food' && (
          <div className="interactive-card glass-panel" style={{ '--accent-color': 'var(--color-amber)' }}>
            <div className="card-header">
              <div className="card-title-group">
                <div className="card-icon-wrapper"><FoodIcon /></div>
                <div>
                  <h2 className="card-title">Gastronomy Flavor Planner</h2>
                  <p className="card-subtitle">Radar Plate Profile Builder</p>
                </div>
              </div>
              <button 
                type="button"
                className="card-close-btn" 
                onClick={() => { playSoundEffect(); setActiveCard(null); }}
                aria-label="Close panel"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="card-content">
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '20px', lineHeight: '1.5' }}>
                Balance flavor profiles in real-time. Slide the taste variables to update our interactive digital platter aura and craft suggested signature gourmet creations.
              </p>
              
              <div className="culinary-row">
                <div className="flavor-sliders">
                  {Object.keys(tasteProfile).map(taste => (
                    <div className="flavor-slider-item" key={taste}>
                      <div className="flavor-slider-label">
                        <span>{taste}</span>
                        <span style={{ color: 'var(--color-amber)', fontWeight: 'bold' }}>{tasteProfile[taste]}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={tasteProfile[taste]} 
                        onChange={(e) => {
                          setTasteProfile(prev => ({ ...prev, [taste]: parseInt(e.target.value) }));
                          if (audioActive && parseInt(e.target.value) % 5 === 0) {
                            audioHelper.playChime(taste === 'spicy' ? 6 : taste === 'umami' ? 8 : 4);
                          }
                        }}
                        className="custom-range-slider"
                        aria-label={`${taste} level`}
                      />
                    </div>
                  ))}
                </div>
                
                <div className="plate-canvas-display" style={{ 
                  '--food-color': tasteProfile.spicy > 60 
                    ? '#ef4444' 
                    : tasteProfile.umami > 60 
                    ? '#aa7c11' 
                    : tasteProfile.sweet > 60 
                    ? '#f472b6' 
                    : '#10b981' 
                }}>
                  <div className="plate-circle">
                    <div className="plate-food-aura" style={{ 
                      transform: `scale(${0.5 + (tasteProfile.spicy + tasteProfile.umami + tasteProfile.sweet + tasteProfile.savory + tasteProfile.acid) / 500})`
                    }} />
                    <FoodIcon size={32} style={{ zIndex: 2, color: 'white', opacity: 0.8 }} />
                  </div>
                  
                  {/* Dynamic chef suggestion */}
                  <div>
                    <h4 style={{ fontSize: '14px', color: 'var(--color-amber)', fontWeight: 'bold' }}>
                      {getCulinaryRecommendation(tasteProfile.sweet, tasteProfile.savory, tasteProfile.spicy, tasteProfile.umami, tasteProfile.acid).name}
                    </h4>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginTop: '6px', lineHeight: '1.4' }}>
                      {getCulinaryRecommendation(tasteProfile.sweet, tasteProfile.savory, tasteProfile.spicy, tasteProfile.umami, tasteProfile.acid).desc}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeCard === 'growth' && (
          <div className="interactive-card glass-panel" style={{ '--accent-color': 'var(--color-emerald)' }}>
            <div className="card-header">
              <div className="card-title-group">
                <div className="card-icon-wrapper"><GrowthIcon /></div>
                <div>
                  <h2 className="card-title">Wealth Compound Projection</h2>
                  <p className="card-subtitle">Project Compounding Wealth</p>
                </div>
              </div>
              <button 
                type="button"
                className="card-close-btn" 
                onClick={() => { playSoundEffect(); setActiveCard(null); }}
                aria-label="Close panel"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="card-content">
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '20px', lineHeight: '1.5' }}>
                Calculate long-term compounding projection. Slide the inputs to render a glowing SVG compound curve and see projected returns.
              </p>
              
              <div className="growth-grid">
                <div className="growth-sliders">
                  <div className="flavor-slider-item">
                    <div className="flavor-slider-label">
                      <span>Monthly Invest</span>
                      <span style={{ color: 'var(--color-emerald)', fontWeight: 'bold' }}>${monthlyInvest}</span>
                    </div>
                    <input 
                      type="range" 
                      min="50" 
                      max="2000" 
                      step="50"
                      value={monthlyInvest} 
                      onChange={(e) => setMonthlyInvest(parseInt(e.target.value))}
                      className="custom-range-slider"
                      aria-label="Monthly investment"
                    />
                  </div>
                  
                  <div className="flavor-slider-item">
                    <div className="flavor-slider-label">
                      <span>Annual Return</span>
                      <span style={{ color: 'var(--color-emerald)', fontWeight: 'bold' }}>{returnRate}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="4" 
                      max="25" 
                      value={returnRate} 
                      onChange={(e) => setReturnRate(parseInt(e.target.value))}
                      className="custom-range-slider"
                      aria-label="Annual return rate"
                    />
                  </div>
                  
                  <div className="flavor-slider-item">
                    <div className="flavor-slider-label">
                      <span>Duration Period</span>
                      <span style={{ color: 'var(--color-emerald)', fontWeight: 'bold' }}>{compoundYears} Years</span>
                    </div>
                    <input 
                      type="range" 
                      min="5" 
                      max="40" 
                      value={compoundYears} 
                      onChange={(e) => setCompoundYears(parseInt(e.target.value))}
                      className="custom-range-slider"
                      aria-label="Compound years"
                    />
                  </div>
                </div>
                
                <div className="growth-chart-box">
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>
                    <span>Compounded Wealth</span>
                    <span>{compoundYears} Yrs</span>
                  </div>
                  
                  {/* Glowing Compound SVG Line Chart */}
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ height: '110px', width: '100%', margin: '10px 0' }}>
                    <defs>
                      <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-emerald)" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="var(--color-emerald)" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path d={compoundPaths.areaPath} className="svg-chart-fill" />
                    <path d={compoundPaths.linePath} className="svg-chart-path" />
                  </svg>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '10px' }}>
                    <div>
                      <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Total Invested</p>
                      <p style={{ fontSize: '14px', fontWeight: 'bold', color: 'white' }}>${getCompoundInvestedVal().toLocaleString()}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Projected Wealth</p>
                      <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>${getCompoundProjectedVal().toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeCard === 'journey' && (
          <div className="interactive-card glass-panel" style={{ '--accent-color': 'var(--color-blue)' }}>
            <div className="card-header">
              <div className="card-title-group">
                <div className="card-icon-wrapper"><JourneyIcon /></div>
                <div>
                  <h2 className="card-title">My Documented Story</h2>
                  <p className="card-subtitle">Interactive Career Timeline</p>
                </div>
              </div>
              <button 
                type="button"
                className="card-close-btn" 
                onClick={() => { playSoundEffect(); setActiveCard(null); }}
                aria-label="Close panel"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="card-content">
              {/* Interactive Timeline Track */}
              <div className="timeline-track">
                {Object.keys(TIMELINE_DATA).map(year => (
                  <button
                    key={year}
                    type="button"
                    className={`timeline-node-btn ${selectedTimelineYear === parseInt(year) ? 'active' : ''}`}
                    onClick={() => {
                      playSoundEffect();
                      setSelectedTimelineYear(parseInt(year));
                    }}
                    aria-label={`Timeline year ${year}`}
                  >
                    {year}
                  </button>
                ))}
              </div>
              
              {/* Detailed Timeline Era Card */}
              <div className="timeline-content-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>{TIMELINE_DATA[selectedTimelineYear].title}</h3>
                  <span style={{ fontSize: '12px', color: 'var(--color-blue)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>{selectedTimelineYear}</span>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px', fontWeight: '600' }}>
                  {TIMELINE_DATA[selectedTimelineYear].subtitle}
                </p>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginTop: '12px', lineHeight: '1.6' }}>
                  {TIMELINE_DATA[selectedTimelineYear].desc}
                </p>
                
                <div style={{ marginTop: '16px', background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)', padding: '12px 16px', borderRadius: '8px' }}>
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Key Milestone</p>
                  <p style={{ fontSize: '12px', color: 'white', marginTop: '2px', fontWeight: '600' }}>{TIMELINE_DATA[selectedTimelineYear].achievement}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER WIDGETS & POP-UPS */}
      <footer className="footer-bar">
        {/* Left widget: LeetCode Streak */}
        <div style={{ position: 'relative' }}>
          <button 
            type="button"
            className="footer-widget glass-panel leetcode-widget" 
            onClick={() => {
              playSoundEffect();
              setActiveWidget(activeWidget === 'leetcode' ? null : 'leetcode');
            }}
            style={{ border: 'none', background: 'none' }}
          >
            <div className="widget-left"><Flame size={16} fill="currentColor" /></div>
            <div className="widget-text">
              <span className="widget-title">LeetCode Streak</span>
              <span className="widget-value">{habitStreak} Days</span>
            </div>
          </button>

          {activeWidget === 'leetcode' && (
            <div className="popover-widget-card left-side">
              <div className="popover-header">
                <span className="popover-title">Streak Verified</span>
                <button type="button" style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }} onClick={() => setActiveWidget(null)} aria-label="Close widget">
                  <X size={12} />
                </button>
              </div>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.4' }}>
                My problem solving engine is fully active! 112 consecutive days of grinding algorithms and data structures on Leetcode.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: '12px', fontSize: '11px', color: '#ff9900', fontWeight: '600' }}>
                <Sparkles size={12} />
                <span>Top 4.2% of global coders</span>
              </div>
            </div>
          )}
        </div>

        {/* Right widget: Daily Focus & Checklist */}
        <div style={{ position: 'relative' }}>
          <button 
            type="button"
            className="footer-widget glass-panel focus-widget" 
            onClick={() => {
              playSoundEffect();
              setActiveWidget(activeWidget === 'focus' ? null : 'focus');
            }}
            style={{ border: 'none', background: 'none' }}
          >
            <div className="widget-left"><Target size={16} /></div>
            <div className="widget-text">
              <span className="widget-title">Current Focus</span>
              <span className="widget-value">Become 1% Better</span>
            </div>
          </button>

          {activeWidget === 'focus' && (
            <div className="popover-widget-card right-side">
              <div className="popover-header">
                <span className="popover-title">Daily Habit Engine</span>
                <button type="button" style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }} onClick={() => setActiveWidget(null)} aria-label="Close widget">
                  <X size={12} />
                </button>
              </div>
              <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Check off habits to compound your streak!</p>
              
              <div className="habit-checklist">
                <button 
                  type="button"
                  className={`habit-item ${checkedHabits.code ? 'completed' : ''}`}
                  onClick={() => toggleHabit('code')}
                  style={{ background: 'none', border: 'none', textDecoration: 'none' }}
                >
                  <div className="habit-checkbox">{checkedHabits.code && <Check size={10} />}</div>
                  <span>LeetCode daily practice</span>
                </button>
                <button 
                  type="button"
                  className={`habit-item ${checkedHabits.read ? 'completed' : ''}`}
                  onClick={() => toggleHabit('read')}
                  style={{ background: 'none', border: 'none', textDecoration: 'none' }}
                >
                  <div className="habit-checkbox">{checkedHabits.read && <Check size={10} />}</div>
                  <span>Read 10 pages self dev</span>
                </button>
                <button 
                  type="button"
                  className={`habit-item ${checkedHabits.meditate ? 'completed' : ''}`}
                  onClick={() => toggleHabit('meditate')}
                  style={{ background: 'none', border: 'none', textDecoration: 'none' }}
                >
                  <div className="habit-checkbox">{checkedHabits.meditate && <Check size={10} />}</div>
                  <span>10 mins Zen meditation</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </footer>

    </div>
  );
}

export default App;

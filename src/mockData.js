// MOCK DATA FOR GIRIDHAR U'S CINEMATIC PORTFOLIO OS

export const profileData = {
  name: "GIRIDHAR U",
  subtitle: "Engineer • Creator • Builder",
  description: "Documenting my journey through technology, creativity, nature, discipline, and ambition.",
  focus: "Next-Gen Software & Tech Venture",
  entrepreneurialPillars: "High Tech, Culinary Culture, Automation",
  discipline: "100% Daily Output & Streaks",
  status: "Ready to Build",
  bio: [
    "Hello. I am Giridhar, an ambitious builder working at the convergence of high-level software engineering, system architecture, digital art, and creative entrepreneurship.",
    "Through disciplined engineering and a restless curiosity, I create software platforms, capture raw visual landscapes, express auditory art, and design future ventures."
  ],
  timeline: [
    { year: "PRESENT", title: "Software Architect & Builder", description: "Developing rich web systems, complex algorithmic APIs, and laying the groundwork for digital food startups." },
    { year: "2025", title: "GitHub & LeetCode Streak Champion", description: "Achieved massive code consistency thresholds, solving advanced DSA algorithms and building responsive open-source utilities." },
    { year: "2024", title: "Creative Visualizer & Vocal Artist", description: "Documented vast mountain ranges and water basins on high-exposure film, establishing a unified creative signature across music and photography." },
    { year: "INIT", title: "Core Engineering Foundations", description: "Began a deep exploration into data structures, computing principles, human psychology, and business scalability models." }
  ]
};

export const codingData = {
  streak: "300+",
  totalSolved: 832,
  maxStreak: 324,
  runtimePercentile: "99.2%",
  categories: [
    { label: "Solved Problems", value: "800+" },
    { label: "Balanced Mastery", value: "Easy/Med/Hard" },
    { label: "Runtime Percentile", value: "99.2%" },
    { label: "Max LeetCode Streak", value: "324 Days" }
  ],
  codeSnippets: {
    cpp: `// Optimized Peak Finding Algorithm in Logarithmic Time
#include <vector>
#include <iostream>

class ConsistentDeveloper {
public:
    int findPeakIndex(const std::vector<int>& array) {
        int low = 0;
        int high = array.size() - 1;
        
        while (low < high) {
            int mid = low + (high - low) / 2;
            if (array[mid] < array[mid + 1]) {
                low = mid + 1; // Peak is on the right
            } else {
                high = mid;    // Peak is on the left or is mid
            }
        }
        return low;
    }
};

int main() {
    ConsistentDeveloper builder;
    std::vector<int> path = {1, 3, 8, 12, 7, 4, 2};
    std::cout << "Peak elevation index: " 
              << builder.findPeakIndex(path) << std::endl;
    return 0;
}`,
    js: `// Premium Neomorphic Card Tilt Engine
export default class AntiGravityTilt {
  constructor(element, intensity = 15) {
    this.el = element;
    this.intensity = intensity;
    this.init();
  }

  init() {
    this.el.addEventListener('mousemove', (e) => this.onMove(e));
    this.el.addEventListener('mouseleave', () => this.onLeave());
  }

  onMove(e) {
    const rect = this.el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    this.el.style.transform = \`
      perspective(1000px) 
      rotateY(\${x * this.intensity}deg) 
      rotateX(\${-y * this.intensity}deg) 
      scale3d(1.02, 1.02, 1.02)
    \`;
  }
}`
  },
  terminalOutputs: {
    help: `Available CLI Commands:
- <span class="text-gold">skills</span>   : Displays specialized skill architecture level meters.
- <span class="text-gold">streak</span>   : Renders LeetCode consistency streak statistics.
- <span class="text-gold">github</span>   : Simulates dynamic repository commit check triggers.
- <span class="text-gold">about</span>    : Displays developer bio parameters.
- <span class="text-gold">matrix</span>   : Triggers full console screen buffer diagnostics matrix.
- <span class="text-gold">clear</span>    : Wipes the console logs clean.`,
    skills: `C++ Engineering   [■■■■■■■■■□] 92% // Master
Python Automation [■■■■■■■■■□] 90% // Senior
Javascript / Node [■■■■■■■■□□] 85% // Senior
Cloud Systems/SQL [■■■■■■■■□□] 80% // Advanced
UI Art Plating    [■■■■■■■■■□] 90% // Artisan`,
    streak: `<span class="text-gold">*** LEETCODE SYSTEM STATUS ***</span>
Streak Length: 324 Consecutive Days
Solved: 832 Total Problems (145 Hard, 432 Medium, 255 Easy)
Consistency Factor: Excellent (Top 1.2% Globally)`,
    github: `Simulating fetch of 'github.com/giridhar-u' modules...
Connected to server. API validation success.
Loading commit tree...
[████████████████████████████████] 100% OK
2,481 Contributions detected this year.
Last push: 42 minutes ago (ref: main/build_main.cpp)`,
    about: `Giridhar U
Role      : Software Architect, Creator & Ambition Builder
Aesthetic : Warm Luxury Neomorphic Dark Mode
Motto     : 'Solving problems daily. Building consistency through code.'`,
    matrix: `INITIALIZING MATRIX SCREEN DIAGNOSTIC PIPELINE...
01000111 01001001 01010010 01001001 01000100 01001000 01000001 01010018
01010011 01011001 01010011 01010100 01000101 01001101 01011111 01001111
SAGE_RESET_READY: TRUE // COMPILING IDE COMPLETED WITH ZERO ERRORS.`
  }
};

export const photographyData = {
  hardware: {
    body: "Mirrorless Alpha Prime",
    glass: "50mm f/1.2 & 24-70mm f/2.8",
    location: "River Valleys, Mountain Passes"
  },
  gallery: [
    {
      id: 1,
      image: "/photography_nature.png",
      title: "SERIES I: 'GLACIAL SILENCE'",
      coordinates: "32.7758° N, 77.5912° E"
    },
    {
      id: 2,
      image: "/food_luxury.png",
      title: "SERIES II: 'CHEF PLATING'",
      coordinates: "12.9716° N, 77.5946° E"
    }
  ]
};

export const natureData = {
  sounds: [
    { id: "rain", label: "MOUNTAIN RAIN", icon: "fa-solid fa-cloud-showers-heavy", defaultVolume: 65 },
    { id: "river", label: "FLOWING STREAM", icon: "fa-solid fa-water", defaultVolume: 40 },
    { id: "wind", label: "SAGE WINDFIELD", icon: "fa-solid fa-wind", defaultVolume: 50 },
    { id: "birds", label: "FOREST BIRDSONG", icon: "fa-solid fa-dove", defaultVolume: 25 }
  ],
  quote: "“Look deep into nature, and then you will understand everything better.”",
  author: "Albert Einstein"
};

export const musicData = {
  trackTitle: "Acoustic Resonance // Giridhar U",
  trackArtist: "Live Session - Raw Vocal Cut",
  lyrics: [
    { time: 0, text: "♫ (Intro - Smooth Acoustic Resonance)" },
    { time: 25, text: "Lost in equations, compiling the night..." },
    { time: 50, text: "But my voice rises free, to the gold-colored light..." },
    { time: 75, text: "Singing is my escape, where the structures align..." },
    { time: 90, text: "A melodic frequency, frozen in time. ♫" }
  ]
};

export const foodData = {
  brandName: "GASTROBYTE",
  brandTag: "Food Culture x Tech",
  longDescription: "An elite private club kitchen fusing neomorphic user interfaces with artisanal ingredient selection. Utilizing digital kitchen pipelines to customize flavor profiles and presentation dynamics for modern palettes.",
  pillars: [
    { id: "01", title: "SENSORY ARCHITECTURE", text: "Harmonizing ambient light, plating geometry, and texture profiles to orchestrate unforgettable culinary moments." },
    { id: "02", title: "LOGISTICAL AUTOMATION", text: "Integrating customized supply chain networks to ensure direct, ultra-fresh delivery from micro-farms to the service table." }
  ],
  mixPills: [
    { id: "d-tech", label: "Advanced Code & AI" },
    { id: "d-plate", label: "Luxury Art Plating" },
    { id: "d-farm", label: "Farm-To-Fork Sourcing" },
    { id: "d-cloud", label: "Cloud Kitchen Robotics" }
  ]
};

export const entrepreneurData = {
  chartPoints: [
    { pctX: 0, pctY: 84, label: "Init", value: "$10k Vol" },
    { pctX: 18, pctY: 75, label: "Seed", value: "$45k Vol" },
    { pctX: 36, pctY: 59, label: "API Launch", value: "$150k Traction" },
    { pctX: 54, pctY: 66, label: "Consolidation", value: "$220k Pool" },
    { pctX: 72, pctY: 34, label: "Automation Scale", value: "$850k Leverage" },
    { pctX: 90, pctY: 11, label: "Startup Valuation Target", value: "$3.5M+ Valuation" }
  ],
  mindmapNodes: [
    { id: "node-tech", text: "SAAS", color: "#6366f1", cx: 100, cy: 60, details: "Software SaaS solutions, open-source APIs, automated cloud services. Maximum engineering leverage." },
    { id: "node-food", text: "FOOD TECH", color: "#e07a5f", cx: 300, cy: 60, details: "Hospitality brands integrated with delivery systems and digital food profiling. Fusing gastronomy with software." },
    { id: "node-capital", text: "WEALTH", color: "#50b47b", cx: 100, cy: 180, details: "Asset investments, growth funds, cash-flow pipelines. Building massive compounding leverage." },
    { id: "node-media", text: "CREATIVE", color: "#d4af37", cx: 300, cy: 180, details: "Visual channels, photography networks, acoustic libraries. Owning distribution and audience attention." }
  ],
  roadmap: [
    { title: "Bootstrap a B2B SaaS Utility", status: "Active Dev", type: "in-progress" },
    { title: "100k+ Algorithmic Solves Community", status: "Done", type: "completed" },
    { title: "Launch GastroByte Automated Kitchen Concept", status: "Designing", type: "planned" }
  ]
};

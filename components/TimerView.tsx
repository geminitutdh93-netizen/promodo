import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, X, TreePine, TreeDeciduous, Plus, AlertTriangle, Check, Trophy, ListTodo, CheckCircle2, Circle, Sprout, Cloud, Settings2 } from 'lucide-react';
import { TreeType, Tag, Tree, Task } from '../types';
import { TREE_TYPES, MOTIVATIONAL_QUOTES, DEFAULT_DURATION } from '../constants';

interface TimerViewProps {
  tags: Tag[];
  trees: Tree[]; 
  tasks: Task[];
  onAddTag: (tag: Tag) => void;
  onAddTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onSessionComplete: (duration: number, tag: Tag, type: TreeType, taskId?: string) => void;
  onSessionFail: (duration: number, tag: Tag, type: TreeType) => void;
}

const PRESET_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16', 
  '#10b981', '#06b6d4', '#3b82f6', '#6366f1', 
  '#8b5cf6', '#d946ef', '#f43f5e', '#78716c'
];

// --- SOLAR SYSTEM ANIMATION (Fully Scalable) ---
const SolarSystem = ({ isActive }: { isActive: boolean }) => {
  return (
    <div className="relative w-full h-full">
      {/* Sun */}
      <div className={`absolute inset-0 m-auto w-[18%] h-[18%] rounded-full bg-gradient-to-br from-amber-400 to-orange-600 shadow-[0_0_30px_rgba(245,158,11,0.6)] z-10 ${isActive ? 'animate-pulse-slow' : 'animate-pulse-very-slow'}`}>
         <div className="absolute inset-0 bg-white/20 rounded-full blur-[2px]"></div>
      </div>

      {/* Orbits & Planets - Using inset-0 m-auto for perfect centering of absolute elements */}
      
      {/* Mercury */}
      <div className={`absolute inset-0 m-auto w-[30%] h-[30%] rounded-full border border-slate-600/20 animate-spin-orbit`} style={{ animationDuration: isActive ? '4s' : '60s' }}>
         <div className="absolute top-0 left-1/2 w-[12%] h-[12%] bg-stone-400 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-sm"></div>
      </div>

      {/* Venus */}
      <div className={`absolute inset-0 m-auto w-[45%] h-[45%] rounded-full border border-slate-600/20 animate-spin-orbit`} style={{ animationDuration: isActive ? '7s' : '90s' }}>
         <div className="absolute top-0 left-1/2 w-[10%] h-[10%] bg-orange-300 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-sm"></div>
      </div>

      {/* Earth */}
      <div className={`absolute inset-0 m-auto w-[62%] h-[62%] rounded-full border border-slate-600/20 animate-spin-orbit`} style={{ animationDuration: isActive ? '12s' : '160s' }}>
         <div className="absolute top-0 left-1/2 w-[9%] h-[9%] bg-blue-500 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-sm overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-green-400/40 rounded-full transform scale-75 translate-x-0.5 translate-y-0.5"></div>
         </div>
         {/* Moon */}
         <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[15%] h-[15%] animate-spin-orbit`} style={{ animationDuration: isActive ? '2s' : '20s' }}>
            <div className="absolute top-0 left-1/2 w-[25%] h-[25%] bg-slate-400 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
         </div>
      </div>

      {/* Mars */}
      <div className={`absolute inset-0 m-auto w-[80%] h-[80%] rounded-full border border-slate-600/20 animate-spin-orbit`} style={{ animationDuration: isActive ? '16s' : '220s' }}>
         <div className="absolute top-0 left-1/2 w-[7%] h-[7%] bg-red-500 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-sm"></div>
      </div>
      
      <style>{`
        @keyframes spin-orbit { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-orbit { animation: spin-orbit linear infinite; }
        .animate-pulse-slow { animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        .animate-pulse-very-slow { animation: pulse 10s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      `}</style>
    </div>
  );
};

// --- ZEN BACKGROUND ---
const ZenBackground = ({ isActive }: { isActive: boolean }) => {
  // Generate dust particles for idle state
  const particles = useMemo(() => Array.from({ length: 25 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 5,
    duration: 15 + Math.random() * 10,
  })), []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden bg-[#f4f1ea] transition-colors duration-[2000ms]">
      <style>{`
        @keyframes breathe { 
          0%, 100% { transform: translateY(0); } 
          50% { transform: translateY(-8px); } 
        }
        @keyframes sunbeam-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes dust-float {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
          20% { opacity: 0.6; }
          50% { transform: translate(20px, -20px) rotate(45deg); opacity: 0.3; }
          80% { opacity: 0.6; }
          100% { transform: translate(-10px, -40px) rotate(90deg); opacity: 0; }
        }
        .animate-breathe { animation: breathe 12s ease-in-out infinite; }
        .animate-breathe-delayed { animation: breathe 15s ease-in-out infinite; animation-delay: 2s; }
        .animate-sunbeam { animation: sunbeam-spin 120s linear infinite; }
        .animate-dust { animation: dust-float linear infinite; }
      `}</style>

      {/* Paper Texture */}
      <div className="absolute inset-0 opacity-50 mix-blend-multiply" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E")` }}></div>
      
      {/* Rotating Sunbeams (Subtle) */}
      <div className={`absolute top-[-50%] left-[-50%] w-[200%] h-[200%] opacity-30 animate-sunbeam transition-opacity duration-1000 ${isActive ? 'opacity-0' : 'opacity-40'}`}>
         <div className="w-full h-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(251,191,36,0.1)_15deg,transparent_30deg,rgba(251,191,36,0.1)_45deg,transparent_60deg)]" />
      </div>

      {/* Vintage Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.1)_100%)]" />

      {/* Dust Particles (Idle only) */}
      {!isActive && (
        <div className="absolute inset-0 z-0">
          {particles.map(p => (
            <div 
              key={p.id}
              className="absolute rounded-full bg-amber-300/40 blur-[0.5px] animate-dust"
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Far Mountains - Faded Ink */}
      <div className={`absolute bottom-[10%] left-0 w-[120%] h-[50%] text-slate-400/30 transition-transform duration-[20s] ease-linear ${isActive ? 'translate-x-[-50px]' : 'animate-breathe'}`}>
         <svg viewBox="0 0 1440 320" className="w-full h-full" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,181.3C672,171,768,181,864,197.3C960,213,1056,235,1152,224C1248,213,1344,171,1392,149.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
         </svg>
      </div>

      {/* Near Mountains - Dark Ink */}
      <div className={`absolute bottom-0 left-[-10%] w-[130%] h-[40%] text-slate-600/60 transition-transform duration-[10s] ease-linear ${isActive ? 'translate-x-[-100px]' : 'animate-breathe-delayed'}`}>
         <svg viewBox="0 0 1440 320" className="w-full h-full" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,224L60,213.3C120,203,240,181,360,186.7C480,192,600,224,720,229.3C840,235,960,213,1080,192C1200,171,1320,149,1380,138.7L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
         </svg>
      </div>

      {/* Clouds - Stylized */}
      <div className="absolute top-12 left-8 text-slate-400/40 animate-drift">
          <Cloud size={140} fill="currentColor" stroke="none" className="filter blur-[1px]" />
      </div>
      <div className="absolute top-24 right-12 text-slate-400/30 animate-drift" style={{ animationDelay: '5s', animationDuration: '15s' }}>
          <Cloud size={100} fill="currentColor" stroke="none" className="filter blur-[2px]" />
      </div>
    </div>
  );
};

const MagicalRainOverlay = () => {
  const drops = useMemo(() => Array.from({ length: 60 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 1.5,
    duration: 0.6 + Math.random() * 0.5,
    height: 30 + Math.random() * 50,
    color: Math.random() > 0.5 ? '#10b981' : '#f59e0b' // Emerald and Amber rain
  })), []);

  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
       {drops.map(drop => (
         <div 
           key={drop.id}
           className="absolute top-[-50%] w-[2px] rounded-full animate-rain-fall opacity-60"
           style={{
             left: `${drop.left}%`,
             height: `${drop.height}%`,
             backgroundColor: drop.color,
             animationDelay: `${drop.delay}s`,
             animationDuration: `${drop.duration}s`,
           }}
         />
       ))}
    </div>
  );
};

// --- Realistic Growing Tree Component ---
const RealisticTree = ({ progress, type, color }: { progress: number, type: TreeType, color: string }) => {
  const p = Math.max(0, Math.min(1, progress));
  const growth = Math.max(0, (p - 0.05) / 0.95); 
  const easeOutBack = (x: number) => 1 + 2.70158 * Math.pow(x - 1, 3) + 1.70158 * Math.pow(x - 1, 2);
  const scale = easeOutBack(Math.min(1, growth + 0.1)); 

  return (
    <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible drop-shadow-md">
        <circle cx="100" cy="180" r={25 * scale} fill="#000" opacity="0.1" filter="blur(4px)" />
        <g transform="translate(100, 180) scale(1, -1)">
             <path d={`M -2 0 L -2 ${80*growth} L 2 ${80*growth} L 2 0 Z`} fill="#3f3f46" />
             <circle cx="0" cy={80*growth} r={30*growth} fill={color} opacity="0.9" />
        </g>
    </svg>
  );
};

// --- Main Component ---

const TimerView: React.FC<TimerViewProps> = ({ tags, trees, tasks, onAddTag, onAddTask, onDeleteTask, onSessionComplete, onSessionFail }) => {
  const [duration, setDuration] = useState(DEFAULT_DURATION);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_DURATION * 60);
  const [isActive, setIsActive] = useState(false);
  const [showRain, setShowRain] = useState(false); 
  const [selectedTag, setSelectedTag] = useState<Tag>(tags[0]);
  const [selectedTreeType, setSelectedTreeType] = useState<TreeType>(TreeType.OAK);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [quote, setQuote] = useState(MOTIVATIONAL_QUOTES[0]);
  
  const [showGiveUpModal, setShowGiveUpModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectColor, setNewProjectColor] = useState(PRESET_COLORS[4]);
  const [newProjectGoal, setNewProjectGoal] = useState(4);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskGoal, setNewTaskGoal] = useState(1);

  const timerRef = useRef<number | null>(null);

  useEffect(() => { setSelectedTaskId(null); }, [selectedTag]);

  const dailyProgress = useMemo(() => {
    if (!selectedTag) return { current: 0, goal: 4 };
    const todayStart = new Date().setHours(0, 0, 0, 0);
    const todayCount = trees.filter(t => t.tagId === selectedTag.id && t.createdAt >= todayStart).length;
    return { current: todayCount, goal: selectedTag.dailyGoal || 4 };
  }, [trees, selectedTag]);

  const currentProjectTasks = useMemo(() => tasks.filter(t => t.tagId === selectedTag?.id), [tasks, selectedTag]);

  useEffect(() => { if (!selectedTag && tags.length > 0) setSelectedTag(tags[0]); }, [tags, selectedTag]);
  useEffect(() => { if (!isActive) setTimeLeft(duration * 60); }, [duration, isActive]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (isActive && timeLeft === 0) {
      completeSession();
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive, timeLeft]);

  const startTimer = () => {
    setIsActive(true);
    setQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
    setShowRain(true);
    setTimeout(() => { setShowRain(false); }, 3500);
  };

  const completeSession = () => {
    setIsActive(false);
    onSessionComplete(duration, selectedTag, selectedTreeType, selectedTaskId || undefined);
    setTimeLeft(duration * 60);
  };

  const handleGiveUpClick = () => setShowGiveUpModal(true);
  const cancelGiveUp = () => setShowGiveUpModal(false);
  const confirmGiveUp = () => {
    setShowGiveUpModal(false);
    setIsActive(false);
    onSessionFail(duration, selectedTag, selectedTreeType);
    setTimeLeft(duration * 60);
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      const newTag: Tag = { id: Date.now().toString(), name: newProjectName.trim(), color: newProjectColor, dailyGoal: newProjectGoal };
      onAddTag(newTag);
      setSelectedTag(newTag);
      setShowProjectModal(false);
      setNewProjectName('');
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskName.trim() && selectedTag) {
        const newTask: Task = { id: Date.now().toString(), tagId: selectedTag.id, name: newTaskName.trim(), dailyGoal: newTaskGoal };
        onAddTask(newTask);
        setShowTaskModal(false);
        setNewTaskName('');
        setSelectedTaskId(newTask.id);
    }
  };

  const totalSeconds = duration * 60;
  const progressPct = totalSeconds > 0 ? ((totalSeconds - timeLeft) / totalSeconds) : 0; 
  // SVG Radius and Circumference for progress ring
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPct) * circumference;
  
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isNearCompletion = isActive && progressPct > 0.9;

  return (
    <div className="h-full w-full flex flex-col items-center justify-between p-4 overflow-hidden bg-[#f4f1ea] text-slate-800 relative">
      <style>{`
        @keyframes rain-fall {
            0% { transform: translateY(0) scaleY(1); opacity: 0; }
            10% { opacity: 0.8; }
            100% { transform: translateY(100vh) scaleY(1.5); opacity: 0; }
        }
        .animate-rain-fall { animation: rain-fall linear infinite; }
        @keyframes heartbeat {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.02); opacity: 0.95; }
        }
        .animate-heartbeat { animation: heartbeat 1.5s ease-in-out infinite; }
      `}</style>

      <ZenBackground isActive={isActive} />
      {showRain && <MagicalRainOverlay />}

      {/* TOP SECTION: Status & Tree Selector */}
      <div className="relative z-20 w-full max-w-xl flex flex-col items-center space-y-4 mt-2 flex-shrink-0 transition-all duration-300">
         {/* Goal Pill */}
         <div className="bg-[#27272a] text-slate-200 px-6 py-2.5 rounded-full flex items-center gap-4 shadow-2xl border border-slate-700/50 hover:scale-105 transition-transform">
            <Trophy size={16} className="text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-[0.15em]">Work: <span className="text-emerald-400 ml-1">{dailyProgress.current}/{dailyProgress.goal}</span></span>
            <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (dailyProgress.current / dailyProgress.goal) * 100)}%` }} />
            </div>
         </div>

         {/* Tree Selector */}
         <div className="flex space-x-4 pt-2">
            {TREE_TYPES.map((type) => (
                 <button
                   key={type}
                   disabled={isActive}
                   onClick={() => setSelectedTreeType(type)}
                   className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-2xl transition-all duration-300 border-2 ${selectedTreeType === type ? 'bg-[#27272a] border-emerald-500 text-emerald-400 shadow-lg transform scale-110' : 'bg-white/60 border-transparent text-slate-500 hover:bg-white hover:text-slate-700'}`}
                 >
                   {type === TreeType.PINE ? <TreePine size={20} strokeWidth={1.5} /> : type === TreeType.BAMBOO ? <Sprout size={20} strokeWidth={1.5} /> : <TreeDeciduous size={20} strokeWidth={1.5} />}
                 </button>
            ))}
            <button className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-2xl bg-white/60 text-slate-500 hover:bg-white transition-colors">
                <Settings2 size={20} strokeWidth={1.5} />
            </button>
         </div>
      </div>

      {/* MIDDLE SECTION: Timer Ring & Solar System (SCALES ARBITRARILY) */}
      {/* Uses vh units to scale with window height, keeping aspect square */}
      <div className="relative z-10 flex-grow flex items-center justify-center w-full overflow-hidden p-4">
          <div className={`relative h-[40vh] md:h-[50vh] lg:h-[55vh] max-h-[800px] aspect-square transition-all duration-500 ${isNearCompletion ? 'animate-heartbeat' : ''}`}>
             {/* Ring */}
             <svg viewBox="0 0 340 340" className="absolute inset-0 w-full h-full transform -rotate-90 overflow-visible">
                <defs>
                  <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" className="transition-[stop-color] duration-[3000ms]" stopColor={isActive ? (progressPct > 0.6 ? "#f59e0b" : "#0d9488") : "#0d9488"} /> 
                    <stop offset="100%" className="transition-[stop-color] duration-[3000ms]" stopColor={isActive ? (progressPct > 0.85 ? "#f43f5e" : (progressPct > 0.4 ? "#14b8a6" : "#f59e0b")) : "#f59e0b"} />
                  </linearGradient>
                  <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
                    <feGaussianBlur stdDeviation={isActive ? 3 + (progressPct * 8) : 2} result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                
                {/* Track */}
                <circle cx="170" cy="170" r={radius} stroke="rgba(0,0,0,0.03)" strokeWidth="4" fill="rgba(255,255,255,0.2)" className="backdrop-blur-sm" />
                
                {/* Progress */}
                <circle 
                    cx="170" cy="170" r={radius} 
                    stroke={isActive ? "url(#ringGradient)" : selectedTag.color} 
                    fill="transparent" 
                    strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" 
                    className="transition-all duration-1000 ease-linear drop-shadow-lg"
                    filter={isActive ? "url(#glow)" : ""}
                    style={{
                        strokeWidth: isActive ? 12 + (progressPct * 4) : 12, // Thicken slightly as it grows
                        transition: 'stroke-dashoffset 1s linear, stroke-width 1s ease-out'
                    }}
                />
             </svg>

             {/* Content Inside Ring */}
             <div className="absolute inset-0 flex items-center justify-center z-20">
                 {/* Solar System Animation - Centered and Scaled */}
                 <div className="relative w-[75%] h-[75%] pointer-events-none">
                     <SolarSystem isActive={isActive} />
                 </div>
                 
                 {/* Time Display & Controls - Overlay on top, centered */}
                 <div className="absolute inset-0 flex flex-col items-center justify-center z-30">
                    {isActive ? (
                       <div className="flex flex-col items-center">
                           {/* Scalable Font using vh units relative to container size approximation */}
                           <span className="font-black text-slate-900 font-mono tracking-tighter drop-shadow-sm bg-white/40 backdrop-blur-sm rounded-xl px-4" style={{ fontSize: '10vh' }}>{formatTime(timeLeft)}</span>
                           <div className="mt-4 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full border border-slate-200 text-xs md:text-sm font-bold text-slate-600 max-w-[220px] text-center shadow-md">
                               {quote}
                           </div>
                       </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        {/* Scalable Font for idle state */}
                        <span className="font-black text-slate-800 font-mono tracking-tighter drop-shadow-sm mix-blend-multiply transition-all duration-300" style={{ fontSize: '12vh' }}>{duration}</span>
                        <div className="flex items-center gap-8 mt-2 pointer-events-auto">
                           <button onClick={() => setDuration(Math.max(10, duration - 5))} className="w-12 h-12 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold flex items-center justify-center transition-colors shadow-sm text-2xl pb-1">-</button>
                           <button onClick={() => setDuration(Math.min(120, duration + 5))} className="w-12 h-12 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold flex items-center justify-center transition-colors shadow-sm text-2xl pb-1">+</button>
                        </div>
                      </div>
                    )}
                 </div>
             </div>
             
             {/* Growing Tree Preview */}
             {isActive && (
                 <div className="absolute bottom-[12%] left-1/2 transform -translate-x-1/2 w-[15%] h-[15%] z-30">
                     <RealisticTree progress={progressPct} type={selectedTreeType} color={selectedTag.color} />
                 </div>
             )}
          </div>
      </div>

      {/* BOTTOM SECTION: Tags, Tasks, Plant Button */}
      <div className="relative z-30 w-full max-w-xl flex flex-col items-center space-y-4 mb-2 flex-shrink-0">
        {!isActive ? (
         <>
             {/* Tags Row */}
             <div className="flex flex-wrap justify-center gap-2 px-2 max-h-[20vh] overflow-y-auto scrollbar-hide">
                {tags.map(tag => (
                  <button key={tag.id} onClick={() => setSelectedTag(tag)} 
                    className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-300 border ${selectedTag?.id === tag.id ? 'bg-[#27272a] text-white border-transparent shadow-lg scale-105' : 'bg-white/50 text-slate-500 border-slate-200 hover:bg-white'}`}>
                    {tag.name}
                  </button>
                ))}
                <button onClick={() => setShowProjectModal(true)} className="w-8 h-8 rounded-full bg-white/50 text-slate-500 border border-slate-200 flex items-center justify-center hover:bg-white"><Plus size={16} /></button>
             </div>
             
             {/* Dark Task Card */}
             <div className="w-full bg-[#0f172a] text-slate-200 rounded-3xl p-4 shadow-2xl border border-slate-800 relative overflow-hidden transition-all hover:shadow-emerald-900/20">
                 {/* Subtle grid pattern for tech feel */}
                 <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                 
                 <div className="relative z-10 flex justify-between items-center mb-3 border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2"><ListTodo size={16} className="text-slate-400" /><span className="text-xs font-extrabold tracking-[0.2em] text-slate-500">TASKS</span></div>
                    <button onClick={() => setShowTaskModal(true)} className="text-xs font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-900/30 px-3 py-1 rounded-full">Create Task</button>
                 </div>
                 <div className="relative z-10 space-y-2 max-h-20 overflow-y-auto scrollbar-hide">
                     {currentProjectTasks.length > 0 ? currentProjectTasks.map(task => (
                         <div key={task.id} onClick={() => setSelectedTaskId(selectedTaskId === task.id ? null : task.id)} 
                              className={`flex items-center justify-between p-2.5 rounded-2xl cursor-pointer transition-all border ${selectedTaskId === task.id ? 'bg-slate-800 border-emerald-500/50 shadow-lg' : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800'}`}>
                            <div className="flex items-center gap-3">
                                {selectedTaskId === task.id ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Circle size={16} className="text-slate-600" />}
                                <span className={`text-sm font-medium ${selectedTaskId === task.id ? 'text-white' : 'text-slate-400'}`}>{task.name}</span>
                            </div>
                            <span className="text-xs text-slate-600 font-mono bg-slate-900 px-2 py-0.5 rounded-md">0/{task.dailyGoal}</span>
                         </div>
                     )) : (
                         <div className="text-center py-2 text-slate-600 text-sm italic flex flex-col items-center gap-1">
                             <Circle size={18} className="opacity-20" />
                             <span>No active tasks</span>
                         </div>
                     )}
                 </div>
             </div>

             {/* Plant Button */}
             <button onClick={startTimer} className="w-full group relative flex items-center justify-center bg-gradient-to-r from-teal-500 to-emerald-600 text-white py-4 rounded-[2rem] font-black text-xl shadow-[0_10px_40px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_20px_50px_-10px_rgba(16,185,129,0.6)] hover:scale-[1.02] transition-all transform overflow-hidden active:scale-[0.98]">
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
               <Play size={24} fill="currentColor" className="mr-3" />
               Plant
            </button>
         </>
        ) : (
           <button onClick={handleGiveUpClick} className="mt-8 group flex items-center space-x-2 bg-white/80 backdrop-blur border border-red-200 text-red-500 px-10 py-4 rounded-full font-bold text-xl shadow-lg hover:bg-red-50 hover:border-red-400 transition-all">
            <X size={24} strokeWidth={3} />
            <span>Give Up</span>
          </button>
        )}
      </div>

      {/* Modals (Styled dark for contrast against light theme) */}
      {showGiveUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl border border-slate-800 text-center text-white animate-pop-in">
              <div className="w-20 h-20 bg-red-900/20 rounded-full flex items-center justify-center mb-6 mx-auto animate-bounce border border-red-500/30"><AlertTriangle size={40} className="text-red-500" /></div>
              <h3 className="text-2xl font-black mb-2">Give up now?</h3>
              <p className="text-slate-400 mb-6 text-sm">Your tree will <span className="text-red-500 font-bold">wither</span> instantly.</p>
              <div className="flex space-x-3 w-full">
                <button onClick={cancelGiveUp} className="flex-1 py-3 rounded-xl font-bold text-slate-300 bg-slate-800 hover:bg-slate-700">Cancel</button>
                <button onClick={confirmGiveUp} className="flex-1 py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/20">Give Up</button>
              </div>
          </div>
        </div>
      )}
      
      {/* Project/Task Modals */}
      {(showProjectModal || showTaskModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 max-w-xs w-full border border-slate-800 text-white animate-pop-in shadow-2xl">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black">{showProjectModal ? 'New Tag' : 'New Task'}</h3>
                <button onClick={() => { setShowProjectModal(false); setShowTaskModal(false); }} className="text-slate-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={showProjectModal ? handleCreateProject : handleCreateTask}>
              <div className="mb-4">
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-2">Name</label>
                  <input value={showProjectModal ? newProjectName : newTaskName} onChange={(e) => showProjectModal ? setNewProjectName(e.target.value) : setNewTaskName(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 transition-colors" autoFocus />
              </div>
              {showProjectModal && (
                  <div className="mb-6">
                      <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-2">Color</label>
                      <div className="grid grid-cols-6 gap-2">{PRESET_COLORS.map(c => (<button key={c} type="button" onClick={() => setNewProjectColor(c)} className={`aspect-square rounded-lg ${newProjectColor === c ? 'ring-2 ring-white scale-110 shadow-lg' : 'opacity-70 hover:opacity-100'}`} style={{ backgroundColor: c }} />))}</div>
                  </div>
              )}
              {showTaskModal && (
                  <div className="mb-6">
                      <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-2">Daily Goal</label>
                      <input type="number" min="1" value={newTaskGoal} onChange={(e) => setNewTaskGoal(parseInt(e.target.value))} className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500 transition-colors" />
                  </div>
              )}
              <button type="submit" className="w-full py-4 rounded-xl font-bold text-slate-900 bg-emerald-500 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]">Create</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimerView;
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Tree, TreeStatus, TreeType, Tag } from '../types';
import { TreeDeciduous, TreePine, Sprout, Skull, Wind, Star, Sparkles, Moon } from 'lucide-react';

interface ForestViewProps {
  trees: Tree[];
  tags: Tag[];
}

// --- Interactive Background Components ---

const Fireflies = ({ mouseX, mouseY }: { mouseX: number, mouseY: number }) => {
  // Generate static random data for fireflies to avoid re-renders causing jumps
  const fireflies = useMemo(() => Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: 2 + Math.random() * 3,
    duration: 10 + Math.random() * 20,
    delay: Math.random() * 10,
    moveRange: 20 + Math.random() * 30,
  })), []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
       {fireflies.map(f => (
         <div 
            key={f.id}
            className="absolute rounded-full bg-emerald-300 blur-[1px] animate-firefly-float"
            style={{
              left: `${f.left}%`,
              top: `${f.top}%`,
              width: `${f.size}px`,
              height: `${f.size}px`,
              opacity: 0.6,
              boxShadow: `0 0 ${f.size * 2}px rgba(110, 231, 183, 0.8)`,
              animationDuration: `${f.duration}s`,
              animationDelay: `-${f.delay}s`,
              // Parallax effect: Fireflies move more than background
              transform: `translate(${mouseX * 0.05}px, ${mouseY * 0.05}px)`
            } as React.CSSProperties}
         />
       ))}
    </div>
  );
};

const InteractiveForestBackground = () => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const requestRef = useRef<number>(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate offset from center (-1 to 1 scale roughly)
      const x = (e.clientX - window.innerWidth / 2) / 50; 
      const y = (e.clientY - window.innerHeight / 2) / 50;
      
      // Smooth interpolation could go here, but direct mapping feels responsive for parallax
      setOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const stars = useMemo(() => Array.from({ length: 80 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 80, // Keep stars mostly in upper part
    size: Math.random() < 0.7 ? 1 : 2.5,
    opacity: 0.2 + Math.random() * 0.6,
    twinkleDuration: 2 + Math.random() * 5
  })), []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#020617]">
        <style>{`
          @keyframes aurora-wave {
            0% { transform: translateX(0) scaleY(1); opacity: 0.4; }
            50% { transform: translateX(20px) scaleY(1.1); opacity: 0.6; }
            100% { transform: translateX(0) scaleY(1); opacity: 0.4; }
          }
          @keyframes firefly-float {
            0%, 100% { transform: translate(0, 0); opacity: 0; }
            20% { opacity: 0.8; }
            50% { transform: translate(var(--move-x, 100px), var(--move-y, -50px)); opacity: 0.4; }
            80% { opacity: 0.8; }
          }
          @keyframes fog-drift {
            0% { transform: translateX(-10%); }
            100% { transform: translateX(10%); }
          }
        `}</style>

        {/* Deep Night Gradient - Static */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#1e293b]" />

        {/* Parallax Layer 1: Stars (Furthest) - Moves Slowly */}
        <div className="absolute inset-0" style={{ transform: `translate(${offset.x * -0.5}px, ${offset.y * -0.5}px)`, transition: 'transform 0.1s ease-out' }}>
            {stars.map(star => (
                <div 
                    key={star.id}
                    className="absolute rounded-full bg-white animate-pulse"
                    style={{
                        left: `${star.left}%`,
                        top: `${star.top}%`,
                        width: `${star.size}px`,
                        height: `${star.size}px`,
                        opacity: star.opacity,
                        animationDuration: `${star.twinkleDuration}s`
                    }}
                />
            ))}
        </div>

        {/* Parallax Layer 2: Moon (Far) - Moves little */}
        <div className="absolute top-10 right-10 opacity-90 mix-blend-screen" 
             style={{ transform: `translate(${offset.x * -0.8}px, ${offset.y * -0.8}px)`, transition: 'transform 0.1s ease-out' }}>
             <div className="relative w-24 h-24 rounded-full bg-slate-100 blur-[1px] shadow-[0_0_60px_rgba(255,255,255,0.3)]">
                <div className="absolute top-4 left-6 w-4 h-4 bg-slate-200 rounded-full opacity-50 blur-[1px]" />
                <div className="absolute bottom-6 right-8 w-6 h-6 bg-slate-200 rounded-full opacity-40 blur-[2px]" />
             </div>
        </div>

        {/* Parallax Layer 3: Aurora (Mid) */}
        <div className="absolute top-[-40%] left-[-10%] w-[120%] h-[100%] opacity-40 mix-blend-screen pointer-events-none"
             style={{ transform: `translate(${offset.x * -1.5}px, ${offset.y * -0.5}px)`, transition: 'transform 0.2s ease-out' }}>
             <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/0 via-teal-500/20 to-emerald-900/0 blur-[60px] animate-aurora-wave" style={{ animationDuration: '15s' }} />
             <div className="absolute top-20 left-20 w-full h-full bg-gradient-to-r from-purple-900/0 via-indigo-500/10 to-purple-900/0 blur-[50px] animate-aurora-wave" style={{ animationDuration: '20s', animationDelay: '2s' }} />
        </div>

        {/* Parallax Layer 4: Fireflies (Interactive) */}
        <Fireflies mouseX={offset.x * 50} mouseY={offset.y * 50} />

        {/* Parallax Layer 5: Foreground Fog (Closest) - Moves most */}
        <div className="absolute bottom-0 left-[-20%] w-[140%] h-[40%] pointer-events-none opacity-30 mix-blend-overlay"
             style={{ transform: `translate(${offset.x * 2}px, 0)`, transition: 'transform 0.3s ease-out' }}>
             <div className="w-full h-full bg-gradient-to-t from-slate-300 via-slate-400 to-transparent blur-[40px] animate-[fog-drift_30s_ease-in-out_infinite_alternate]" />
        </div>
    </div>
  );
};

const ForestView: React.FC<ForestViewProps> = ({ trees, tags }) => {
  const sortedTrees = useMemo(() => [...trees].sort((a, b) => b.createdAt - a.createdAt), [trees]);

  const getTagColor = (tagId: string) => tags.find(t => t.id === tagId)?.color || '#64748b';
  const getTagName = (tagId: string) => tags.find(t => t.id === tagId)?.name || 'Unknown';

  const renderTreeIcon = (tree: Tree) => {
    const size = 32;
    const color = getTagColor(tree.tagId);
    
    if (tree.status === TreeStatus.WITHERED) {
      return (
        <div className="flex flex-col items-center justify-end relative group-hover:scale-105 transition-transform">
          <Skull size={size} className="text-slate-600 drop-shadow-md" />
          <div className="w-6 h-1.5 bg-black/40 rounded-full blur-[2px] mt-[-2px]" />
        </div>
      );
    }
    
    let Icon = TreeDeciduous;
    switch (tree.type) {
      case TreeType.PINE: Icon = TreePine; break;
      case TreeType.BAMBOO: Icon = Sprout; break;
      default: Icon = TreeDeciduous; break;
    }

    return (
      <div className="flex flex-col items-center justify-end relative">
         <div className="absolute bottom-2 w-8 h-8 rounded-full blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" style={{ backgroundColor: color }} />
         <Icon size={size} style={{ color: color }} className="filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)] relative z-10" strokeWidth={2} />
         <div className="w-8 h-1.5 bg-black/30 rounded-full blur-[2px] mt-[-3px] z-0" />
      </div>
    );
  };

  // Deterministic random generator for varied animations
  const getTreeAnimAttrs = (tree: Tree, index: number) => {
    if (tree.status === TreeStatus.WITHERED) return { className: 'opacity-70 grayscale-[0.5]' };

    const seed = tree.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const swayStyles = ['animate-sway-gentle', 'animate-sway-breeze', 'animate-sway-natural', 'animate-sway-shiver'];
    const selectedStyle = swayStyles[seed % swayStyles.length];
    const duration = 3 + (seed % 5) + (index % 3) * 0.5; 
    const delay = -1 * ((seed % 10) + (index % 2)); 

    return {
      className: `transform-gpu ${selectedStyle}`,
      style: { animationDuration: `${duration}s`, animationDelay: `${delay}s` } as React.CSSProperties
    };
  };

  const aliveCount = trees.filter(t => t.status === TreeStatus.ALIVE).length;
  const witheredCount = trees.filter(t => t.status === TreeStatus.WITHERED).length;
  const totalMinutes = trees.filter(t => t.status === TreeStatus.ALIVE).reduce((acc, t) => acc + t.durationMinutes, 0);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <InteractiveForestBackground />

      <div className="relative z-10 h-full flex flex-col p-4 md:p-8 w-full max-w-6xl mx-auto">
        <style>{`
          @keyframes sway-gentle { 0%, 100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }
          @keyframes sway-breeze { 0% { transform: rotate(-1deg) skewX(0deg); } 50% { transform: rotate(4deg) skewX(-1.5deg); } 100% { transform: rotate(-1deg) skewX(0deg); } }
          @keyframes sway-natural { 0% { transform: rotate(0deg); } 20% { transform: rotate(-3deg); } 45% { transform: rotate(1.5deg); } 70% { transform: rotate(-1.5deg); } 100% { transform: rotate(0deg); } }
          @keyframes sway-shiver { 0%, 100% { transform: rotate(0deg) scale(1); } 25% { transform: rotate(1.5deg) scale(1.01); } 45% { transform: rotate(-1.5deg) scale(0.99); } 60% { transform: rotate(0.5deg); } 85% { transform: rotate(-0.5deg); } }
          @keyframes grow-spring { 0% { transform: scale(0) translateY(20px); opacity: 0; } 40% { transform: scale(1.2) translateY(-5px); opacity: 1; } 70% { transform: scale(0.95) translateY(0); } 100% { transform: scale(1) translateY(0); opacity: 1; } }
          
          .animate-sway-gentle { animation: sway-gentle ease-in-out infinite; transform-origin: bottom center; }
          .animate-sway-breeze { animation: sway-breeze ease-in-out infinite; transform-origin: bottom center; }
          .animate-sway-natural { animation: sway-natural ease-in-out infinite; transform-origin: bottom center; }
          .animate-sway-shiver { animation: sway-shiver linear infinite; transform-origin: bottom center; }
          .animate-grow-spring { animation: grow-spring 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        `}</style>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 animate-fade-in shrink-0">
          <div className="backdrop-blur-sm bg-slate-900/30 p-4 rounded-2xl border border-white/5">
            <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-3">
              My Night Forest <Wind size={20} className="text-slate-400/70 animate-pulse" />
            </h2>
            <p className="text-slate-400 mt-1 font-medium text-sm">
              <span className="text-emerald-400 font-bold">{aliveCount}</span> Glowing Trees <span className="mx-2">•</span> <span className="text-slate-500">{witheredCount} Withered</span>
            </p>
          </div>
          <div className="bg-slate-800/40 px-5 py-3 rounded-2xl shadow-lg text-sm font-bold text-emerald-300 border border-slate-700/50 flex items-center backdrop-blur-md">
            <span className="relative flex h-3 w-3 mr-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m Focused
          </div>
        </div>

        {trees.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center relative border-2 border-dashed border-slate-800/50 rounded-[2.5rem] bg-slate-900/10 m-2 overflow-hidden backdrop-blur-sm">
            <div className="absolute inset-0 pointer-events-none">
               <div className="absolute top-1/4 left-1/4 text-slate-700/20 animate-pulse"><Star size={24} /></div>
               <div className="absolute bottom-1/4 right-1/3 text-slate-700/20 animate-pulse" style={{ animationDelay: '1s' }}><Star size={16} /></div>
            </div>
            <div className="relative z-10 flex flex-col items-center text-center p-8 max-w-md">
               <div className="relative mb-8 group">
                  <div className="absolute inset-0 bg-emerald-500/10 blur-2xl rounded-full group-hover:bg-emerald-500/20 transition-all duration-700"></div>
                  <div className="relative w-28 h-28 bg-slate-900/50 backdrop-blur-md rounded-[2rem] flex items-center justify-center border border-slate-700/50 shadow-2xl transform -rotate-3 group-hover:rotate-0 transition-transform duration-500">
                     <Sprout size={56} className="text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]" strokeWidth={1.5} />
                  </div>
               </div>
               <h3 className="text-3xl font-black text-white mb-3 tracking-tight">Your Forest Awaits</h3>
               <p className="text-slate-400 text-lg font-medium leading-relaxed mb-8">It's quiet here. <span className="text-slate-500">Complete a focus session to plant your first seed.</span></p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-6 overflow-y-auto pb-32 p-4 scrollbar-hide mask-image-gradient-b flex-1 min-h-0">
            {sortedTrees.map((tree, index) => {
               const animAttrs = getTreeAnimAttrs(tree, index);
               return (
                <div key={tree.id} className="group relative aspect-[0.8] flex flex-col items-center justify-end cursor-pointer hover:z-20 transition-all duration-500">
                  <div className={animAttrs.className} style={animAttrs.style}>
                     <div className="animate-grow-spring" style={{ animationDelay: `${index * 0.04}s` }}>
                        {renderTreeIcon(tree)}
                     </div>
                  </div>
                  <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100 translate-y-2 group-hover:translate-y-0 pointer-events-none z-50 w-32">
                     <div className="bg-slate-900/90 backdrop-blur-xl rounded-xl p-3 border border-slate-700 shadow-xl text-center">
                        <div className="w-2 h-2 bg-slate-900 border-r border-b border-slate-700 absolute -bottom-1 left-1/2 transform -translate-x-1/2 rotate-45"></div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1">{getTagName(tree.tagId)}</p>
                        <div className="text-white font-black text-xl leading-none mb-1">{tree.durationMinutes}<span className="text-xs font-normal text-slate-500 ml-0.5">m</span></div>
                        {tree.aiStory && <p className="text-[10px] italic text-slate-300 mt-2 leading-tight opacity-80">"{tree.aiStory}"</p>}
                     </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForestView;
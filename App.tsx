import React, { useState, useEffect } from 'react';
import { Timer, Trees, BarChart2 } from 'lucide-react';
import TimerView from './components/TimerView';
import ForestView from './components/ForestView';
import StatsView from './components/StatsView';
import { View, Tree, Tag, TreeType, TreeStatus, Task } from './types';
import { generateTreeStory, initializeGemini } from './services/geminiService';
import { TAGS as DEFAULT_TAGS } from './constants';

// Fake initial data for demo purposes
const INITIAL_TREES: Tree[] = [
  { id: '1', createdAt: Date.now() - 86400000, durationMinutes: 25, tagId: 'work', status: TreeStatus.ALIVE, type: TreeType.OAK, aiStory: 'A sturdy oak of productivity.' },
  { id: '2', createdAt: Date.now() - 172800000, durationMinutes: 45, tagId: 'study', status: TreeStatus.ALIVE, type: TreeType.PINE, aiStory: 'Deep roots of knowledge.' },
  { id: '3', createdAt: Date.now() - 20000000, durationMinutes: 15, tagId: 'social', status: TreeStatus.WITHERED, type: TreeType.WILLOW },
];

const INITIAL_TASKS: Task[] = [
  { id: 't1', tagId: 'study', name: 'Read Chapter', dailyGoal: 2 },
  { id: 't2', tagId: 'work', name: 'Clear Inbox', dailyGoal: 1 },
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('TIMER');
  const [trees, setTrees] = useState<Tree[]>(INITIAL_TREES);
  const [tags, setTags] = useState<Tag[]>(DEFAULT_TAGS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [notification, setNotification] = useState<{msg: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    initializeGemini();
  }, []);

  const handleSessionComplete = async (duration: number, tag: Tag, type: TreeType, taskId?: string) => {
    const newTree: Tree = {
      id: Date.now().toString(),
      createdAt: Date.now(),
      durationMinutes: duration,
      tagId: tag.id,
      taskId: taskId,
      status: TreeStatus.ALIVE,
      type: type,
    };

    // Optimistic update
    setTrees(prev => [newTree, ...prev]);
    setNotification({ msg: `Great job! You grew a ${type}! Generating story...`, type: 'success' });

    // Fetch AI story
    if (process.env.API_KEY) {
      const story = await generateTreeStory(newTree, tag);
      setTrees(prev => prev.map(t => t.id === newTree.id ? { ...t, aiStory: story } : t));
      setNotification({ msg: `"${story}"`, type: 'success' });
    } else {
      setNotification({ msg: `Great job! You grew a ${type}!`, type: 'success' });
    }

    setTimeout(() => setNotification(null), 5000);
  };

  const handleSessionFail = (duration: number, tag: Tag, type: TreeType) => {
    const witheredTree: Tree = {
      id: Date.now().toString(),
      createdAt: Date.now(),
      durationMinutes: duration, // Although failed, we might track intended duration or 0
      tagId: tag.id,
      status: TreeStatus.WITHERED,
      type: type,
    };
    setTrees(prev => [witheredTree, ...prev]);
    setNotification({ msg: "Oh no! Your tree withered.", type: 'error' });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddTag = (newTag: Tag) => {
    setTags(prev => [...prev, newTag]);
    setNotification({ msg: `Project "${newTag.name}" created!`, type: 'success' });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleUpdateTag = (updatedTag: Tag) => {
    setTags(prev => prev.map(t => t.id === updatedTag.id ? updatedTag : t));
    setNotification({ msg: `Goal for "${updatedTag.name}" updated!`, type: 'success' });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddTask = (newTask: Task) => {
    setTasks(prev => [...prev, newTask]);
    setNotification({ msg: `Task "${newTask.name}" added to ${tags.find(t => t.id === newTask.tagId)?.name}`, type: 'success' });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    setNotification({ msg: "Task deleted", type: 'success' });
    setTimeout(() => setNotification(null), 2000);
  };

  const NavButton = ({ view, icon: Icon, label }: { view: View; icon: any; label: string }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all w-full md:w-auto ${
        currentView === view
          ? 'text-emerald-400 bg-slate-800/80 font-bold shadow-[0_0_15px_rgba(52,211,153,0.1)] scale-105 border border-emerald-500/30'
          : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'
      }`}
    >
      <Icon size={24} strokeWidth={currentView === view ? 2.5 : 2} />
      <span className="text-xs mt-1 font-semibold">{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-slate-950 font-sans text-slate-200">
      {/* Sidebar / Mobile Bottom Nav */}
      <nav className="order-2 md:order-1 bg-slate-900 border-t md:border-r md:border-t-0 border-slate-800 w-full md:w-24 flex md:flex-col justify-around md:justify-center md:space-y-8 p-2 md:p-4 z-20 shadow-2xl md:h-screen">
        <div className="hidden md:flex flex-col items-center mb-auto pt-4">
           <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-[0_0_15px_rgba(16,185,129,0.5)] mb-2 transform hover:rotate-3 transition-transform cursor-default">
             Z
           </div>
        </div>
        
        <NavButton view="TIMER" icon={Timer} label="Timer" />
        <NavButton view="FOREST" icon={Trees} label="Forest" />
        <NavButton view="STATS" icon={BarChart2} label="Stats" />

        <div className="hidden md:block mt-auto pb-4">
          {/* Placeholder for profile or settings in future */}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="order-1 md:order-2 flex-1 relative overflow-hidden flex flex-col bg-[#020617]">
        {/* Notification Toast */}
        {notification && (
           <div className={`absolute top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-[0_0_25px_rgba(0,0,0,0.5)] text-white text-sm font-bold animate-bounce flex items-center space-x-2 backdrop-blur-md border ${
             notification.type === 'success' ? 'bg-emerald-600/90 border-emerald-400' : 'bg-red-600/90 border-red-400'
           }`}>
             <span>{notification.msg}</span>
           </div>
        )}

        <div className="flex-1 overflow-hidden relative">
          {currentView === 'TIMER' && (
            <TimerView 
              tags={tags}
              trees={trees}
              tasks={tasks}
              onAddTag={handleAddTag}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
              onSessionComplete={handleSessionComplete} 
              onSessionFail={handleSessionFail} 
            />
          )}
          {currentView === 'FOREST' && <ForestView trees={trees} tags={tags} />}
          {currentView === 'STATS' && <StatsView trees={trees} tags={tags} onUpdateTag={handleUpdateTag} />}
        </div>
      </main>
    </div>
  );
};

export default App;
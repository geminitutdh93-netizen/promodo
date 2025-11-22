import { Tag, TreeType } from './types';

export const DEFAULT_DURATION = 25; // minutes

export const TAGS: Tag[] = [
  { id: 'work', name: 'Work', color: '#3b82f6', dailyGoal: 8 }, // blue-500
  { id: 'study', name: 'Study', color: '#a855f7', dailyGoal: 6 }, // purple-500
  { id: 'social', name: 'Social', color: '#ec4899', dailyGoal: 2 }, // pink-500
  { id: 'rest', name: 'Rest', color: '#10b981', dailyGoal: 3 }, // emerald-500
  { id: 'entertainment', name: 'Entertainment', color: '#f59e0b', dailyGoal: 2 }, // amber-500
];

export const TREE_TYPES: TreeType[] = [
  TreeType.OAK,
  TreeType.PINE,
  TreeType.WILLOW,
  TreeType.BAMBOO,
  TreeType.CACTUS,
];

export const MOTIVATIONAL_QUOTES = [
  "The best time to plant a tree was 20 years ago. The second best time is now.",
  "Stay focused, go green.",
  "Put down the phone, pick up your life.",
  "Focus is the key to success.",
  "Every tree counts.",
];
import { TOPICS, type Card, type TopicId } from '../data/topics';

const KEY = 'eduscroll:v1';

export interface Stats {
  learned: number;
  quizCorrect: number;
  quizTotal: number;
  streak: number;
  lastDay: string | null;
  today: number;
}

export interface AppState {
  topics: TopicId[];
  onboarded: boolean;
  liked: string[];
  saved: Card[];
  seenWiki: string[];
  stats: Stats;
}

export const defaultState: AppState = {
  topics: [],
  onboarded: false,
  liked: [],
  saved: [],
  seenWiki: [],
  stats: { learned: 0, quizCorrect: 0, quizTotal: 0, streak: 0, lastDay: null, today: 0 },
};

export function load(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw);
    // Drop topics/cards from older versions that no longer exist.
    const valid = new Set<string>(TOPICS.map((t) => t.id));
    const topics = (parsed.topics ?? []).filter((t: string) => valid.has(t));
    const saved = (parsed.saved ?? []).filter((c: Card) => valid.has(c.topic));
    return {
      ...defaultState,
      ...parsed,
      topics,
      saved,
      onboarded: !!parsed.onboarded && topics.length > 0,
      stats: { ...defaultState.stats, ...parsed.stats },
    };
  } catch {
    return defaultState;
  }
}

export function save(state: AppState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable (private mode / quota) — app still works in memory */
  }
}

export const dayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** Records that a card was viewed and updates the daily streak. */
export function bumpLearned(stats: Stats): Stats {
  const today = dayKey();
  if (stats.lastDay === today) return { ...stats, learned: stats.learned + 1, today: stats.today + 1 };
  const yesterday = dayKey(new Date(Date.now() - 86_400_000));
  const streak = stats.lastDay === yesterday ? stats.streak + 1 : 1;
  return { ...stats, learned: stats.learned + 1, today: 1, streak, lastDay: today };
}

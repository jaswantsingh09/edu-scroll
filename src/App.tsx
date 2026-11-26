import { useEffect, useMemo, useState } from 'react';
import type { Card, TopicId } from './data/topics';
import { bumpLearned, defaultState, load, save, type AppState } from './lib/storage';
import { Onboarding } from './components/Onboarding';
import { Feed } from './components/Feed';
import { Saved } from './components/Saved';
import { Profile } from './components/Profile';
import { Bookmark, Home, User } from './components/Icons';

type Tab = 'feed' | 'saved' | 'profile';

export default function App() {
  const [state, setState] = useState<AppState>(load);
  const [tab, setTab] = useState<Tab>('feed');

  useEffect(() => save(state), [state]);

  const liked = useMemo(() => new Set(state.liked), [state.liked]);
  const savedIds = useMemo(() => new Set(state.saved.map((c) => c.id)), [state.saved]);

  if (!state.onboarded) {
    return <Onboarding onDone={(topics) => setState((s) => ({ ...s, topics, onboarded: true }))} />;
  }

  const toggleLike = (card: Card) =>
    setState((s) => ({
      ...s,
      liked: s.liked.includes(card.id) ? s.liked.filter((id) => id !== card.id) : [...s.liked, card.id],
    }));

  const toggleSave = (card: Card) =>
    setState((s) => ({
      ...s,
      saved: s.saved.some((c) => c.id === card.id) ? s.saved.filter((c) => c.id !== card.id) : [...s.saved, card],
    }));

  return (
    <div className="app">
      <main className="view">
        {/* Feed stays mounted so scroll position survives tab switches */}
        <div className="tab-pane" hidden={tab !== 'feed'}>
          <Feed
            topics={state.topics}
            seenWiki={state.seenWiki}
            liked={liked}
            saved={savedIds}
            today={state.stats.lastDay ? state.stats.today : 0}
            onLike={toggleLike}
            onSave={toggleSave}
            onViewed={(card) => {
              if (card.kind === 'fact') setState((s) => ({ ...s, stats: bumpLearned(s.stats) }));
            }}
            onQuiz={(correct) =>
              setState((s) => ({
                ...s,
                stats: { ...s.stats, quizTotal: s.stats.quizTotal + 1, quizCorrect: s.stats.quizCorrect + (correct ? 1 : 0) },
              }))
            }
            onWikiSeen={(title) => setState((s) => ({ ...s, seenWiki: [...s.seenWiki, title].slice(-500) }))}
          />
        </div>
        {tab === 'saved' && <Saved saved={state.saved} onRemove={toggleSave} />}
        {tab === 'profile' && (
          <Profile
            stats={state.stats}
            topics={state.topics}
            savedCount={state.saved.length}
            onTopics={(topics: TopicId[]) => {
              setState((s) => ({ ...s, topics }));
              setTab('feed');
            }}
            onReset={() => {
              setState(defaultState);
              setTab('feed');
            }}
          />
        )}
      </main>

      <nav className="tabbar">
        <button className={tab === 'feed' ? 'on' : ''} onClick={() => setTab('feed')} aria-label="Feed">
          <Home filled={tab === 'feed'} />
        </button>
        <button className={tab === 'saved' ? 'on' : ''} onClick={() => setTab('saved')} aria-label="Saved">
          <Bookmark filled={tab === 'saved'} />
        </button>
        <button className={tab === 'profile' ? 'on' : ''} onClick={() => setTab('profile')} aria-label="Profile">
          <User filled={tab === 'profile'} />
        </button>
      </nav>
    </div>
  );
}

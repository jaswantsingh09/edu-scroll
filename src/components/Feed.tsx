import { useCallback, useEffect, useRef, useState } from 'react';
import { topicById, type Card, type TopicId } from '../data/topics';
import { FeedEngine } from '../lib/feed';
import { FactCardView } from './FactCardView';
import { QuizCardView } from './QuizCardView';

interface Props {
  topics: TopicId[];
  seenWiki: string[];
  liked: Set<string>;
  saved: Set<string>;
  today: number;
  onLike: (card: Card) => void;
  onSave: (card: Card) => void;
  onViewed: (card: Card) => void;
  onQuiz: (correct: boolean) => void;
  onWikiSeen: (title: string) => void;
}

export function Feed(props: Props) {
  const { topics } = props;
  const [filter, setFilter] = useState<'all' | TopicId>('all');
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const [offline, setOffline] = useState(false);
  const engine = useRef<FeedEngine | null>(null);
  const loadingRef = useRef(false);
  const scroller = useRef<HTMLDivElement>(null);
  const viewed = useRef(new Set<string>());
  const offlineRef = useRef(false);
  offlineRef.current = offline;
  const propsRef = useRef(props);
  propsRef.current = props;

  const loadMore = useCallback(async () => {
    if (!engine.current || loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    const current = engine.current;
    try {
      const next = await current.next(6);
      if (current !== engine.current) return; // filter changed mid-flight
      setOffline(next.length === 0);
      if (next.length === 0) return;
      setCards((prev) => {
        const ids = new Set(prev.map((c) => c.id));
        const fresh = next.filter((c) => !ids.has(c.id));
        return fresh.length ? [...prev, ...fresh] : prev;
      });
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  // (Re)build the feed whenever the topic selection or filter changes.
  useEffect(() => {
    const chosen = filter === 'all' ? topics : [filter];
    engine.current = new FeedEngine(chosen, propsRef.current.seenWiki, (t) => propsRef.current.onWikiSeen(t));
    loadingRef.current = false;
    setOffline(false);
    setCards([]);
    scroller.current?.scrollTo({ top: 0 });
    void loadMore();
  }, [topics, filter, loadMore]);

  // Track which card is on screen: count it as learned and prefetch near the end.
  useEffect(() => {
    const root = scroller.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          if (el.dataset.end) {
            if (!offlineRef.current) void loadMore();
            continue;
          }
          const idx = Number(el.dataset.idx);
          const card = cards[idx];
          if (card && !viewed.current.has(card.id)) {
            viewed.current.add(card.id);
            propsRef.current.onViewed(card);
          }
          if (idx >= cards.length - 3) void loadMore();
        }
      },
      { root, threshold: 0.6 },
    );
    root.querySelectorAll('[data-idx], [data-end]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [cards, loadMore]);

  return (
    <div className="feed-wrap">
      <header className="feed-top">
        <div className="feed-brand">
          EduScroll <span className="today-pill">🔥 {props.today} today</span>
        </div>
        <nav className="filter-row" aria-label="Filter topics">
          <button className={filter === 'all' ? 'on' : ''} onClick={() => setFilter('all')}>
            For you
          </button>
          {topics.map((id) => {
            const t = topicById(id);
            return (
              <button key={id} className={filter === id ? 'on' : ''} onClick={() => setFilter(id)}>
                {t.emoji} {t.name}
              </button>
            );
          })}
        </nav>
      </header>

      <div className="feed" ref={scroller}>
        {cards.map((card, i) => (
          <section className="slide" key={card.id} data-idx={i}>
            {card.kind === 'fact' ? (
              <FactCardView
                card={card}
                liked={props.liked.has(card.id)}
                saved={props.saved.has(card.id)}
                onLike={() => props.onLike(card)}
                onSave={() => props.onSave(card)}
              />
            ) : (
              <QuizCardView card={card} onAnswer={props.onQuiz} />
            )}
          </section>
        ))}
        {cards.length === 0 ? (
          <div className="feed-loading">
            {offline ? <OfflineMsg onRetry={loadMore} /> : <div className="spinner" aria-label="Loading" />}
          </div>
        ) : (
          <div className="feed-end" data-end="1">
            {offline ? <OfflineMsg onRetry={loadMore} /> : <div className="spinner" aria-label="Loading" />}
          </div>
        )}
      </div>
    </div>
  );
}

function OfflineMsg({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="end-msg">
      <p>You’re offline or out of fresh content.</p>
      <button className="btn-primary" onClick={onRetry}>
        Try again
      </button>
    </div>
  );
}

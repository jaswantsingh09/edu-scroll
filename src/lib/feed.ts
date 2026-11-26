import { CURATED, TOPICS, topicById, type Card, type FactCard, type QuizCard, type TopicId } from '../data/topics';

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

/** Trim to roughly `max` chars, ending on a sentence boundary when possible. */
function trimText(text: string, max = 420): string {
  const clean = text.replace(/\s+/g, ' ').replace(/\s\([^)]*\)/, '').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const end = cut.lastIndexOf('. ');
  return end > 120 ? cut.slice(0, end + 1) : cut.replace(/\s+\S*$/, '') + '…';
}

interface WikiPage {
  pageid: number;
  title: string;
  extract?: string;
  thumbnail?: { source: string };
  fullurl?: string;
}

/** Fetches a handful of Wikipedia article intros matching one of the topic's queries. */
export async function fetchWiki(topic: TopicId, seen: Set<string>, signal?: AbortSignal): Promise<FactCard[]> {
  const t = topicById(topic);
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    formatversion: '2',
    origin: '*',
    generator: 'search',
    gsrsearch: pick(t.queries),
    gsrlimit: '12',
    gsroffset: String(Math.floor(Math.random() * 6) * 12),
    gsrnamespace: '0',
    prop: 'extracts|pageimages|info',
    inprop: 'url',
    exintro: '1',
    explaintext: '1',
    exsentences: '4',
    exlimit: '12',
    piprop: 'thumbnail',
    pithumbsize: '900',
  });
  const res = await fetch(`https://en.wikipedia.org/w/api.php?${params}`, { signal });
  if (!res.ok) throw new Error(`Wikipedia ${res.status}`);
  const json = await res.json();
  const pages: WikiPage[] = json?.query?.pages ?? [];
  return pages
    .filter((p) => p.extract && p.extract.length > 140 && !/may refer to|^List of/i.test(p.extract + p.title) && !seen.has(p.title))
    .map((p) => ({
      kind: 'fact' as const,
      id: `w-${p.pageid}`,
      topic,
      title: p.title,
      body: trimText(p.extract!),
      image: p.thumbnail?.source,
      url: p.fullurl ?? `https://en.wikipedia.org/wiki/${encodeURIComponent(p.title)}`,
      source: 'Wikipedia',
    }));
}

/** Builds a "which article is this?" quiz from a batch of Wikipedia facts. */
function quizFromFacts(facts: FactCard[]): QuizCard | null {
  if (facts.length < 4) return null;
  const [target, ...rest] = shuffle(facts);
  const distractors = rest.slice(0, 3).map((f) => f.title);
  const words = target.title.split(/[\s(),]+/).filter((w) => w.length > 2);
  let clue = target.body;
  for (const w of words) clue = clue.replace(new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '___');
  clue = trimText(clue, 220);
  const options = shuffle([target.title, ...distractors]);
  return {
    kind: 'quiz',
    id: `wq-${target.id}`,
    topic: target.topic,
    question: `Which one is this? “${clue}”`,
    options,
    answer: options.indexOf(target.title),
    explain: `It’s ${target.title}.`,
  };
}

/**
 * Produces an endless, interleaved stream of cards for the chosen topics:
 * curated cards first (instant, offline), then live Wikipedia content, with a quiz every few cards.
 */
export class FeedEngine {
  private facts: FactCard[];
  private quizzes: QuizCard[];
  private wikiBuffer: FactCard[] = [];
  private emitted = 0;
  private fetching: Promise<void> | null = null;
  private seen: Set<string>;

  constructor(private topics: TopicId[], seenWiki: string[], private onSeen: (title: string) => void) {
    const chosen = topics.length ? topics : TOPICS.map((t) => t.id);
    this.topics = chosen;
    this.seen = new Set(seenWiki);
    this.facts = shuffle(CURATED.filter((c): c is FactCard => c.kind === 'fact' && chosen.includes(c.topic)));
    this.quizzes = shuffle(CURATED.filter((c): c is QuizCard => c.kind === 'quiz' && chosen.includes(c.topic)));
  }

  private refill(): Promise<void> {
    if (!this.fetching) {
      const topics = shuffle(this.topics).slice(0, 2);
      this.fetching = Promise.allSettled(topics.map((t) => fetchWiki(t, this.seen)))
        .then((results) => {
          const fresh = results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []));
          const quiz = quizFromFacts(fresh);
          if (quiz) this.quizzes.push(quiz);
          // keep known article ids unique within the buffer
          const ids = new Set(this.wikiBuffer.map((f) => f.id));
          this.wikiBuffer.push(...shuffle(fresh.filter((f) => !ids.has(f.id))));
        })
        .finally(() => {
          this.fetching = null;
        });
    }
    return this.fetching;
  }

  private nextFact(): FactCard | null {
    // Alternate: prefer curated early, then mostly wiki once curated runs out.
    const useCurated = this.facts.length > 0 && (this.wikiBuffer.length === 0 || this.emitted % 3 === 0);
    const card = useCurated ? this.facts.shift() : this.wikiBuffer.shift() ?? this.facts.shift();
    if (card?.source === 'Wikipedia') {
      this.seen.add(card.title);
      this.onSeen(card.title);
    }
    return card ?? null;
  }

  /** Returns the next `n` cards, fetching from Wikipedia if needed. */
  async next(n = 6): Promise<Card[]> {
    if (this.wikiBuffer.length < n) {
      const pending = this.refill();
      if (this.facts.length + this.wikiBuffer.length < n) await pending;
    }
    const out: Card[] = [];
    for (let i = 0; i < n; i++) {
      this.emitted++;
      if (this.emitted % 5 === 0 && this.quizzes.length) {
        out.push(this.quizzes.shift()!);
        continue;
      }
      const fact = this.nextFact();
      if (fact) out.push(fact);
    }
    return out;
  }
}

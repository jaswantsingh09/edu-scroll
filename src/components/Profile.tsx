import { useState } from 'react';
import type { TopicId } from '../data/topics';
import type { Stats } from '../lib/storage';
import { TopicPicker } from './TopicPicker';

interface Props {
  stats: Stats;
  topics: TopicId[];
  savedCount: number;
  onTopics: (t: TopicId[]) => void;
  onReset: () => void;
}

export function Profile({ stats, topics, savedCount, onTopics, onReset }: Props) {
  const [draft, setDraft] = useState<TopicId[]>(topics);
  const dirty = draft.length > 0 && draft.join() !== topics.join();
  const accuracy = stats.quizTotal ? Math.round((stats.quizCorrect / stats.quizTotal) * 100) : 0;

  return (
    <div className="page">
      <h2>Your progress</h2>
      <div className="stat-grid">
        <div className="stat">
          <b>🔥 {stats.streak}</b>
          <span>day streak</span>
        </div>
        <div className="stat">
          <b>{stats.learned}</b>
          <span>cards learned</span>
        </div>
        <div className="stat">
          <b>{stats.quizTotal ? `${accuracy}%` : '—'}</b>
          <span>
            quiz accuracy ({stats.quizCorrect}/{stats.quizTotal})
          </span>
        </div>
        <div className="stat">
          <b>{savedCount}</b>
          <span>saved</span>
        </div>
      </div>

      <h3>Your topics</h3>
      <TopicPicker selected={draft} onChange={setDraft} />
      {dirty && (
        <button className="btn-primary sticky-save" onClick={() => onTopics(draft)}>
          Update my feed
        </button>
      )}

      <button
        className="btn-ghost"
        onClick={() => {
          if (confirm('Reset all progress, saved cards and topics?')) onReset();
        }}
      >
        Reset everything
      </button>
    </div>
  );
}

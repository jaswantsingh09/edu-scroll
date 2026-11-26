import { TOPICS, type TopicId } from '../data/topics';

interface Props {
  selected: TopicId[];
  onChange: (next: TopicId[]) => void;
}

export function TopicPicker({ selected, onChange }: Props) {
  const toggle = (id: TopicId) =>
    onChange(selected.includes(id) ? selected.filter((t) => t !== id) : [...selected, id]);

  return (
    <div className="topic-grid">
      {TOPICS.map((t) => {
        const on = selected.includes(t.id);
        return (
          <button
            key={t.id}
            type="button"
            className={`topic-tile${on ? ' on' : ''}`}
            style={{ '--c1': t.colors[0], '--c2': t.colors[1] } as React.CSSProperties}
            onClick={() => toggle(t.id)}
            aria-pressed={on}
          >
            <span className="topic-emoji">{t.emoji}</span>
            <span className="topic-name">{t.name}</span>
            {on && <span className="topic-check">✓</span>}
          </button>
        );
      })}
    </div>
  );
}

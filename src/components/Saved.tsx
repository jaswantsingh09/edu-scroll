import { useState } from 'react';
import { topicById, type Card } from '../data/topics';

export function Saved({ saved, onRemove }: { saved: Card[]; onRemove: (c: Card) => void }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="page">
      <h2>Saved</h2>
      {saved.length === 0 ? (
        <p className="muted empty">Tap the bookmark on any card to keep it here for later review.</p>
      ) : (
        <ul className="saved-list">
          {[...saved].reverse().map((c) => {
            const t = topicById(c.topic);
            const title = c.kind === 'fact' ? c.title : c.question;
            const body = c.kind === 'fact' ? c.body : `${c.options[c.answer]} — ${c.explain ?? ''}`;
            const isOpen = open === c.id;
            return (
              <li key={c.id} className="saved-item" style={{ '--c1': t.colors[0], '--c2': t.colors[1] } as React.CSSProperties}>
                <button className="saved-head" onClick={() => setOpen(isOpen ? null : c.id)}>
                  <span className="saved-emoji">{t.emoji}</span>
                  <span className="saved-title">{title}</span>
                </button>
                {isOpen && (
                  <div className="saved-body">
                    <p>{body}</p>
                    <div className="saved-actions">
                      {c.kind === 'fact' && c.url && (
                        <a href={c.url} target="_blank" rel="noreferrer">
                          Read more ↗
                        </a>
                      )}
                      <button onClick={() => onRemove(c)}>Remove</button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

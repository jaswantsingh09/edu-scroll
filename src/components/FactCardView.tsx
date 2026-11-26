import { useRef, useState } from 'react';
import { topicById, type FactCard } from '../data/topics';
import { Bookmark, Book, Heart, Share } from './Icons';

interface Props {
  card: FactCard;
  liked: boolean;
  saved: boolean;
  onLike: () => void;
  onSave: () => void;
}

export function FactCardView({ card, liked, saved, onLike, onSave }: Props) {
  const topic = topicById(card.topic);
  const [burst, setBurst] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const lastTap = useRef(0);

  const handleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      if (!liked) onLike();
      setBurst((b) => b + 1);
    }
    lastTap.current = now;
  };

  const share = async () => {
    const text = `${card.title} — ${card.hook ?? card.body.slice(0, 120)}`;
    try {
      if (navigator.share) await navigator.share({ title: card.title, text, url: card.url ?? location.href });
      else await navigator.clipboard.writeText(`${text}\n${card.url ?? location.href}`);
    } catch {
      /* user cancelled */
    }
  };

  return (
    <article
      className="card"
      style={{ '--c1': topic.colors[0], '--c2': topic.colors[1] } as React.CSSProperties}
      onClick={handleTap}
    >
      {card.image ? (
        <>
          <div className="card-bg-img" style={{ backgroundImage: `url("${card.image}")` }} />
          <img className="card-img" src={card.image} alt="" loading="lazy" />
        </>
      ) : card.code ? null : (
        <div className="card-emoji" aria-hidden>
          {topic.emoji}
        </div>
      )}
      <div className="card-shade" />

      {burst > 0 && (
        <div key={burst} className="heart-burst" aria-hidden>
          <Heart filled />
        </div>
      )}

      <div className={`card-content${card.code ? ' has-code' : ''}`}>
        <span className="chip">
          {topic.emoji} {topic.name}
        </span>
        <h2 className="card-title">{card.title}</h2>
        {card.hook && <p className="card-hook">{card.hook}</p>}
        <p
          className={`card-body${expanded ? ' expanded' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            setExpanded((x) => !x);
          }}
        >
          {card.body}
        </p>
        {card.code && (
          <pre className="code" onClick={(e) => e.stopPropagation()}>
            <code>{card.code}</code>
          </pre>
        )}
        <span className="card-source">Source: {card.source}</span>
      </div>

      <div className="rail" onClick={(e) => e.stopPropagation()}>
        <button className={`rail-btn${liked ? ' active' : ''}`} onClick={onLike} aria-label="Like">
          <Heart filled={liked} />
          <span>{liked ? 'Liked' : 'Like'}</span>
        </button>
        <button className={`rail-btn${saved ? ' active' : ''}`} onClick={onSave} aria-label="Save">
          <Bookmark filled={saved} />
          <span>{saved ? 'Saved' : 'Save'}</span>
        </button>
        <button className="rail-btn" onClick={share} aria-label="Share">
          <Share />
          <span>Share</span>
        </button>
        {card.url && (
          <a className="rail-btn" href={card.url} target="_blank" rel="noreferrer" aria-label="Read more">
            <Book />
            <span>More</span>
          </a>
        )}
      </div>
    </article>
  );
}

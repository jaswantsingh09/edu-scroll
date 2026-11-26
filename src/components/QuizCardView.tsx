import { useState } from 'react';
import { topicById, type QuizCard } from '../data/topics';

export function QuizCardView({ card, onAnswer }: { card: QuizCard; onAnswer: (correct: boolean) => void }) {
  const topic = topicById(card.topic);
  const [choice, setChoice] = useState<number | null>(null);
  const answered = choice !== null;

  const choose = (i: number) => {
    if (answered) return;
    setChoice(i);
    onAnswer(i === card.answer);
    navigator.vibrate?.(i === card.answer ? 30 : [40, 60, 40]);
  };

  return (
    <article className="card quiz" style={{ '--c1': topic.colors[0], '--c2': topic.colors[1] } as React.CSSProperties}>
      <div className="quiz-inner">
        <span className="chip">⚡ Quick quiz · {topic.name}</span>
        <h2 className="quiz-q">{card.question}</h2>
        {card.code && (
          <pre className="code quiz-code">
            <code>{card.code}</code>
          </pre>
        )}
        <div className="quiz-options">
          {card.options.map((opt, i) => {
            const state = !answered ? '' : i === card.answer ? ' correct' : i === choice ? ' wrong' : ' dim';
            return (
              <button key={i} className={`quiz-opt${state}`} onClick={() => choose(i)} disabled={answered}>
                <span className="quiz-letter">{String.fromCharCode(65 + i)}</span>
                {opt}
              </button>
            );
          })}
        </div>
        {answered && (
          <div className="quiz-result">
            <strong>{choice === card.answer ? '🎉 Correct!' : '😅 Not quite.'}</strong> {card.explain}
            <div className="swipe-hint">Swipe up to keep learning ↑</div>
          </div>
        )}
      </div>
    </article>
  );
}

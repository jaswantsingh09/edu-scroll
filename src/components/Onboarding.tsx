import { useState } from 'react';
import type { TopicId } from '../data/topics';
import { TopicPicker } from './TopicPicker';

export function Onboarding({ onDone }: { onDone: (topics: TopicId[]) => void }) {
  const [step, setStep] = useState<0 | 1>(0);
  const [topics, setTopics] = useState<TopicId[]>([]);

  if (step === 0) {
    return (
      <div className="onboard welcome">
        <div className="welcome-art" aria-hidden>
          <div className="phone-stack">
            <span>🧮</span>
            <span>🏗️</span>
            <span>🌐</span>
          </div>
        </div>
        <h1>
          Level up as a dev.
          <br />
          <span className="grad-text">One swipe at a time.</span>
        </h1>
        <p className="muted">Bite-sized DSA, system design and full-stack lessons with quick quizzes, in a feed you already know how to use.</p>
        <button className="btn-primary" onClick={() => setStep(1)}>
          Get started
        </button>
      </div>
    );
  }

  return (
    <div className="onboard">
      <h2>What do you want to master?</h2>
      <p className="muted">Pick one or more tracks. You can change them anytime.</p>
      <TopicPicker selected={topics} onChange={setTopics} />
      <div className="onboard-footer">
        <button className="btn-primary" disabled={!topics.length} onClick={() => onDone(topics)}>
          {topics.length ? `Start scrolling · ${topics.length} track${topics.length > 1 ? 's' : ''}` : 'Pick a track'}
        </button>
      </div>
    </div>
  );
}

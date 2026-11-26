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
            <span>🪐</span>
            <span>🧠</span>
            <span>🏛️</span>
          </div>
        </div>
        <h1>
          Scroll smarter.
          <br />
          <span className="grad-text">Learn something every swipe.</span>
        </h1>
        <p className="muted">Bite-sized lessons and quick quizzes in a feed you already know how to use.</p>
        <button className="btn-primary" onClick={() => setStep(1)}>
          Get started
        </button>
      </div>
    );
  }

  return (
    <div className="onboard">
      <h2>What do you want to learn?</h2>
      <p className="muted">Pick at least one topic. You can change these anytime.</p>
      <TopicPicker selected={topics} onChange={setTopics} />
      <div className="onboard-footer">
        <button className="btn-primary" disabled={!topics.length} onClick={() => onDone(topics)}>
          {topics.length ? `Start scrolling · ${topics.length} topic${topics.length > 1 ? 's' : ''}` : 'Pick a topic'}
        </button>
      </div>
    </div>
  );
}

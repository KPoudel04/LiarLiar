import './ProgressBar.css';

export default function ProgressBar({ total, currentIndex }) {
  return (
    <section className="progress-card" aria-label="Round progress">
      <div className="progress-card-dots">
        {Array.from({ length: total }).map((_, index) => (
          <div
            key={`progress-${index}`}
            className={`progress-card-dot ${index < currentIndex ? 'complete' : ''} ${index === currentIndex ? 'active' : ''}`}
          />
        ))}
      </div>
      <span className="progress-card-label">{currentIndex + 1} of {total}</span>
    </section>
  );
}

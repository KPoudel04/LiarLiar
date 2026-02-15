import './ResultsCard.css';

function getResultsMessage(score) {
  if (score === 5) return 'Perfect score!';
  if (score >= 3) return 'Nice work!';
  return 'Better luck tomorrow!';
}

export default function ResultsCard({ score, history, nextSetCountdown }) {
  return (
    <section className="results-card" aria-live="polite">
      <h2>Complete!</h2>
      <div className="results-card-score-display">
        <span className="results-card-score-number">{score}</span>
        <span className="results-card-score-total">/5</span>
      </div>
      <p className="results-card-message">{getResultsMessage(score)}</p>
      <div className="results-card-grid">
        {history.map((round, index) => (
          <div key={`${round.gameTitle}-${index}`} className={`results-card-dot ${round.isCorrect ? 'correct' : 'incorrect'}`} />
        ))}
      </div>
      <p className="results-card-next-puzzle">Next puzzle in {nextSetCountdown}</p>
    </section>
  );
}

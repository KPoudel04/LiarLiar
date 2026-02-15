import './FeedbackBar.css';

export default function FeedbackBar({ roundSolved, lastRoundCorrect, gameIndex, totalGames, onNextRound }) {
  return (
    <section className="feedback-card" aria-live="polite">
      {roundSolved ? (
        <>
          <p className={`feedback-card-text ${lastRoundCorrect ? 'correct' : 'incorrect'}`}>
            {lastRoundCorrect ? '✓ Correct' : '✗ Incorrect'}
          </p>
          <button className="feedback-card-next" onClick={onNextRound}>
            {gameIndex === totalGames - 1 ? 'View Results' : 'Continue'}
          </button>
        </>
      ) : (
        <p className="feedback-card-hint">Select an answer</p>
      )}
    </section>
  );
}

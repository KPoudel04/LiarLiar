import './OptionsList.css';

export default function OptionsList({ facts, selectedFactId, roundSolved, onSelectFact }) {
  return (
    <section className="options-list" role="list">
      {facts.map((fact) => {
        const picked = fact.id === selectedFactId;
        const isWrong = roundSolved && picked && !fact.isFalse;
        const isAnswer = roundSolved && fact.isFalse;

        return (
          <button
            key={fact.id}
            className={`option-item ${picked ? 'picked' : ''} ${isWrong ? 'wrong' : ''} ${isAnswer ? 'correct' : ''}`}
            onClick={() => onSelectFact(fact)}
            disabled={roundSolved}
            role="listitem"
            aria-pressed={picked}
          >
            {fact.text}
          </button>
        );
      })}
    </section>
  );
}

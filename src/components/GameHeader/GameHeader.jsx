import './GameHeader.css';

export default function GameHeader({ dateLabel }) {
  return (
    <header className="game-header" role="banner">
      <h1>Find the Lie</h1>
      <p className="game-header-date">{dateLabel}</p>
    </header>
  );
}

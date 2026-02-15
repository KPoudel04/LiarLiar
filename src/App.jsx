import { useMemo, useState } from 'react';
import { getDailyPuzzleGames, getPacificDateKey } from './features/puzzles/puzzleService';
import GameHeader from './components/GameHeader/GameHeader';
import ProgressBar from './components/ProgressBar/ProgressBar';
import QuestionCard from './components/QuestionCard/QuestionCard';
import OptionsList from './components/OptionsList/OptionsList';
import FeedbackBar from './components/FeedbackBar/FeedbackBar';
import ResultsCard from './components/ResultsCard/ResultsCard';
import './App.css';

const DAILY_RESULT_STORAGE_KEY = 'liarliar:daily-result:v1';
const QUESTIONS_PER_DAY = 5;

function formatDateLabelFromPacificKey(pacificDateKey) {
  const [year, month, day] = pacificDateKey.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, 12));

  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'America/Los_Angeles'
  }).format(date);
}

function getNextSetCountdown(now = new Date()) {
  const currentPacificDateKey = getPacificDateKey(now);
  let minutes = 0;

  while (minutes < 24 * 60) {
    minutes += 1;
    const probe = new Date(now.getTime() + minutes * 60 * 1000);
    if (getPacificDateKey(probe) !== currentPacificDateKey) {
      break;
    }
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

function loadDailyResult(pacificDateKey) {
  try {
    const raw = localStorage.getItem(DAILY_RESULT_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (parsed?.dateKey !== pacificDateKey) return null;
    if (!parsed?.completed) return null;

    return parsed;
  } catch {
    return null;
  }
}

function saveDailyResult(pacificDateKey, history) {
  const score = history.filter((round) => round.isCorrect).length;

  const payload = {
    dateKey: pacificDateKey,
    completed: true,
    score,
    history
  };

  localStorage.setItem(DAILY_RESULT_STORAGE_KEY, JSON.stringify(payload));
}

function buildHistoryFromScore(score, length) {
  return Array.from({ length }, (_, index) => ({
    gameTitle: `Game ${index + 1}`,
    isCorrect: index < score
  }));
}

function resolveInitialHistory(storedResult, gamesLength) {
  if (!storedResult) return [];

  if (Array.isArray(storedResult.history) && storedResult.history.length === gamesLength) {
    return storedResult.history;
  }

  const safeScore = Math.max(0, Math.min(Number(storedResult.score) || 0, gamesLength));
  return buildHistoryFromScore(safeScore, gamesLength);
}

export default function App() {
  const pacificDateKey = useMemo(() => getPacificDateKey(new Date()), []);
  const games = useMemo(() => getDailyPuzzleGames(new Date()), [pacificDateKey]);

  const storedResult = useMemo(() => loadDailyResult(pacificDateKey), [pacificDateKey]);
  const initialHistory = useMemo(
    () => resolveInitialHistory(storedResult, games.length),
    [storedResult, games.length]
  );
  const initialGameIndex = useMemo(
    () => (storedResult ? games.length : 0),
    [storedResult, games.length]
  );

  const nextSetCountdown = useMemo(() => getNextSetCountdown(new Date()), [pacificDateKey]);
  const dateLabel = useMemo(
    () => formatDateLabelFromPacificKey(pacificDateKey),
    [pacificDateKey]
  );

  const [gameIndex, setGameIndex] = useState(initialGameIndex);
  const [selectedFactId, setSelectedFactId] = useState(null);
  const [roundSolved, setRoundSolved] = useState(false);
  const [history, setHistory] = useState(initialHistory);

  const currentGame = games[gameIndex];
  const isDone = gameIndex >= games.length;

  function onSelectFact(fact) {
    if (roundSolved) return;

    const isCorrect = fact.isFalse;
    setSelectedFactId(fact.id);
    setRoundSolved(true);
    setHistory((prev) => {
      const updated = [...prev, { gameTitle: currentGame.title, isCorrect }];
      if (updated.length === QUESTIONS_PER_DAY) {
        saveDailyResult(pacificDateKey, updated);
      }
      return updated;
    });
  }

  function onNextRound() {
    setGameIndex((prev) => prev + 1);
    setSelectedFactId(null);
    setRoundSolved(false);
  }

  const score = history.filter((round) => round.isCorrect).length;
  const lastRoundCorrect = history[history.length - 1]?.isCorrect;

  return (
    <div className="app">
      <div className="container">
        <GameHeader dateLabel={dateLabel} />

        {isDone ? (
          <ResultsCard score={score} history={history} nextSetCountdown={nextSetCountdown} />
        ) : (
          <>
            <ProgressBar total={games.length} currentIndex={gameIndex} />
            <QuestionCard title={currentGame.title} subtitle="Which statement is false?" />
            <OptionsList
              facts={currentGame.facts}
              selectedFactId={selectedFactId}
              roundSolved={roundSolved}
              onSelectFact={onSelectFact}
            />
            <FeedbackBar
              roundSolved={roundSolved}
              lastRoundCorrect={lastRoundCorrect}
              gameIndex={gameIndex}
              totalGames={games.length}
              onNextRound={onNextRound}
            />
          </>
        )}
      </div>
    </div>
  );
}

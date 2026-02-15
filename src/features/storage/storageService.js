import { getPacificDateKey } from '../puzzles/puzzleService';

const DAILY_RESULT_STORAGE_KEY = 'liarliar:daily-result:v1';

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

  export { loadDailyResult, resolveInitialHistory, getNextSetCountdown, saveDailyResult };
import questionBank from '../../data/questions.json';

const QUESTIONS_PER_DAY = 5;
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const PACIFIC_TIME_ZONE = 'America/Los_Angeles';
const pacificDatePartsFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: PACIFIC_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
});

function hashSeed(input) {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return hash >>> 0;
}

function mulberry32(seed) {
  return function next() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(items, seed) {
  const random = mulberry32(seed);
  const copy = [...items];

  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

function getDayNumberFromDateKey(dateKey) {
  const [year, month, day] = dateKey.split('-').map(Number);
  const utcMidnight = Date.UTC(year, month - 1, day);
  return Math.floor(utcMidnight / MS_PER_DAY);
}

export function getPacificDateKey(date = new Date()) {
  const parts = pacificDatePartsFormatter.formatToParts(date);
  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;
  return `${year}-${month}-${day}`;
}

function normalizeQuestion(question, questionIndex) {
  if (!Array.isArray(question.facts) || question.facts.length !== QUESTIONS_PER_DAY) {
    throw new Error(`Question at index ${questionIndex} must contain exactly ${QUESTIONS_PER_DAY} facts.`);
  }

  if (question.falseIndex < 0 || question.falseIndex >= question.facts.length) {
    throw new Error(`Question at index ${questionIndex} has an invalid falseIndex.`);
  }

  return question;
}

const questionPool = questionBank.map(normalizeQuestion);

if (questionPool.length < QUESTIONS_PER_DAY) {
  throw new Error(`Question bank must contain at least ${QUESTIONS_PER_DAY} questions.`);
}

const cycleLength = Math.ceil(questionPool.length / QUESTIONS_PER_DAY);

function pickDailyQuestions(shuffledPool, dayInCycle) {
  const start = dayInCycle * QUESTIONS_PER_DAY;
  const picked = [];

  for (let i = 0; i < QUESTIONS_PER_DAY; i += 1) {
    picked.push(shuffledPool[(start + i) % shuffledPool.length]);
  }

  return picked;
}

export function getDailyPuzzleGames(date = new Date()) {
  const pacificDateKey = getPacificDateKey(date);
  const dayNumber = getDayNumberFromDateKey(pacificDateKey);
  const cycleIndex = Math.floor(dayNumber / cycleLength);
  const dayInCycle = dayNumber % cycleLength;
  const dailyOrder = shuffle(questionPool, hashSeed(`cycle-${cycleIndex}`));
  const selectedQuestions = pickDailyQuestions(dailyOrder, dayInCycle);

  return selectedQuestions.map((question, questionIndex) => {
    const facts = question.facts.map((text, index) => ({
      id: `${question.title}-${dayNumber}-${questionIndex}-${index}`,
      text,
      isFalse: index === question.falseIndex
    }));

    return {
      ...question,
      facts: shuffle(facts, hashSeed(`${dayNumber}-${question.title}`))
    };
  });
}

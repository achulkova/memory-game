const STORAGE_KEY = 'memory-game-leaderboard';

const compareResults = (first, second) => {
  const moveDifference = first.moves - second.moves;

  if (moveDifference !== 0) {
    return moveDifference;
  }

  if (first.completedAt === null && second.completedAt === null) {
    return 0;
  }

  if (first.completedAt === null) {
    return 1;
  }

  if (second.completedAt === null) {
    return -1;
  }

  return first.completedAt - second.completedAt;
};

const normalizeResults = (results) => {
  if (!Array.isArray(results)) {
    return [];
  }

  return results
    .filter((result) => result && typeof result.moves === 'number' && Number.isFinite(result.moves) && result.moves >= 0)
    .map((result) => ({
      moves: Math.trunc(result.moves),
      completedAt:
        typeof result.completedAt === 'number' && Number.isFinite(result.completedAt) && result.completedAt >= 0
          ? result.completedAt
          : null,
    }))
    .sort(compareResults)
    .slice(0, 10);
};

export const getLeaderboardResults = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    return normalizeResults(JSON.parse(raw));
  } catch (error) {
    return [];
  }
};

export const saveLeaderboardResults = (results) => {
  const normalized = normalizeResults(results);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  } catch (error) {
    return false;
  }

  return true;
};

export const addLeaderboardResult = (moves) => {
  const nextResults = [...getLeaderboardResults(), { moves, completedAt: Date.now() }];
  return saveLeaderboardResults(nextResults);
};

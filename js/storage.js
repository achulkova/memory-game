const STORAGE_KEY = 'memory-game-leaderboard';

const normalizeResults = (results) => {
  if (!Array.isArray(results)) {
    return [];
  }

  return results
    .filter((result) => result && typeof result.moves === 'number' && Number.isFinite(result.moves) && result.moves >= 0)
    .map((result) => ({ moves: Math.trunc(result.moves) }))
    .sort((first, second) => first.moves - second.moves)
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
  const nextResults = [...getLeaderboardResults(), { moves }];
  return saveLeaderboardResults(nextResults);
};

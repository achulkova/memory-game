const createElement = (tagName, className, textContent) => {
  const element = document.createElement(tagName);

  if (className) {
    element.className = className;
  }

  if (textContent !== undefined && textContent !== null) {
    element.textContent = textContent;
  }

  return element;
};

const createCounter = (label, value) => {
  const counter = createElement('div', 'stat');
  const labelElement = createElement('span', 'stat__label', label);
  const valueElement = createElement('span', 'stat__value', value);

  counter.append(labelElement, valueElement);
  return counter;
};

const app = createElement('div', 'app');
const header = createElement('header', 'header');
const actions = createElement('div', 'header__actions');
const newGameButton = createElement('button', 'button button--primary', 'New Game');
const leaderboardButton = createElement('button', 'button button--secondary', 'Leaderboard');
const stats = createElement('div', 'header__stats');
const movesCounter = createCounter('Moves', '0');
const pairsCounter = createCounter('Pairs', '0');
const gameBoard = createElement('main', 'game-board');

actions.append(newGameButton, leaderboardButton);
stats.append(movesCounter, pairsCounter);
header.append(actions, stats);
app.append(header, gameBoard);
document.body.append(app);

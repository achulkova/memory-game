import { buildShuffledDeck, createCardElement } from './game.js';

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
const movesValue = movesCounter.lastElementChild;
const pairsCounter = createCounter('Pairs', '0');
const pairsValue = pairsCounter.lastElementChild;
const gameBoard = createElement('main', 'game-board');

const gameState = {
  selectedCards: [],
  matchedPairs: 0,
  moves: 0,
  isChecking: false,
};

const updateCounter = (counterElement, value) => {
  counterElement.textContent = String(value);
};

const setCardState = (card, isFlipped, isMatched = false) => {
  card.classList.toggle('is-flipped', isFlipped);
  card.classList.toggle('is-matched', isMatched);
};

const finishTurn = () => {
  const [firstCard, secondCard] = gameState.selectedCards;

  if (!firstCard || !secondCard) {
    return;
  }

  if (firstCard.dataset.name === secondCard.dataset.name) {
    setCardState(firstCard, true, true);
    setCardState(secondCard, true, true);
    gameState.matchedPairs += 1;
    updateCounter(pairsValue, gameState.matchedPairs);
    gameState.selectedCards = [];
    gameState.isChecking = false;

    if (gameState.matchedPairs === 8) {
      gameState.isChecking = true;
    }

    return;
  }

  gameState.isChecking = true;
  window.setTimeout(() => {
    setCardState(firstCard, false, false);
    setCardState(secondCard, false, false);
    gameState.selectedCards = [];
    gameState.isChecking = false;
  }, 600);
};

const handleCardClick = (event) => {
  const card = event.currentTarget;

  if (gameState.isChecking || card.classList.contains('is-matched') || card.classList.contains('is-flipped')) {
    return;
  }

  setCardState(card, true, false);
  gameState.selectedCards.push(card);

  if (gameState.selectedCards.length < 2) {
    return;
  }

  gameState.moves += 1;
  updateCounter(movesValue, gameState.moves);

  finishTurn();
};

const resetBoard = () => {
  while (gameBoard.firstChild) {
    gameBoard.removeChild(gameBoard.firstChild);
  }

  gameState.selectedCards = [];
  gameState.matchedPairs = 0;
  gameState.moves = 0;
  gameState.isChecking = false;

  updateCounter(movesValue, 0);
  updateCounter(pairsValue, 0);

  const deck = buildShuffledDeck();

  deck.forEach((faceName) => {
    const card = createCardElement(faceName, handleCardClick);
    gameBoard.append(card);
  });
};

newGameButton.addEventListener('click', resetBoard);

actions.append(newGameButton, leaderboardButton);
stats.append(movesCounter, pairsCounter);
header.append(actions, stats);
app.append(header, gameBoard);
document.body.append(app);

resetBoard();

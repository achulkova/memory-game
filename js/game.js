import { createCardDeck } from './data.js';

export const shuffleCards = (cards) => {
  const shuffled = [...cards];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
};

export const buildShuffledDeck = () => shuffleCards(createCardDeck());

export const createCardElement = (faceName, onClick) => {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'memory-card';
  card.dataset.name = faceName;

  const inner = document.createElement('span');
  inner.className = 'memory-card__inner';

  const frontFace = document.createElement('span');
  frontFace.className = 'memory-card__face memory-card__face--front';

  const backFace = document.createElement('span');
  backFace.className = 'memory-card__face memory-card__face--back';

  const frontImage = document.createElement('img');
  frontImage.src = `./assets/images/${faceName}.png`;
  frontImage.alt = faceName;
  frontImage.loading = 'lazy';

  const backImage = document.createElement('img');
  backImage.src = './assets/images/card-back.png';
  backImage.alt = 'Memory card back';
  backImage.loading = 'lazy';

  frontFace.append(frontImage);
  backFace.append(backImage);
  inner.append(frontFace, backFace);
  card.append(inner);

  if (onClick) {
    card.addEventListener('click', onClick);
  }

  return card;
};

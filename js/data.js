export const CARD_FACES = [
  'astronaut',
  'comet',
  'moon',
  'planet',
  'rocket',
  'satellite',
  'star',
  'ufo',
];

export const createCardDeck = () => {
  const deck = [];

  CARD_FACES.forEach((faceName) => {
    deck.push(faceName, faceName);
  });

  return deck;
};

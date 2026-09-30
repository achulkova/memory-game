const createButton = (label, className, onClick) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = className;
  button.textContent = label;

  if (typeof onClick === 'function') {
    button.addEventListener('click', onClick);
  }

  return button;
};

export const createVictoryModal = ({ onClose, onNewGame }) => {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.setAttribute('aria-hidden', 'true');

  const dialog = document.createElement('div');
  dialog.className = 'modal';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-labelledby', 'victory-modal-title');

  const title = document.createElement('h2');
  title.id = 'victory-modal-title';
  title.className = 'modal__title';
  title.textContent = 'You won!';

  const summary = document.createElement('p');
  summary.className = 'modal__summary';
  summary.textContent = 'You found all 8 space pairs.';

  const moves = document.createElement('p');
  moves.className = 'modal__moves';
  moves.textContent = 'Moves: 0';

  const actions = document.createElement('div');
  actions.className = 'modal__actions';

  const newGameButton = createButton('New Game', 'button button--primary', () => {
    if (typeof onNewGame === 'function') {
      onNewGame();
    }
    closeModal();
  });

  const closeButton = createButton('Close', 'button button--secondary', () => {
    if (typeof onClose === 'function') {
      onClose();
    }
    closeModal();
  });

  const closeModal = () => {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
  };

  const openModal = (moveCount) => {
    moves.textContent = `Moves: ${moveCount}`;
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
  };

  actions.append(newGameButton, closeButton);
  dialog.append(title, summary, moves, actions);
  overlay.append(dialog);

  return {
    element: overlay,
    open: openModal,
    close: closeModal,
  };
};

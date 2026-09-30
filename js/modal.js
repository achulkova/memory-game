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

const createModalShell = (titleText) => {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.setAttribute('aria-hidden', 'true');

  const dialog = document.createElement('div');
  dialog.className = 'modal';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');

  const title = document.createElement('h2');
  title.className = 'modal__title';
  title.textContent = titleText;

  const content = document.createElement('div');
  content.className = 'modal__content';

  const actions = document.createElement('div');
  actions.className = 'modal__actions';

  dialog.append(title, content, actions);
  overlay.append(dialog);

  return { overlay, dialog, content, actions };
};

export const createVictoryModal = ({ onClose, onNewGame }) => {
  const { overlay, dialog, content, actions } = createModalShell('You won!');
  dialog.setAttribute('aria-labelledby', 'victory-modal-title');
  const title = dialog.querySelector('.modal__title');
  title.id = 'victory-modal-title';

  const summary = document.createElement('p');
  summary.className = 'modal__summary';
  summary.textContent = 'You found all 8 space pairs.';

  const moves = document.createElement('p');
  moves.className = 'modal__moves';
  moves.textContent = 'Moves: 0';

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
  content.append(summary, moves);

  return {
    element: overlay,
    open: openModal,
    close: closeModal,
  };
};

export const createLeaderboardModal = ({ onClose, getResults }) => {
  const { overlay, dialog, content, actions } = createModalShell('Leaderboard');
  dialog.classList.add('modal--wide');
  dialog.setAttribute('aria-labelledby', 'leaderboard-modal-title');
  const title = dialog.querySelector('.modal__title');
  title.id = 'leaderboard-modal-title';

  const list = document.createElement('ul');
  list.className = 'leaderboard__list';

  const emptyMessage = document.createElement('p');
  emptyMessage.className = 'leaderboard__empty';
  emptyMessage.textContent = 'No games played yet';

  const closeButton = createButton('Close', 'button button--secondary', () => {
    if (typeof onClose === 'function') {
      onClose();
    }
    closeModal();
  });

  const renderList = (results) => {
    while (content.firstChild) {
      content.removeChild(content.firstChild);
    }

    if (!results || results.length === 0) {
      content.append(emptyMessage);
      return;
    }

    const sortedResults = [...results]
      .filter((result) => result && typeof result.moves === 'number' && Number.isFinite(result.moves))
      .sort((first, second) => first.moves - second.moves)
      .slice(0, 10);

    if (sortedResults.length === 0) {
      content.append(emptyMessage);
      return;
    }

    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }

    sortedResults.forEach((result, index) => {
      const item = document.createElement('li');
      item.className = 'leaderboard__item';
      item.textContent = `${index + 1}. ${result.moves} moves`;
      list.append(item);
    });

    content.append(list);
  };

  const closeModal = () => {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
  };

  const openModal = () => {
    const results = typeof getResults === 'function' ? getResults() : [];
    renderList(results);
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
  };

  actions.append(closeButton);

  return {
    element: overlay,
    open: openModal,
    close: closeModal,
  };
};

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

  const setScrollLock = (isLocked) => {
    document.documentElement.classList.toggle('modal-open', isLocked);
    document.body.classList.toggle('modal-open', isLocked);
  };

  const closeModal = () => {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    setScrollLock(false);
  };

  const openModal = () => {
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    setScrollLock(true);
  };

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && overlay.classList.contains('is-open')) {
      closeModal();
    }
  });

  return { overlay, dialog, content, actions, openModal, closeModal };
};

export const createVictoryModal = ({ onClose, onNewGame }) => {
  const {
    overlay,
    dialog,
    content,
    actions,
    openModal: shellOpenModal,
    closeModal: shellCloseModal,
  } = createModalShell('You won!');
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
    shellCloseModal();
  });

  const closeButton = createButton('Close', 'button button--secondary', () => {
    if (typeof onClose === 'function') {
      onClose();
    }
    shellCloseModal();
  });

  const openModal = (moveCount) => {
    moves.textContent = `Moves: ${moveCount}`;
    shellOpenModal();
  };

  actions.append(newGameButton, closeButton);
  content.append(summary, moves);

  return {
    element: overlay,
    open: openModal,
    close: shellCloseModal,
  };
};

export const createLeaderboardModal = ({ onClose, getResults }) => {
  const {
    overlay,
    dialog,
    content,
    actions,
    openModal: shellOpenModal,
    closeModal: shellCloseModal,
  } = createModalShell('Leaderboard');
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
    shellCloseModal();
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
      .sort((first, second) => {
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
      })
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
      const date = result.completedAt === null ? 'Unknown date' : new Date(result.completedAt);
      const formattedDate =
        date === 'Unknown date'
          ? date
          : `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
      item.textContent = `${index + 1}. ${result.moves} moves - ${formattedDate}`;
      list.append(item);
    });

    content.append(list);
  };

  const openModal = () => {
    const results = typeof getResults === 'function' ? getResults() : [];
    renderList(results);
    shellOpenModal();
  };

  actions.append(closeButton);

  return {
    element: overlay,
    open: openModal,
    close: shellCloseModal,
  };
};

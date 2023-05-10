import style from './startNewGameModal.css';

/** @implements {Component<null>} */
class RestartGameModal {
  handleRestartRequest = (/** @type {() => void} */ restartHandler) => {
    restartHandler();
  };

  render() {
    const divRoot = document.createElement('div');
    divRoot.classList.add('restart-modal');

    const restartMessageContainer = document.createElement('div');
    const restartMessage = document.createElement('span');
    restartMessage.textContent = 'Do you want to restart the game?';
    restartMessageContainer.appendChild(restartMessage);

    const restartButtonsDiv = document.createElement('div');
    restartButtonsDiv.classList.add('restart-options__flex');

    const restartButton = document.createElement('button');
    restartButton.type = 'button';
    restartButton.textContent = 'Yes';
    restartButton.addEventListener('click', () => this.handleRestartRequest);

    const closeWindowButton = document.createElement('button');
    closeWindowButton.type = 'button';
    closeWindowButton.textContent = 'No';

    closeWindowButton.addEventListener('click', () => {
      divRoot.parentElement?.removeChild(divRoot);
    });

    restartButtonsDiv.append(restartButton, closeWindowButton);

    divRoot.append(restartMessageContainer, restartButtonsDiv);

    return divRoot;
  }
}

export { RestartGameModal };

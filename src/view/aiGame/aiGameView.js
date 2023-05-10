/**
 * @typedef {Object} AIGameState
 * @property {{boardState: import("../../service/gameboard").GameboardDto, player: import("../../service/player").PlayerDto}} computer
 * @property {{boardState: import("../../service/gameboard").GameboardDto, player: import("../../service/player").PlayerDto}} player
 * @property {?import('../../service/player').PlayerDto} winner
 */

import { Board } from '../../components/board/board';
import { EnemyBoard } from '../../components/enemyBoard/enemyBoard';
import style from './aiGameView.css';

/** @implements {UpdatableView<AIGameState>} */
class AIGameView {
  /**
   * @param {Board} playerBoard
   * @param {EnemyBoard} computerBoard
   * @param {AIGameState} gameState
   */
  constructor(playerBoard, computerBoard, gameState) {
    this.playerBoard = playerBoard;
    this.computerBoard = computerBoard;
    this.state = gameState;

    this.root = document.createElement('div');
    this.winner = document.createElement('div');

    /** handle player moves */
    this.computerBoard.handleHit = this.computerBoard.handleHit.bind(
      this,
      this.handlePlayerMoveFromComputerBoard
    );
  }

  /** @param {AIGameState} gameState */
  update(gameState) {
    this.state = gameState;
    const { board: computerState } = gameState.computer.boardState;
    const { board: playerState } = gameState.player.boardState;
    this.computerBoard.update({ board: computerState });
    this.playerBoard.update({ board: playerState });

    if (this.state.winner)
      this.#displayWinner()
  }

  #displayWinner() {
    this.winner.textContent = `${this.state.winner?.name} has won!`;
  }

  /** direct player moves to controller */
  handlePlayerMoveFromComputerBoard = (move) => {
    this.handleMove(move); 
  };

  handleMove = (handler, move) => {
    handler(move)
  };

  render() {
    this.winner.classList.add('grid-winner-header');

    const playerSection = document.createElement('section');
    const playerName = document.createElement('span');
    playerName.textContent = `${this.state.player.player.name}'s board`;
    playerName.classList.add('board-label__centered', 'board-label__font');
    playerSection.classList.add('board-section', 'grid-first-board');
    playerSection.append(playerName, this.playerBoard.render());

    const enemySection = document.createElement('section');
    const enemyName = document.createElement('span');
    enemyName.textContent = `${this.state.computer.player.name}'s board`;
    enemyName.classList.add('board-label__centered', 'board-label__font');
    enemySection.classList.add('board-section', 'grid-second-board');
    enemySection.append(enemyName, this.computerBoard.render());

    this.root.classList.add('screen-boards-split');
    this.root.append(this.winner, playerSection, enemySection);

    return this.root;
  }
}

export { AIGameView };

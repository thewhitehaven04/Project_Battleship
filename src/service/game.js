import { PubSub } from '../utils/eventBus';
import { Gameboard } from './gameboard';
import { PLAYER_MOVE_EVENT, Player } from './player';

class GameLoop {
  #boards;
  #turn;
  #lastMoveProcessed;

  /**
   * @param {[Player, Player]} players
   * @param {[Gameboard, Gameboard]} boards
   */
  constructor(players, boards) {
    this.eventBus = new PubSub();
    this.#boards = [
      {
        playerName: players[0].name,
        player: players[0],
        board: boards[0],
      },
      {
        playerName: players[1].name,
        player: players[1],
        board: boards[1],
      },
    ];
    this.eventBus.subscribe(PLAYER_MOVE_EVENT, this.processMove);

    this.#turn = null;
    this.winner = null;
    this.#lastMoveProcessed = true;
  }

  /** @param {{name: String}} playerName */
  #getBoardByName({ name }) {
    return this.#boards.find((board) => board.playerName === name);
  }

  /**
   * @param {import('./player').PlayerMoveEventDto} playerMoveEventDto
   */
  processMove(playerMoveEventDto) {
    this.#getBoardByName(playerMoveEventDto)?.receiveAttack(
      playerMoveEventDto.coordinates,
    );
    this.#lastMoveProcessed = true;
  }

  /**
   * Return a player eligible for next move
   * @returns {Player}
   */
  requestNextMove() {
    if ((this.winner === null) && this.#lastMoveProcessed) {
      this.#turn = this.#boards[0].player
        ? this.#turn === this.#boards[1].player
        : this.#boards[1].player;
      this.#lastMoveProcessed = false;
    }
    return this.#turn;
  }
}

export { GameLoop };

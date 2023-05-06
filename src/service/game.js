import { PubSub } from '../utils/eventBus';
import { ALL_SHIPS_DESTROYED_EVENT, Gameboard } from './gameboard';
import { PLAYER_MOVE_EVENT, Player } from './player';

/** @typedef {{winner: import('./player').PlayerDto}} GameFinishedEvent */

/**
 * @typedef {Array<{
 *  player: import('./player').PlayerDto,
 *  boardState: import('./gameboard').GameboardDto
 * }>} GameState
 */

const GAME_FINISHED_EVENT = 'GameFinishedEvent';

class Game {
  #counter = 0;

  /** @type {Boolean} */
  #lastMoveProcessed;

  /**
   * @param {[Player, Player]} players
   * @param {[Gameboard, Gameboard]} boards
   * @param {PubSub} pubSub
   */
  constructor(players, boards, pubSub) {
    this.eventBus = pubSub;
    this.boardSize = boards[0].size;
    this.playerBoards = [
      {
        player: players[0],
        board: boards[0],
      },
      {
        player: players[1],
        board: boards[1],
      },
    ];
    this.eventBus.subscribe(PLAYER_MOVE_EVENT, this.#processMove);
    this.eventBus.subscribe(ALL_SHIPS_DESTROYED_EVENT, this.#gameFinished);
  }

  /**
   * Returns the player whose turn it is to play.
   * @returns {Player}
   */
  nextTurn() {
    const nextTurnPlayer = this.playerBoards[this.#counter % 2].player;
    this.#lastMoveProcessed = false;
    return nextTurnPlayer;
  }

  /**
   * @param {Player} player
   * @returns {?Array<import('./gameboard').BoardCoordinates>}
   */
  getMissedHitsForPlayer(player) {
    return (
      this.playerBoards
        .find((pb) => pb.player !== player)
        ?.board.getMissedHits() ?? null
    );
  }

  /**
   * @param {import('./player').PlayerMoveEventDto} moveEvent
   */
  #processMove = (moveEvent) => {
    if (!this.#lastMoveProcessed) {
      const boardReceivingHit = this.playerBoards
        .filter((pb) => pb.player.name !== moveEvent.name)
        .pop()?.board;
      boardReceivingHit?.receiveAttack(moveEvent.coordinates);

      // next turn is performed by different player
      this.#counter++;
      this.#lastMoveProcessed = true;
    }
  };

  #gameFinished = () =>
    this.eventBus.notify(GAME_FINISHED_EVENT, {
      winner: this.playerBoards[this.#counter % 2].player.toJSON(),
    });

  /** @returns {GameState} */
  toJSON() {
    return this.playerBoards.map((pb) => {
      return {
        player: pb.player.toJSON(),
        boardState: pb.board.toJSON(),
      };
    });
  }
}

export { Game, GAME_FINISHED_EVENT };

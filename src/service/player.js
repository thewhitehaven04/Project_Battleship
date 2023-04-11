import { PubSub } from '../utils/eventBus';

const PLAYER_MOVE_EVENT = 'playerMove';

/**
 * @typedef {Object} playerMoveRequest
 * @property {String} name
 */

/**
 * @typedef {Object} PlayerMoveEventDto
 * @property {String} name
 * @property {import('./gameboard').BoardCoordinates} coordinates
 */

class Player {
  #pubSub;

  /**
   * @param {String} name
   * @param {PubSub} pubSub
   */
  constructor(name, pubSub) {
    this.name = name;
    this.#pubSub = pubSub;
  }

  /** @param {import("./gameboard").BoardCoordinates} cell */
  performMove(cell) {
    this.#pubSub.notify(PLAYER_MOVE_EVENT, {
      name: this.name,
      coordinates: cell,
    });
  }
}

export { Player, PLAYER_MOVE_EVENT };

import { PubSub } from '../utils/eventBus';

/** @typedef {{name: String}} PlayerDto */

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
  /**
   * @param {String} name
   * @param {PubSub} pubSub
   */
  constructor(name, pubSub) {
    this.name = name;
    this.pubSub = pubSub;
  }

  /** @param {import("./gameboard").BoardCoordinates} cell */
  performMove(cell) {
    this.pubSub.notify(PLAYER_MOVE_EVENT, {
      name: this.name,
      coordinates: cell,
    });
  }

  /** @returns {PlayerDto} */
  toJSON() {
    return {
      name: this.name 
    }
  }
}

export { Player, PLAYER_MOVE_EVENT };

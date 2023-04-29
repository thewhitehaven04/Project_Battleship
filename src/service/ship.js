
/**
 * @readonly
 * @enum {ShipDto}
 */
const ShipType = Object.freeze({
  CARRIER: { type: 'carrier', length: 5 },
  SUB: { type: 'submarine', length: 4 },
  CRUISER: { type: 'cruiser', length: 3 },
  DESTROYER: { type: 'destroyer', length: 2 },
  BATTLESHIP: { type: 'battleship', length: 4 },
});

/**
 * @typedef {Object} ShipDto
 * @property {String} type
 * @property {Number} length
 * @property {Boolean} [isSunk]
 */

class Ship {
  /**
   * Construct a new `Ship` instance.
   * @param {String} type ship type
   * @param {Number} length ship length
   */
  constructor(type, length) {
    if (!Number.isInteger(length) && length >= 1)
      throw new RangeError('Ship length must be a positive integer number');
    this.type = type;
    this.length = length;
    this.hits = 0;
  }

  hit() {
    this.hits++;
  }

  isSunk() {
    return this.hits >= this.length;
  }

  /**
   * @returns {ShipDto}
   */
  toJSON() {
    return {
      type: this.type,
      length: this.length,
      isSunk: this.isSunk(),
    };
  }
}

/**
 * @module
 * @exports ShipDto
 * @exports Ship
 * @exports ShipType
 */

export { Ship, ShipType };

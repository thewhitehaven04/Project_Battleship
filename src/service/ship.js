/**
 * @readonly
 * @enum {String}
 */
const ShipType = Object.freeze({
  CARRIER: 'carrier',
  SUB: 'submarine',
  CRUISER: 'cruiser',
  DESTROYER: 'destroyer',
  BATTLESHIP: 'battleship',
});

/**
 * @typedef {Object} ShipDto
 * @property {ShipType} type
 * @property {Number} length 
 * @property {Boolean} isSunk 
 */

class Ship {
  /**
   * Construct a new `Ship` instance.
   * @param {Number} length ship length
   * @param {ShipType} type ship type
   */
  constructor(length, type) {
    if (!Number.isInteger(length) && length >= 1)
      throw new RangeError('Ship length must be a positive integer number');
    this.length = length;
    this.hits = 0;
    this.type = type;
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

const createCarrier = () => new Ship(5, ShipType.CARRIER);
const createBattleship = () => new Ship(4, ShipType.BATTLESHIP);
const createSubmarine = () => new Ship(3, ShipType.SUB);
const createCruiser = () => new Ship(3, ShipType.CRUISER);
const createDestroyer = () => new Ship(2, ShipType.DESTROYER);

export {
  Ship,
  ShipType,
  createBattleship,
  createCarrier,
  createCruiser,
  createDestroyer,
  createSubmarine,
};

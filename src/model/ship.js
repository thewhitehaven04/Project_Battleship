class Ship {
  /**
   * Construct a new `Ship` instance.
   * @param {Number} length ship length
   */
  constructor(length) {
    if (!Number.isInteger(length) && length >= 1)
      throw new RangeError('Ship length must be a positive integer number');
    this.length = length;
    this.hits = 0;
  }

  hit() {
    this.hits++;
  }

  isSunk() {
    return this.hits >= this.length;
  }
}

const createCarrier = () => new Ship(5);
const createBattleship = () => new Ship(4);
const createSubmarine = () => new Ship(3);
const createCruiser = () => new Ship(3);
const createDestroyer = () => new Ship(2);

export { Ship, createBattleship, createCarrier, createCruiser, createDestroyer, createSubmarine };

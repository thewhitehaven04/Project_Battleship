class Ship {
  /**
   * Construct a new `Ship` instance.
   * @param {Number} length ship length 
   */
  constructor(length) {
    this.length = length;
    this.hits = 0;
    this.hasSunk = false;
  }
}


export { Ship };
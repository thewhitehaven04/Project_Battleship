const { Ship } = require('../src/model/ship');

it('Ship object initialization', () => {
  const hasbroDestroyer = new Ship(3);
  expect(hasbroDestroyer.length).toBe(3);
  expect(hasbroDestroyer.hits).toBe(0);
  expect(hasbroDestroyer.isSunk()).toBe(false);
});

it('Ship length can only be positive number', () => {
  expect(() => new Ship(1.5)).toThrowError(RangeError);
});

it('Ship gets a hit', () => {
  const ship = new Ship(2);
  ship.hit();

  expect(ship.hits).toBe(1);
});

it('Ship gets sunk after getting hit more times than its length', () => {
  const length = 3;
  const ship = new Ship(length);
  for (let i = 0; i < length + 1; i++) {
    ship.hit();
  }

  expect(ship.isSunk()).toBe(true);
});
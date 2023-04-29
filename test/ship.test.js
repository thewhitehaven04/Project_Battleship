import { Ship, ShipType } from '../src/service/ship';

it('Ship object initialization', () => {
  const { type } = ShipType.DESTROYER;

  const hasbroDestroyer = new Ship(type, 3);
  expect(hasbroDestroyer.length).toBe(3);
  expect(hasbroDestroyer.hits).toBe(0);
  expect(hasbroDestroyer.isSunk()).toBe(false);
});

it('Ship length can only be positive integer number', () => {
  expect(() => new Ship(ShipType.DESTROYER.type, 1.2)).toThrowError(RangeError);
});

it('Ship gets a hit', () => {
  const ship = new Ship(ShipType.DESTROYER.type, 2);
  ship.hit();

  expect(ship.hits).toBe(1);
});

it('Ship gets sunk after getting hit more times than its length', () => {
  const { type, length } = ShipType.DESTROYER;
  const ship = new Ship(type, length);
  for (let i = 0; i < length + 1; i++) {
    ship.hit();
  }

  expect(ship.isSunk()).toBe(true);
});
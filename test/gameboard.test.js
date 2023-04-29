import { PubSub } from '../src/utils/eventBus';
import { Ship, ShipType } from '../src/service/ship';
import { Gameboard } from './../src/service/gameboard';

it('Initializing gameboard', () => {
  const gameboard = new Gameboard(10, new PubSub());

  expect(gameboard.board.length).toEqual(10);
  expect(gameboard.board[0].length).toEqual(10);
});

it('Create a ship in the middle of the board', () => {
  const gb = new Gameboard(10, new PubSub());
  const { type, length } = ShipType.BATTLESHIP;

  expect(gb.placeShip({ x: 3, y: 3 }, () => new Ship(type, length))).toEqual(
    new Ship(type, length),
  );
});

it('Create a horizontal ship outside the bounds of the board', () => {
  const gb = new Gameboard(10, new PubSub());
  const { type, length } = ShipType.CARRIER;
  expect(() =>
    gb.placeShip({ x: 9, y: 7 }, () => new Ship(type, length)),
  ).toThrowError(RangeError);
});

it('Create a vertical ship outside the bounds of the board', () => {
  const gb = new Gameboard(10, new PubSub());
  const { type, length } = ShipType.CRUISER;
  expect(() =>
    gb.placeShip({ x: 8, y: 8 }, () => new Ship(type, length), true),
  ).toThrowError(RangeError);
});

it('Create a ship adjacent to a bound of the board', () => {
  const gb = new Gameboard(10, new PubSub());
  const { type, length } = ShipType.DESTROYER;
  expect(
    gb.placeShip({ x: 8, y: 8 }, () => new Ship(type, length), true),
  ).toEqual(new Ship(type, length));
});

it('Create a ship adjacent to a bound of the board', () => {
  const gb = new Gameboard(10, new PubSub());
  const { type, length } = ShipType.DESTROYER;
  expect(() =>
    gb.placeShip({ x: -2, y: -2 }, () => new Ship(type, length), true),
  ).toThrowError(RangeError);
});

it('Ship gets hit', () => {
  const gb = new Gameboard(6, new PubSub());
  const { type, length } = ShipType.SUB;
  const sub = gb.placeShip({ x: 2, y: 1 }, () => new Ship(type, length));
  gb.receiveAttack({ x: 3, y: 1 });

  expect(gb.board[3][1].isHit).toBe(true);
  expect(sub.hits).toEqual(1);
});

it('Ship gets destroyed with enough hits', () => {
  const gb = new Gameboard(5, new PubSub());
  const { type, length } = ShipType.CRUISER;

  const sub = gb.placeShip({ x: 2, y: 1 }, () => new Ship(type, length));
  gb.receiveAttack({ x: 2, y: 1 });
  gb.receiveAttack({ x: 3, y: 1 });
  gb.receiveAttack({ x: 4, y: 1 });
  expect(sub.hits).toEqual(3);
  expect(sub.isSunk()).toBe(true);
});

it('Player misses a shot', () => {
  const gb = new Gameboard(8, new PubSub());
  const { type, length } = ShipType.SUB;
  const sub = gb.placeShip({ x: 2, y: 1 }, () => new Ship(type, length));
  gb.receiveAttack({ x: 4, y: 4 });
  expect(sub.hits).toEqual(0);
  expect(gb.board[4][4].isHit).toBe(true);
});

it('Conflicting ship positioning triggers error', () => {
  const gb = new Gameboard(8, new PubSub());

  const sub = gb.placeShip(
    { x: 2, y: 1 },
    () => new Ship(ShipType.SUB.type, ShipType.SUB.length),
  );
  expect(() =>
    gb.placeShip(
      { x: 2, y: 1 },
      () => new Ship(ShipType.CRUISER.type, ShipType.CRUISER.length),
      true,
    ),
  ).toThrow(RangeError);
});

it('Get all missing hits', () => {
  const gb = new Gameboard(4, new PubSub());
  gb.receiveAttack({ x: 1, y: 1 });
  gb.receiveAttack({ x: 2, y: 2 });
  gb.receiveAttack({ x: 3, y: 1 });

  const missedHits = gb.getMissedHits();
  expect(missedHits).toContainEqual({ x: 1, y: 1 });
  expect(missedHits).toContainEqual({ x: 2, y: 2 });
  expect(missedHits).toContainEqual({ x: 3, y: 1 });
});

it('Missing hits do not contain hits on ships', () => {
  const gb = new Gameboard(6, new PubSub());

  const { type, length } = ShipType.CRUISER;
  gb.placeShip({ x: 2, y: 2 }, () => new Ship(type, length));
  gb.receiveAttack({ x: 3, y: 2 });
  gb.receiveAttack({ x: 3, y: 3 });
  gb.receiveAttack({ x: 4, y: 4 });

  const missedHits = gb.getMissedHits();
  expect(missedHits).toHaveLength(2);
  expect(missedHits).toContainEqual({ x: 3, y: 3 });
  expect(missedHits).toContainEqual({ x: 4, y: 4 });
});

it('Ship placement coordinate mapping', () => {
  const gb = new Gameboard(5, new PubSub());
  const { type, length } = ShipType.DESTROYER;
  gb.placeShip({ x: 1, y: 1 }, () => new Ship(type, length));

  expect(gb.board[1][1].ship && gb.board[2][1].ship).toBeTruthy();
});

it('Ship placement adjacent to top-left edge', () => {
  const gb = new Gameboard(5, new PubSub());
  const { type, length } = ShipType.DESTROYER;
  gb.placeShip({ x: 0, y: 0 }, () => new Ship(type, length));

  expect(gb.board[0][0].ship && gb.board[1][0].ship).toBeTruthy();
});

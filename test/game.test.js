import { GAME_FINISHED_EVENT, Game } from '../src/service/game';
import {
  ALL_SHIPS_DESTROYED_EVENT,
  Gameboard,
} from '../src/service/gameboard';
import { Player } from '../src/service/player';
import { Ship, ShipType } from '../src/service/ship';
import { PubSub } from '../src/utils/eventBus';

it('Players moves alternate', () => {
  const ps = new PubSub();

  const playerJim = new Player('Jim', ps);
  const playerHarry = new Player('Harry', ps);

  const gbJim = new Gameboard(5, ps);

  const {type, length} = ShipType.DESTROYER

  gbJim.placeShip({ x: 1, y: 1 }, () => new Ship(type, length));

  const gbHarry = new Gameboard(5, ps);
  gbHarry.placeShip({ x: 2, y: 2 }, () => new Ship(type, length));

  const loop = new Game([playerJim, playerHarry], [gbJim, gbHarry], ps);

  const firstPlayer = loop.nextTurn();
  firstPlayer.performMove({ x: 1, y: 1 });
  const secondPlayer = loop.nextTurn();
  secondPlayer.performMove({ x: 1, y: 1 });

  const firstPlayerAgain = loop.nextTurn();
  firstPlayerAgain.performMove({ x: 2, y: 2 });
  const secondPlayerAgain = loop.nextTurn();
  secondPlayerAgain.performMove({ x: 2, y: 2 });

  expect(Object.is(firstPlayer, secondPlayer)).toBeFalsy();
  expect(Object.is(firstPlayerAgain, secondPlayerAgain)).toBeFalsy();
  expect(Object.is(firstPlayer, firstPlayerAgain)).toBeTruthy();
  expect(Object.is(secondPlayer, secondPlayerAgain)).toBeTruthy();
});

it('Do not alternate players until a move is performed by the last player', () => {
  const ps = new PubSub();

  const playerJim = new Player('Jim', ps);
  const playerHarry = new Player('Harry', ps);
  const { type, length } = ShipType.DESTROYER;

  const gbJim = new Gameboard(5, ps);
  gbJim.placeShip({ x: 1, y: 1 }, () => new Ship(type, length));

  const gbHarry = new Gameboard(5, ps);
  gbHarry.placeShip({ x: 2, y: 2 }, () => new Ship(type, length));

  const loop = new Game([playerJim, playerHarry], [gbJim, gbHarry], ps);

  const firstPlayer = loop.nextTurn();
  const secondPlayer = loop.nextTurn();
  expect(Object.is(firstPlayer, secondPlayer)).toBeTruthy();
});

it('First player', () => {
  const ps = new PubSub();

  const playerJim = new Player('Jim', ps);
  const playerHarry = new Player('Harry', ps);

  const { type, length } = ShipType.DESTROYER;
  const gbJim = new Gameboard(5, ps);
  gbJim.placeShip({ x: 1, y: 1 }, () => new Ship(type, length));

  const gbHarry = new Gameboard(5, ps);
  gbHarry.placeShip({ x: 2, y: 2 }, () => new Ship(type, length));

  const loop = new Game([playerJim, playerHarry], [gbJim, gbHarry], ps);
  expect(Object.is(loop.nextTurn(), playerJim)).toBeTruthy();
});

it('Move processing integration', () => {
  const ps = new PubSub();

  const playerJim = new Player('Jim', ps);
  const playerHarry = new Player('Harry', ps);

  const { type, length } = ShipType.DESTROYER;
  const gbJim = new Gameboard(5, ps);
  gbJim.placeShip({ x: 1, y: 1 }, () => new Ship(type, length));

  const gbHarry = new Gameboard(5, ps);
  gbHarry.placeShip({ x: 2, y: 2 }, () => new Ship(type, length));

  const loop = new Game([playerJim, playerHarry], [gbJim, gbHarry], ps);
  loop.nextTurn().performMove({ x: 3, y: 3 });

  expect(gbHarry.getMissedHits()).toContainEqual({ x: 3, y: 3 });
});

it('Successive hits from the same player are not allowed', () => {
  const ps = new PubSub();

  const playerJim = new Player('Jim', ps);
  const playerHarry = new Player('Harry', ps);

  const { type, length } = ShipType.DESTROYER;
  const gbJim = new Gameboard(5, ps);
  gbJim.placeShip({ x: 1, y: 1 }, () => new Ship(type, length));

  const gbHarry = new Gameboard(5, ps);
  gbHarry.placeShip({ x: 2, y: 2 }, () => new Ship(type, length));

  const loop = new Game([playerJim, playerHarry], [gbJim, gbHarry], ps);
  const player = loop.nextTurn();
  player.performMove({ x: 4, y: 4 });
  player.performMove({ x: 3, y: 4 });

  const missed = gbHarry.getMissedHits();
  expect(missed).toHaveLength(1);
  expect(missed).toContainEqual({ x: 4, y: 4 });
});

it('AllShipsDestroyed event is produced when all ships are destroyed', () => {
  const ps = new PubSub();
  const spyNotify = jest.spyOn(ps, 'notify');

  const playerJim = new Player('Jim', ps);
  const playerHarry = new Player('Harry', ps);

  const { type, length } = ShipType.DESTROYER;
  const gbJim = new Gameboard(5, ps);
  gbJim.placeShip({ x: 1, y: 1 }, () => new Ship(type, length));

  const gbHarry = new Gameboard(5, ps);
  gbHarry.placeShip({ x: 2, y: 2 }, () => new Ship(type, length));

  const loop = new Game([playerJim, playerHarry], [gbJim, gbHarry], ps);
  loop.nextTurn().performMove({ x: 2, y: 2 });
  loop.nextTurn().performMove({ x: 1, y: 1 });
  loop.nextTurn().performMove({ x: 3, y: 2 });

  expect(spyNotify).toHaveBeenCalledWith(
    ALL_SHIPS_DESTROYED_EVENT,
    gbHarry.toJSON(),
  );
});

it('GameFinished event is produced when all ships are destroyed', () => {
  const ps = new PubSub();
  const spyNotify = jest.spyOn(ps, 'notify');

  const playerJim = new Player('Jim', ps);
  const playerHarry = new Player('Harry', ps);

  const { type, length } = ShipType.DESTROYER;
  const gbJim = new Gameboard(5, ps);
  gbJim.placeShip({ x: 1, y: 1 }, () => new Ship(type, length));

  const gbHarry = new Gameboard(5, ps);
  gbHarry.placeShip({ x: 2, y: 2 }, () => new Ship(type, length));

  const loop = new Game([playerJim, playerHarry], [gbJim, gbHarry], ps);
  loop.nextTurn().performMove({ x: 2, y: 2 });
  loop.nextTurn().performMove({ x: 1, y: 1 });
  loop.nextTurn().performMove({ x: 3, y: 2 });

  expect(spyNotify).toHaveBeenLastCalledWith(GAME_FINISHED_EVENT, {
    winner: playerJim.toJSON(),
  });
});

it("Get missed hits by player", () => {
  const ps = new PubSub();

  const playerJim = new Player('Jim', ps);
  const playerHarry = new Player('Harry', ps);

  const { type, length } = ShipType.DESTROYER;
  const gbJim = new Gameboard(5, ps);
  gbJim.placeShip({ x: 1, y: 1 }, () => new Ship(type, length));

  const gbHarry = new Gameboard(5, ps);
  gbHarry.placeShip({ x: 2, y: 2 }, () => new Ship(type, length));

  const loop = new Game([playerJim, playerHarry], [gbJim, gbHarry], ps);
  loop.nextTurn().performMove({ x: 4, y: 4 });

  expect(loop.getMissedHitsForPlayer(playerJim)).toEqual(gbHarry.getMissedHits());
})
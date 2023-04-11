import { GameLoop } from '../src/service/game';
import { Gameboard } from '../src/service/gameboard';
import { Player } from '../src/service/player';
import { createDestroyer } from '../src/service/ship';
import { PubSub } from '../src/utils/eventBus';

jest.mock('./../src/utils/eventBus.js');

it('Players make moves one after another', () => {
  const ps = new PubSub();

  const playerJim = new Player('Jim', ps);
  const playerHarry = new Player('Harry', ps);

  const gbJim = new Gameboard(5, ps);
  gbJim.placeShip({ x: 1, y: 1 }, createDestroyer);

  const gbHarry = new Gameboard(5, ps);
  gbHarry.placeShip({ x: 2, y: 2 }, createDestroyer);

  const game = new GameLoop([playerJim, playerHarry], [gbJim, gbHarry]);

  const turn1Player = game.requestNextMove();
  const turn2Player = game.requestNextMove();
  const turn3Player = game.requestNextMove();
  const turn4Player = game.requestNextMove();

  expect(turn1Player).toBeTruthy();
  expect(turn2Player).toBeTruthy();
  expect(turn3Player).toBeTruthy();
  expect(turn4Player).toBeTruthy();

  expect(turn1Player).toStrictEqual(turn3Player);
  expect(turn2Player).toStrictEqual(turn4Player);
});

it("Player loses after losing all ships", () => {
  const ps = new PubSub();

  const playerJim = new Player('Jim', ps);
  const playerHarry = new Player('Harry', ps);

  const gbJim = new Gameboard(5, ps);
  gbJim.placeShip({ x: 1, y: 1 }, createDestroyer);

  const gbHarry = new Gameboard(5, ps);
  gbHarry.placeShip({ x: 2, y: 2 }, createDestroyer);

  const game = new GameLoop([playerJim, playerHarry], [gbJim, gbHarry]);

  game.requestNextMove().performMove({ x: 2, y: 2 });
  game.requestNextMove().performMove({ x: 3, y: 3 });
  game.requestNextMove().performMove({ x: 3, y: 2 });

  expect(ps.notify).toBeCalledTimes(3);
  expect(ps.notify).toHaveBeenLastCalledWith('WinnerFoundEvent', { name: 'Jim' });
})
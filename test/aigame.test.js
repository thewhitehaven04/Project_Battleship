import { AiGameLoop } from '../src/service/aiGame';
import { GAME_FINISHED_EVENT, Game } from '../src/service/game';
import { ALL_SHIPS_DESTROYED_EVENT, Gameboard } from '../src/service/gameboard';
import { moveProvider } from '../src/service/moveProvider';
import { PLAYER_MOVE_EVENT, Player } from '../src/service/player';
import { createBattleship, createCarrier, createDestroyer } from '../src/service/ship';
import { PubSub } from '../src/utils/eventBus';

it('Player misses by AI ships', () => {
  const ps = new PubSub();

  const player = new Player('Nate', ps);
  const computer = new Player('Computer', ps);

  const boardPlayer = new Gameboard(4, ps);
  boardPlayer.placeShip({ x: 1, y: 1 }, createDestroyer);

  const boardComputer = new Gameboard(4, ps);
  boardComputer.placeShip({ x: 1, y: 1 }, createDestroyer);

  const game = new Game([computer, player], [boardComputer, boardPlayer], ps);
  const aiGame = new AiGameLoop(game, computer, moveProvider(), ps);
  aiGame.nextMove({ x: 3, y: 3 });

  expect(boardComputer.getMissedHits()).toContainEqual({ x: 3, y: 3 });
});

it('Player wins by destroying all AI ships', () => {
  const ps = new PubSub();
  const spyOn = jest.spyOn(ps, 'notify');

  const player = new Player('Nate', ps);
  const computer = new Player('Computer', ps);

  const boardPlayer = new Gameboard(4, ps);
  boardPlayer.placeShip({ x: 1, y: 1 }, createDestroyer);

  const boardComputer = new Gameboard(4, ps);
  boardComputer.placeShip({ x: 1, y: 1 }, createDestroyer);

  const game = new Game([computer, player], [boardComputer, boardPlayer], ps);
  const aiGame = new AiGameLoop(game, computer, moveProvider(), ps);
  aiGame.nextMove({ x: 1, y: 1 });
  aiGame.nextMove({ x: 2, y: 1 });

  expect(spyOn).toHaveBeenCalledWith(
    ALL_SHIPS_DESTROYED_EVENT,
    boardComputer.toJSON(),
  );
});

it('Player winning causes emitting of GameFinishedEvent', () => {
  const ps = new PubSub();
  const spyOn = jest.spyOn(ps, 'notify');

  const player = new Player('Nate', ps);
  const computer = new Player('Computer', ps);

  const boardPlayer = new Gameboard(4, ps);
  boardPlayer.placeShip({ x: 1, y: 1 }, createDestroyer);

  const boardComputer = new Gameboard(4, ps);
  boardComputer.placeShip({ x: 1, y: 1 }, createDestroyer);

  const game = new Game([computer, player], [boardComputer, boardPlayer], ps);
  const aiGame = new AiGameLoop(game, computer, moveProvider(), ps);
  aiGame.nextMove({ x: 1, y: 1 });
  aiGame.nextMove({ x: 2, y: 1 });

  expect(spyOn).toHaveBeenCalledWith(GAME_FINISHED_EVENT, {
    winner: player.toJSON(),
  });
});

it("AI eventually destroys all of player's ships", () => {
  const ps = new PubSub();
  const spyOn = jest.spyOn(ps, 'notify');

  const player = new Player('Nate', ps);
  const computer = new Player('Computer', ps);

  const boardPlayer = new Gameboard(6, ps);
  boardPlayer.placeShip({ x: 1, y: 1 }, createBattleship);

  const boardComputer = new Gameboard(6, ps);
  boardComputer.placeShip({ x: 1, y: 1 }, createBattleship);

  const moveProviderInstance = moveProvider();
  const game = new Game([computer, player], [boardComputer, boardPlayer], ps);
  const aiGame = new AiGameLoop(game, computer, moveProviderInstance, ps);

  for (let i = 0; i < 36; i++) {
    aiGame.nextMove({ x: 4, y: 4 });
  }

  expect(spyOn).toHaveBeenCalledWith(PLAYER_MOVE_EVENT, {
    name: computer.name,
    coordinates: { x: 1, y: 1 },
  });
  expect(spyOn).toHaveBeenCalledWith(PLAYER_MOVE_EVENT, {
    name: computer.name,
    coordinates: { x: 2, y: 1 },
  });
  expect(spyOn).toHaveBeenCalledWith(PLAYER_MOVE_EVENT, {
    name: computer.name,
    coordinates: { x: 3, y: 1 },
  });
  expect(spyOn).toHaveBeenCalledWith(PLAYER_MOVE_EVENT, {
    name: computer.name,
    coordinates: { x: 4, y: 1 },
  });
  
  expect(spyOn).toHaveBeenCalledWith(
    ALL_SHIPS_DESTROYED_EVENT,
    boardPlayer.toJSON(),
  );
});

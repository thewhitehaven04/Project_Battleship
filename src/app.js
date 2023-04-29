import { PlaceBoardController } from './controller/boardController';
import { AiGameLoop } from './service/aiGame';
import { Game } from './service/game';
import { getFlow } from './service/gameStartFlow';
import { Gameboard } from './service/gameboard';
import { moveProvider } from './service/moveProvider';
import { Player } from './service/player';
import { ShipType } from './service/ship';
import { PubSub } from './utils/eventBus';
import { PlaceShipsBoardView } from './view/placeShipsBoard';

const app = function () {
  const appRoot = document.querySelector('body');
  const eventBus = new PubSub();
  let gameBoard;
  let boardController;

  const newGame = () => {
    const playerGameboard = new Gameboard(7, eventBus);
    const gf = getFlow(ShipType);

    const initScreen = new PlaceShipsBoardView({
      ship: gf.next().value,
      boardState: gameBoard.toJSON().board,
    });
    boardController = new PlaceBoardController(gameBoard, initScreen, gf);

    appRoot?.append(initScreen.render());

    const mockPlayer = new Player('Mikhail', eventBus);
    const aiPlayer = new Player('Computer', eventBus);
    const aiGameBoard = new Gameboard(7, eventBus);

    const game = new Game(
      [mockPlayer, aiPlayer],
      [playerGameboard, aiGameBoard],
      eventBus,
    );
    const mover = moveProvider();
    const aiGame = new AiGameLoop(game, aiPlayer, mover, eventBus);
  };

  return {
    newGame,
  };
};

app().startNewGame();

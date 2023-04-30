import { PlaceBoardController } from './controller/boardController';
import { AiGameLoop } from './service/aiGame';
import { Game } from './service/game';
import { getFlow } from './service/gameStartFlow';
import { Gameboard } from './service/gameboard';
import { moveProvider } from './service/moveProvider';
import { Player } from './service/player';
import { ShipType } from './service/ship';
import { PubSub } from './utils/eventBus';
import { PlaceShipsBoardView } from './view/placeShips/placeShipsBoard';
import style from './style.css';

const app = function () {
  const appRoot = document.querySelector('body');
  const eventBus = new PubSub();
  let playerGameBoard;
  let playerBoardController;

  const newGame = () => {
    playerGameBoard = new Gameboard(7, eventBus);
    const gf = getFlow(ShipType);

    const startNewGameScreen = new PlaceShipsBoardView({
      ship: gf.next().value,
      boardState: playerGameBoard.toJSON().board,
    });
    playerBoardController = new PlaceBoardController(
      playerGameBoard,
      startNewGameScreen,
      gf,
    );

    appRoot?.append(startNewGameScreen.render());

    const mockPlayer = new Player('Mikhail', eventBus);
    // const aiPlayer = new Player('Computer', eventBus);
    // const aiGameBoard = new Gameboard(7, eventBus);
    // const game = new Game(
    //   [mockPlayer, aiPlayer],
    //   [playerGameboard, aiGameBoard],
    //   eventBus,
    // );
    // const mover = moveProvider();
    // const aiGame = new AiGameLoop(game, aiPlayer, mover, eventBus);
  };

  return {
    newGame,
  };
};

app().newGame();

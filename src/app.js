import {
  ALL_SHIPS_PLACED_EVENT,
  PlaceBoardController,
} from './controller/boardController';
import { AiGameLoop } from './service/aiGame';
import { Game } from './service/game';
import { getFlow } from './service/gameStartFlow';
import { Gameboard } from './service/gameboard';
import { moveProvider } from './service/moveProvider';
import { Player } from './service/player';
import { ShipType } from './service/ship';
import { PubSub } from './utils/eventBus';
import {
  PlaceBoard,
  PlaceShipsBoardView,
} from './view/placeShips/placeShipsBoard';
import style from './style.css';
import { Board } from './components/board/board';

const game = function () {
  const appRoot = document.querySelector('body');
  const eventBus = new PubSub();
  eventBus.subscribe(ALL_SHIPS_PLACED_EVENT, startAIGame);

  let playerGameBoard;

  function start() {
    playerGameBoard = new Gameboard(8, eventBus);
    const gf = getFlow(ShipType);
    const initState = {
      ship: gf.next().value,
      boardState: playerGameBoard.toJSON().board,
    };
    const startNewGameScreen = new PlaceShipsBoardView(
      initState,
      new PlaceBoard({ cells: initState.boardState }),
    );
    new PlaceBoardController(playerGameBoard, startNewGameScreen, gf, eventBus);

    appRoot?.append(startNewGameScreen.render());
  }

  function startAIGame() {
    appRoot?.replaceChildren();

    const mockPlayer = new Player('Mikhail', eventBus);
    const aiPlayer = new Player('Computer', eventBus);
    const aiGameBoard = new Gameboard(7, eventBus);
    const game = new Game(
      [mockPlayer, aiPlayer],
      [playerGameBoard, aiGameBoard],
      eventBus,
    );
    const mover = moveProvider();
    const aiGameLoopModel = new AiGameLoop(game, aiPlayer, mover, eventBus);
    const aiGameView = new AIGameView();
    const controller = new AIGameController();
  }

  return {
    start,
  };
};

game().start();

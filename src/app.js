import {
  ALL_SHIPS_PLACED_EVENT,
  PlaceBoardController,
} from './controller/boardController';
import { AiGameLoop } from './service/aiGame';
import { AIGameView } from './view/aiGame/aiGameView';
import { GAME_FINISHED_EVENT, Game } from './service/game';
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
import { EnemyBoard } from './components/enemyBoard/enemyBoard';
import { AIGameController } from './controller/aiGameController';
import { config } from './appConfig';
import { AiGameboardFactory } from './utils/aiGameboardFactory.js';
import { BattleshipHeader } from './components/battleshipHeader/battleshipHeader';
import image from './assets/icons/battleship_icon_header.png';
import { RestartGameModal } from './components/startNewGameModal/startNewGameModal';

const app = function () {
  const appRoot = document.querySelector('body');
  const main = document.createElement('main');
  
  const modal = new RestartGameModal();
  modal.handleRestartRequest = modal.handleRestartRequest.bind(null, restartGame);

  /** render layout */
  appRoot?.append(new BattleshipHeader({ iconPath: image }).render(), main);

  /** @type {PubSub} */
  let eventBus;
  
  /** @type {Gameboard} */
  let playerGameBoard;

  function newGameInstance() {
    main.replaceChildren();
    eventBus = new PubSub();
    eventBus.subscribe(ALL_SHIPS_PLACED_EVENT, startAIGame);

    playerGameBoard = new Gameboard(config.boardSize, eventBus);
    const gf = getFlow(ShipType);
    const initState = {
      ship: gf.next().value,
      boardState: playerGameBoard.toJSON().board,
    };
    const startNewGameScreen = new PlaceShipsBoardView(
      initState,
      new PlaceBoard({ board: initState.boardState }),
    );
    new PlaceBoardController(playerGameBoard, startNewGameScreen, gf, eventBus);
    main.append(startNewGameScreen.render());
  }

  function startAIGame() {
    main.replaceChildren();
    eventBus.subscribe(GAME_FINISHED_EVENT, async () => {
      setTimeout(endGameHandler, 5000);
    });

    const mockPlayer = new Player('Mikhail', eventBus);
    const aiPlayer = new Player('Computer', eventBus);
    const aiGameBoard = AiGameboardFactory(
      new Gameboard(config.boardSize, eventBus),
      Object.values(ShipType),
    );
    const aiGameLoopModel = new AiGameLoop(
      new Game(
        [mockPlayer, aiPlayer],
        [playerGameBoard, aiGameBoard],
        eventBus,
      ),
      aiPlayer,
      moveProvider(),
      eventBus,
    );
    const playerBoardState = playerGameBoard.toJSON();
    const enemyBoardState = aiGameBoard.toJSON();
    const aiGameView = new AIGameView(
      new Board(playerBoardState),
      new EnemyBoard(enemyBoardState),
      {
        player: {
          player: mockPlayer.toJSON(),
          boardState: playerBoardState,
        },
        computer: {
          player: aiPlayer.toJSON(),
          boardState: enemyBoardState,
        },
        winner: null,
      },
    );
    main.appendChild(aiGameView.render());
    new AIGameController(aiGameLoopModel, aiGameView, eventBus);
  }

  function endGameHandler() {
    appRoot?.appendChild(modal.render());
  }

  function restartGame() {
    appRoot?.removeChild(modal.render());
    runGame();
  }

  function runGame() {
    newGameInstance();
  }

  return {
    runGame,
  };
};

app().runGame();

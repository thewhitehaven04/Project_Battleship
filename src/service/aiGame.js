import { PubSub } from '../utils/eventBus';
import { GAME_FINISHED_EVENT, Game } from './game';
import { Player } from './player';

class AiGameLoop {
  #gameFinished;

  /**
   * @param {Game} game
   * @param {Player} aiPlayer
   * @param {import("./moveProvider").MoveProvider} moveProvider
   * @param {PubSub} pubSub
   */
  constructor(game, aiPlayer, moveProvider, pubSub) {
    this.game = game;
    this.aiPlayer = aiPlayer;
    this.moveProvider = moveProvider;
    this.pubSub = pubSub;
    this.#gameFinished = false;

    this.#startGame();
    this.pubSub.subscribe(GAME_FINISHED_EVENT, () => {
      this.#gameFinished = true;
    });
  }

  #startGame() {
    if (this.game.nextTurn() === this.aiPlayer) {
      this.aiPlayer.performMove(
        this.moveProvider.getCell(
          this.game.boardSize,
          this.game.getMissedHitsForPlayer(this.aiPlayer) ?? [],
        ),
      );
    }
  }

  /**
   * @param {import("./gameboard").BoardCoordinates} boardCell
   */
  nextMove(boardCell) {
    if (!this.#gameFinished) this.game.nextTurn().performMove(boardCell);

    // ai making a move
    if (!this.#gameFinished) {
      this.game
        .nextTurn()
        .performMove(
          this.moveProvider.getCell(
            this.game.boardSize,
            this.game.getMissedHitsForPlayer(this.aiPlayer) ?? [],
          ),
        );
    }
  }
}

export { AiGameLoop };

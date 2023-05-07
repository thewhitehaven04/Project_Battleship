import { PubSub } from '../utils/eventBus';
import { GAME_FINISHED_EVENT, Game } from './game';
import { Player } from './player';

class AiGameLoop {
  #winner;

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
    this.#winner = null;

    this.pubSub.subscribe(GAME_FINISHED_EVENT, this.#endGame);
    this.#startGame();
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

  /** @param {import('./game').GameFinishedEvent} gameFinishedEvent */
  #endGame = (gameFinishedEvent) => {
    this.#winner = gameFinishedEvent.winner;
  }

  /**
   * @param {import("./gameboard").BoardCoordinates} boardCell
   */
  nextMove(boardCell) {
    if (!this.#winner) this.game.nextTurn().performMove(boardCell);

    // ai making a move
    if (!this.#winner) {
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

  /**
   * @returns {import('../view/aiGame/aiGameView').AIGameState}
   */
  toJSON = () => {
    const gs = this.game.toJSON();
    const computer = gs.find(
      (playerDto) => playerDto.player.name === this.aiPlayer.toJSON().name,
    );
    const player = gs.find(
      (playerDto) => playerDto.player.name !== this.aiPlayer.toJSON().name,
    );
    return {
      computer: computer ?? null,
      player: player ?? null,
      winner: this.#winner,
    };
  };
}

export { AiGameLoop };

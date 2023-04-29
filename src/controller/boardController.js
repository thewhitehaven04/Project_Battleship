import { Gameboard } from '../service/gameboard';
import { Ship } from '../service/ship';
import { PubSub } from '../utils/eventBus';

class BoardController {
  #pubSub;

  /**
   * @param {Gameboard} model
   * @param {PubSub} pubSub
   */
  constructor(model, pubSub) {
    this.model = model;
    this.#pubSub = pubSub;
  }

  /** @param {import("../view/placeShipsBoard").ShipPlacementCommand} placementCommand */
  handlePlacement(placementCommand) {
    const { type, length } = placementCommand.ship;
    this.model.placeShip(
      placementCommand.coordinates,
      () => new Ship(length, type),
    );
  }
}

export { BoardController };

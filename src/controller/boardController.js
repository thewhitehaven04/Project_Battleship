import { Gameboard } from '../service/gameboard';
import { Ship, ShipType } from '../service/ship';
import { PubSub } from '../utils/eventBus';
import { PlaceShipsBoardView } from '../view/placeShips/placeShipsBoard';

const ALL_SHIPS_PLACED_EVENT = 'allShipsPlacedEvent';

/**  @typedef {import('../service/gameboard').GameboardDto} AllShipsPlacedEvent */

class PlaceBoardController {
  /**
   * @param {Gameboard} model
   * @param {PlaceShipsBoardView} view
   * @param {Generator<Object<String, ShipType>>} requestGenerator;
   * @param {PubSub} pubSub;
   */
  constructor(model, view, requestGenerator, pubSub) {
    this.model = model;
    this.view = view;
    this.shipRequestGenerator = requestGenerator;
    this.pubSub = pubSub;
    this.view.handlePlacement = this.view.handlePlacement.bind(
      this,
      this.handlePlacement,
    );
  }

  /**
   * @param {import("../view/placeShips/placeShipsBoard").ShipPlacementCommand} placementCommand
   */
  handlePlacement = (placementCommand) => {
    const { type, length } = placementCommand.ship;
    try {
      this.model.placeShip(
        placementCommand.coordinates,
        () => new Ship(type, length),
        placementCommand.vertical,
      );
      const next = this.shipRequestGenerator.next();
      if (!next.done) {
        this.view.update({
          ship: next.value,
          boardState: this.model.toJSON().board,
        });
      } else {
        this.pubSub.notify(ALL_SHIPS_PLACED_EVENT, this.model.toJSON());
      }
    } catch (err) {
      console.error(`Error: ${err}`);
    }
  };
}

export { PlaceBoardController };

import { getFlow } from '../service/gameStartFlow';
import { Gameboard } from '../service/gameboard';
import { Ship, ShipType } from '../service/ship';
import { PlaceShipsBoardView } from '../view/placeShipsBoard';

class PlaceBoardController {

  /**
   * @param {Gameboard} model
   * @param {PlaceShipsBoardView} view
   * @param {Generator<Object<String, ShipType>>} requestGenerator;
   */
  constructor(model, view, requestGenerator) {
    this.model = model;
    this.view = view;
    this.shipRequestGenerator = requestGenerator;
    this.view.handlePlacement = this.view.handlePlacement.bind(this, this.handlePlacement);
  }

  /**
   * @param {import("../view/placeShipsBoard").ShipPlacementCommand} placementCommand
   */
  handlePlacement(placementCommand) {
    const { type, length } = placementCommand.ship;
    this.model.placeShip(
      placementCommand.coordinates,
      () => new Ship(type, length),
    );
    this.view.update({
      ship: this.shipRequestGenerator.next().value,
      boardState: this.model.toJSON().board,
    });
  }
}

export { PlaceBoardController };
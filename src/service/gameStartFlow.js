import { PubSub } from "../utils/eventBus";
import { ShipType } from "./ship";

/**
 * Defines the order of requesting the player to place the ships on the gameboard.
 * @param {Object<String, ShipType>} shipTypes
 */
const getFlow = function*(shipTypes) {
  for (let type in shipTypes) {
    yield shipTypes[type]
  };
  return null;
}

export { getFlow };
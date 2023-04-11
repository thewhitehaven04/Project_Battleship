import { PubSub } from "../utils/eventBus"
import { Player } from "./player";

class Game {
  
  /** @param {[Player, Player]} players */
  constructor(players){
    this.eventBus = new PubSub();
  }
  
}

export { Game };
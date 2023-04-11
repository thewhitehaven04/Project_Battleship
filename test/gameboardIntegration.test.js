import { PubSub } from "../src/utils/eventBus";
import { Gameboard } from "../src/service/gameboard";
import { createDestroyer, createCruiser } from "../src/service/ship";


jest.mock("./../src/utils/eventBus");

it('All ships destroyed event', () => {
  const ps = new PubSub();
  const gb = new Gameboard(5, ps);

  gb.placeShip({ x: 1, y: 1 }, createCruiser);
  gb.placeShip({ x: 1, y: 2 }, createDestroyer);

  gb.receiveAttack({ x: 1, y: 1 });
  gb.receiveAttack({ x: 2, y: 1 });
  gb.receiveAttack({ x: 3, y: 1 });
  
  gb.receiveAttack({ x: 1, y: 2 });
  gb.receiveAttack({ x: 2, y: 2 });
  expect(ps.notify).toHaveBeenCalledTimes(1);
})
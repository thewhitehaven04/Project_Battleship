import { PubSub } from "../src/utils/eventBus";
import { ALL_SHIPS_DESTROYED_EVENT, Gameboard } from "../src/service/gameboard";
import { createDestroyer, createCruiser } from "../src/service/ship";


it('AllShipsDestroyedEvent is sent upon destruction of all ships', () => {
  const ps = new PubSub();
  const notifySpyOn = jest.spyOn(ps, 'notify');
  const gb = new Gameboard(5, ps);

  gb.placeShip({ x: 1, y: 1 }, createCruiser);
  gb.placeShip({ x: 1, y: 2 }, createDestroyer);

  gb.receiveAttack({ x: 1, y: 1 });
  gb.receiveAttack({ x: 2, y: 1 });
  gb.receiveAttack({ x: 3, y: 1 });
  
  gb.receiveAttack({ x: 1, y: 2 });
  gb.receiveAttack({ x: 2, y: 2 });

  expect(notifySpyOn).lastCalledWith(ALL_SHIPS_DESTROYED_EVENT, gb.toJSON())
})
const { PubSub } = require("../src/eventBus");
const { Gameboard } = require("../src/model/gameboard");
const { createDestroyer, createCruiser } = require("../src/model/ship");


jest.mock("./../src/eventBus.js");

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
import { getFlow } from "../src/service/gameStartFlow";
import { ShipType } from "../src/service/ship"

it('flow returns a valid instance of ShipDto', () => {
  const gf = getFlow(ShipType);
  const next = gf.next();
  expect(next.value).toHaveProperty('type');
  expect(next.value).toHaveProperty('length');
})

it('flow returns all the types of ships', () => {
  const gf = getFlow(ShipType);
  for (let ship in ShipType) {
    const next = gf.next();
    expect(next.value.type).toEqual(ShipType[ship].type);
    expect(next.value.length).toEqual(ShipType[ship].length);
  } 
})

it('flow expires after all the ships', () => {
  const gf = getFlow(ShipType);
  for (let ship in ShipType) {
    gf.next();
  } 
  expect(gf.next().done).toEqual(true);
})
const { Ship } = require('./../src/ship');

it("Ship object initialization", () => {
  const hasbroDestroyer = new Ship(3);
  expect(hasbroDestroyer.length).toBe(3);
  expect(hasbroDestroyer.hits).toBe(0);
  expect(hasbroDestroyer.hasSunk).toBe(false);
})
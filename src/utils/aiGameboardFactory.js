import { Gameboard } from '../service/gameboard';
import { Ship, ShipType } from '../service/ship';
import { choice, randInt } from './math';

/**
 * @param {Array} a
 * @param {Array} b
 */
const dot = (a, b) => {
  const res = Array(a.length).fill(Array(b.length));
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      res[i][j] = [a[i], b[j]];
    }
  }
  return res;
};

/**
 * Factory function that produces gameboards with pre-placed ships
 * @param {Gameboard} gameboard
 * @param {ShipType[]} shipTypes
 */
const AiGameboardFactory = function (gameboard, shipTypes) {
  const lines = [...Array(gameboard.size).keys()];
  const index = lines.findIndex((line) => line === choice(lines));

  for (let { type, length } of shipTypes) {
    gameboard.placeShip(
      {
        x: randInt(0, gameboard.size - length),
        y: lines.splice(index, 1).pop() ?? 0,
      },
      () => new Ship(type, length),
    );
  }
  return gameboard;
};

export { AiGameboardFactory };
import { Gameboard } from '../service/gameboard';
import { Ship, ShipType } from '../service/ship';
import { randInt } from './math';

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
  const coordSpace = dot(
    [...Array(gameboard.size).keys()],
    [...Array(gameboard.size).keys()],
  ).map((value) => {
    return {
      x: value[0],
      y: value[1],
    };
  });

  // let X = [...Array(gameboard.size).keys()];
  // let Y = [...Array(gameboard.size).keys()];
  let y = 0;
  for (let { type, length } of shipTypes) {
    gameboard.placeShip({ x: 0, y: y }, () => new Ship(type, length));
    y++;
  }
  return gameboard;
};

export { AiGameboardFactory };

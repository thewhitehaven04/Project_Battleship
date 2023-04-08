const { createBattleship, createCarrier, createCruiser, createDestroyer, createSubmarine } = require('../src/model/ship');
const { Gameboard } = require('./../src/model/gameboard');

it('Initializing gameboard', () => {
  const gameboard = new Gameboard(10);

  expect(gameboard.board.length).toEqual(10);
  expect(gameboard.board[0].length).toEqual(10);
})

it('Create a ship in the middle of the board', () => {
  const gb = new Gameboard(10);
  expect(gb.placeShip({ x: 3, y: 3 }, createBattleship)).toEqual(createBattleship());
})

it('Create a horizontal ship outside the bounds of the board', () => {
  const gb = new Gameboard(10);
  expect(() => gb.placeShip({ x: 9, y: 7 }, createCarrier)).toThrowError(RangeError);
 })

it('Create a vertical ship outside the bounds of the board', () => {
  const gb = new Gameboard(10);
  expect(() => gb.placeShip({ x: 8, y: 8 }, createCruiser, true)).toThrowError(RangeError);
 })

it('Create a ship adjacent to a bound of the board', () => {
  const gb = new Gameboard(10);
  expect(gb.placeShip({ x: 8, y: 8 }, createDestroyer, true)).toEqual(createDestroyer());
 })

it('Create a ship adjacent to a bound of the board', () => {
  const gb = new Gameboard(10);
  expect(() => gb.placeShip({ x: -2, y: -2 }, createDestroyer, true)).toThrowError(RangeError);
 })

it('Ship gets hit', () => {
  const gb = new Gameboard(5);
  const sub = gb.placeShip({ x: 2, y: 1 }, createSubmarine);
  gb.receiveAttack({ x: 3, y: 1 });
  expect(gb.board[3][1].isHit).toBe(true);
  expect(sub.hits).toEqual(1);
 })

it('Player misses a shot', () => {
  const gb = new Gameboard(5);
  const sub = gb.placeShip({ x: 2, y: 1 }, createSubmarine);  
  gb.receiveAttack({ x: 4, y: 4});
  expect(sub.hits).toEqual(0);
  expect(gb.board[4][4].isHit).toBe(true);
 })

it('Conflicting ship positioning triggers error', () => {
  const gb = new Gameboard(8);
  const sub = gb.placeShip({ x: 2, y: 1 }, createSubmarine);
  expect(() => gb.placeShip({ x: 2, y: 1 }, createCarrier, true)).toThrow(RangeError);
 })
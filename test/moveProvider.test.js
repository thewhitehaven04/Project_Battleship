import { moveProvider } from '../src/service/moveProvider';

it('Move provider generates a valid cell', () => {
  const upperBound = 4;
  const missedHits = [];
  const cell = moveProvider().getCell(upperBound, missedHits);
  expect(cell).toHaveProperty('x');
  expect(cell).toHaveProperty('y')
});

it('Move provider does not generate cells outside of board bounds', () => {
  const upperBound = 4;
  const missedHits = [];
  const cell = moveProvider().getCell(upperBound, missedHits);
  expect(cell.x).toBeLessThan(upperBound);
  expect(cell.y).toBeLessThan(upperBound);
});

it('Move provider does not generate cells that resulted in a miss', () => {
  const upperBound = 4;
  const missedHits = [];
  const move = moveProvider();

  for (let i = 0; i < upperBound * upperBound; i++) {
    const cell = move.getCell(upperBound, missedHits);
    expect(missedHits.includes(cell)).toBeFalsy();
    missedHits.push(cell);
  }
});

it('Move provider does not generate the same cell all the time', () => {
  const upperBound = 4;
  const missedHits = [];
  const move = moveProvider();
  const firstCell = move.getCell(upperBound, missedHits);

  missedHits.push(firstCell);

  const secondCell = move.getCell(upperBound, missedHits);
  expect(
    firstCell.x === secondCell.x && firstCell.y === secondCell.y,
  ).toBeFalsy();
});

it("Move provider does not generate cells that resulted in a hit on an enemy ship", () => {
  const upperBound = 4;
  const missedHits = [];
  const previouslyGenerated = [];
  const move = moveProvider();
  for (let i = 0; i < upperBound * upperBound; i++) {
    const cell = move.getCell(upperBound, missedHits);
    expect(previouslyGenerated.includes(cell)).toBeFalsy();
    previouslyGenerated.push(cell);
  }
})

it("Move provider generates the entire range of board cells", () => {
  const upperBound = 3;
  const missedHits = [];
  const move = moveProvider();

  for (let i = 0; i < upperBound * upperBound; i++){
    const cell = move.getCell(3, missedHits);    
    missedHits.push(cell); 
  }
  expect(missedHits).toContainEqual({ x: 0, y: 0 });
  expect(missedHits).toContainEqual({ x: 1, y: 0 });
  expect(missedHits).toContainEqual({ x: 2, y: 0 });
  expect(missedHits).toContainEqual({ x: 0, y: 1 });
  expect(missedHits).toContainEqual({ x: 1, y: 1 });
  expect(missedHits).toContainEqual({ x: 2, y: 1 });
  expect(missedHits).toContainEqual({ x: 0, y: 2 });
  expect(missedHits).toContainEqual({ x: 1, y: 2 });
  expect(missedHits).toContainEqual({ x: 2, y: 2 });
})
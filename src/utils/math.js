/**
 * @param {Number} a
 * @param {Number} b
 */
const randInt = (a, b) => {
  a = Math.ceil(a);
  b = Math.floor(b);
  return Math.floor(Math.random() * (a - b) + b);
};

/**
 * Returns a random element from the array.
 * @param {Array} arr
 */
const choice = (arr) => {
  return arr[randInt(0, arr.length)]
}

export { randInt, choice };
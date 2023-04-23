/**
 * @typedef {Object} View
 * @property {function(): Node} render
 */

/**
 * @template T
 * @typedef {Object} Updatable<T>
 * @property {function(T): void} update
 */

/** 
 * @template T
 * @typedef {View & Updatable<T>} UpdatableView 
 */
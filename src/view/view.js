/**
 * @module
 */

/**
 * @interface
 * @typedef View
 * @property {function(): Node} render
 */

/**
 * @template T
 * @interface
 * @typedef {Object} Updatable<T>
 * @property {function(T): void} update
 */

/** 
 * @template T
 * @interface
 * @typedef {View & Updatable<T>} UpdatableView<T> 
 */

/** 
 * @exports View
 * @exports Updatable<T> 
 * @exports UpdatableView<T> 
 */
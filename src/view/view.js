/**
 * @interface
 * @typedef View
 * @property {function(): HTMLElement} render
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
 * @module
 * @exports View
 * @exports Updatable<T> 
 * @exports UpdatableView<T> 
 */
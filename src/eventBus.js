export class PubSub {
  constructor() {
    /**
     * @type {Map<String, Array<function>>}
     */
    this.events = new Map();
  }

  /**
   * Subscribe a callback to the event.
   * @param {string} event
   * @param {Function} cb
   */
  subscribe(event, cb) {
    if (this.events.get(event)) {
      this.events.get(event)?.push(cb);
      return;
    }

    this.events.set(event, [cb]);
  }

  /**
   * @param {string} event
   * @param {any} data
   */
  notify(event, data) {
    this.events.get(event)?.forEach((cb) => cb(data));
  }
}
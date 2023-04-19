export class PubSub {
  constructor() {
    /**
     * @type {Map<String, Array<Function>>}
     */
    this.events = new Map();
  }

  /**
   * Subscribe a callback to the event.
   * @param {string} event
   * @param {Function} cb
   */
  subscribe(event, cb) {
    const events = this.events.get(event);
    if (events && events.length >= 1) {
      events.push(cb);
      return
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

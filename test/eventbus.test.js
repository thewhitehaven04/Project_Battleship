import { PubSub } from '../src/utils/eventBus';

it('Adding a subscriber', () => {
  const ps = new PubSub();
  ps.subscribe('event', () => {
    return 'received an event';
  });
  ps.subscribe('event', () => { });
  expect(ps.events.get('event')).toHaveLength(2);
});

it('Notifying a subscriber', () => {
  const ps = new PubSub();
  const fn = jest.fn(() => { return 'received an event' });
  const fn2 = jest.fn(() => { return 'fn2' });
  ps.subscribe('event', fn);
  ps.subscribe('event', fn2);
  const obj = { name: 1 };
  ps.notify('event', obj);
  expect(fn).toHaveBeenCalledTimes(1);
  expect(fn2).toHaveBeenCalledTimes(1);
});

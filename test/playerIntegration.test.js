import {
  PLAYER_MOVE_EVENT,
  Player,
} from '../src/service/player';
import { PubSub } from '../src/utils/eventBus';

jest.mock('../src/utils/eventBus');

it('Player move event emitted', () => {
  const ps = new PubSub();
  const cellArg = { x: 2, y: 2 };
  new Player('Gary', ps).performMove(cellArg);
  expect(ps.notify).toHaveBeenCalledTimes(1);
  expect(ps.notify).toHaveBeenCalledWith(PLAYER_MOVE_EVENT, {
    name: 'Gary',
    coordinates: cellArg,
  });
});
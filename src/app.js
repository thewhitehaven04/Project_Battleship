import { PubSub } from './utils/eventBus';

const app = {
  appRoot: document.querySelector('body'),
  eventBus: new PubSub(),
};

app.run();

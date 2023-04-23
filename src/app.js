import { MainViewFactory } from './view/main';

const app = {
  run: () => {
    const body = document.querySelector('body');
    body?.appendChild(MainViewFactory().render());
  },
};

app.run();

import Aurelia, { RouterConfiguration } from 'aurelia';
import { MainView } from './main-view';
import { TodoFilterValueConverter } from './todo-filter';

Aurelia
  .register(TodoFilterValueConverter, RouterConfiguration.customize({ useUrlFragmentHash: false }))
  .app(MainView)
  .start();
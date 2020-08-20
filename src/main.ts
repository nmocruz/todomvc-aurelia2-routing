import Aurelia from 'aurelia';
import { TodoApp } from './todo-app';
import { TodoFilterValueConverter } from './todo-filter'
Aurelia
  .register(TodoFilterValueConverter)
  .app(TodoApp)
  .start();
import { TestContext, TestConfiguration } from '@aurelia/testing';
import Aurelia from 'aurelia';
import { MainView } from '../src/main-view';

describe('todo-app', () => {
  it('should render message', async () => {
    const ctx = TestContext.createHTMLTestContext();
    const { container } = ctx;
    const node = ctx.createElement('my-app');

    const au = new Aurelia(container)
      .register(TestConfiguration)
      .app({ host: node, component: MainView });

    // const component = au.root.controller.bindingContext;
    await au.start().wait();

    const text =  node.textContent;
    expect(text.trim()).toBe('Hello World!');
    await au.stop().wait();
  });
});

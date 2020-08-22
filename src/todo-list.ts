import { TodoItem } from './todo-item'
import { bindable } from 'aurelia'
import { AuthService } from './auth/auth-service';
const ENTER_KEY = 13;
const STORAGE_NAME = 'todomvc-aurelia2';

export class TodoList {

  
  @bindable
  todoItems: TodoItem[] =[];
  newTodoTitle: string = null;
  filter: string;
  
  @bindable userName = null;
  constructor(private auth: AuthService) {

    
    this.load();
  }
  
  enter(params){
    this.filter = params[0];
    this.userName = this.auth.user?.name;
  }

  onKeyUp(ev) {
    if (ev.keyCode === ENTER_KEY)
      this.addNewTodo(this.newTodoTitle);
  }
  
  addNewTodo(title = this.newTodoTitle) {
    if (title == undefined) { return; }

		title = title.trim();
    if (title.length === 0) { return; }
    
    const newTodoItem = new TodoItem(title);
    newTodoItem.itemChanged = this.save.bind(this);
    this.todoItems = [...this.todoItems, newTodoItem];
    this.newTodoTitle = null;  
  }

  deleteTodo(item: TodoItem){
    const idx = this.todoItems.indexOf(item);
    this.todoItems = [...this.todoItems.slice(0, idx), ...this.todoItems.slice(idx + 1)];
  }

  clearCompletedTodos(){
    this.todoItems = this.todoItems.filter(todo => !todo.isCompleted );
  }

  todoItemsChanged(oldValue, newValue){
    this.save();
  }

  get countTodosLeft() {
		return this.todoItems.filter(i => !i.isCompleted).length;
  }
  
  save(){
  
    const items = this.todoItems.map(c=> {
      return {
        title: c.title,
			  completed: c.isCompleted
      }
    })
    localStorage.setItem(STORAGE_NAME, JSON.stringify(items));
  }

  load(){
    const storageContent = localStorage.getItem(STORAGE_NAME);
		if (storageContent == undefined) { return; }

		const simpleItems = JSON.parse(storageContent);
    this.todoItems = simpleItems.map(c=> {
      const todo = new TodoItem(c.title, c.isCompleted);
      todo.itemChanged = this.save.bind(this);
      return todo;
    })
  }
}
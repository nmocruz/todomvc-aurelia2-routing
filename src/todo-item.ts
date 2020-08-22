import { bindable } from "aurelia";

const ENTER_KEY = 13;
const ESC_KEY = 27;

export class TodoItem{

  isEditing: boolean = false;
  editTitle: string = null;
  @bindable title = '';
  @bindable isCompleted = false;
 
  itemChanged: ()=> void

  constructor(title: string, isCompleted = false){
    this.title = title.trim();
    this.isCompleted = isCompleted;
  }
    
  beginEdit() {
		this.editTitle = this.title;
    this.isEditing = true;
  }
  
  commitEdit() {
    
		this.title = this.editTitle.trim();
		this.isEditing = false;
  }

  cancelEdit(){
    this.editTitle = this.title;
    this.isEditing = false;
  }
  
 
  titleChanged(oldValue, newValue){
    if(this.itemChanged)
      this.itemChanged();
  }

  isCompletedChanged(oldValue, newValue){
    
    if(this.itemChanged)
      this.itemChanged();
  }

  onKeyUp(ev: KeyboardEvent) {
		if (ev.keyCode === ENTER_KEY) {
			return this.commitEdit();
		}
		if (ev.keyCode === ESC_KEY) {
		  this.cancelEdit();
		}
	}
}
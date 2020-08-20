import { TodoItem } from './todo-item'
export class TodoFilterValueConverter {
    toView(items: TodoItem[], filter: 'active' | 'completed' | 'all') {

        if (!Array.isArray(items)) return [];
		if (filter === 'all' || !filter) return items;
    
        const isCompleted = filter !== 'active';
        return items.filter(c=>c.isCompleted == isCompleted);
    }
}
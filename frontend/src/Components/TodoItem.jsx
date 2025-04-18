import React from 'react';
import { Pen, CircleX, Circle, CircleCheck } from 'lucide-react';

function TodoItem({ task, onDelete, onToggle, onEdit }) {
    return (
        <div
            className="todo-item"
        >
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div  style={{ display: 'inline', justifyContent: 'flex-start' }}>
                    <div className={`task-text ${task.is_completed ? 'line-through' : ''}`}>
                    {task.text}
                    </div>
                          <div className="text-sm">{task.date}</div>
                </div>
                <span className="cursor-pointer ml-4" onClick={() => onEdit(task)}>
                    <Pen />
                </span>
            </div>

            <div className="flex space-x-2">
                <button
                    onClick={() => onDelete(task.id)}
                    className="toggle-btn"
                >
                    <CircleX />
                </button>
                <button
                    onClick={() => onToggle(task.id)}
                    className="toggle-btn"
                >
                    {task.is_completed ? <CircleCheck /> : <Circle />}
                </button>
            </div>
        </div>
    );
}
export default TodoItem;
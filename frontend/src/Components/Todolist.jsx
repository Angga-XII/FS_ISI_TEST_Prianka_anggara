import React, { useEffect, useState } from 'react';
import TodoItem from "./TodoItem.jsx";

function TodoList() {
    const urlApi = "http://127.0.0.1:5000"
    const [text, setText] = useState('');
    const [buttonType, setButtonType] = useState("add");
    const [edittedId, setEdittedId] = useState('')
    // const [tasks, setTasks] = useState([
    //     {
    //         id: 1,
    //         text: 'Doctor Appointment',
    //         date: new Date().toLocaleString({ hour12: false }),
    //         is_completed: true
    //     },
    //     {
    //         id: 2,
    //         text: 'Meeting at School',
    //         date: new Date().toLocaleString({ hour12: false }),
    //         is_completed: false
    //     }
    // ]);
    const [tasks, setTasks] = useState([])
   
    useEffect(() => {
        updateUIList()
    }, [])

    function updateUIList(){
        getallTasks()
        .then((res) => setTasks(res))
    }

    function addTask() {
        if(text){
            const newTask = {
                id: Date.now(),
                text: text,
                date: new Date().toLocaleString({ hour12: false }),
                is_completed: false
            };
            postnewTask(newTask)
            
            setText('');
        } else {
            alert("Title cannot be empty !");
        }

    }

    function deleteTask(id) {
        deletenewTask(id)
        
    }

    function toggleTask(id) {
        tasks.map(task => {
            if (task.id === id) {
                const updated =  { ...task, is_completed: !task.is_completed }
                putEditTask(updated)
                
                return updated;
            } else {
                return task;
            }
        });
        
    }

    function editTask(edittedTask) {
        setButtonType('edit')
        setEdittedId(edittedTask.id)
        setText(edittedTask.text)
    }

    function confirmEdit() {
        tasks.map((task) => {
            setButtonType('add')
            if (task.id === edittedId) {
                setText('')
                const updated =  { ...task, text: text }
                putEditTask(updated)
                return updated;
            } else {
                setText('')
                return task;
            }
        })
        
    }

    function cancelEdit(edittedTask) {
        setButtonType('add')
        setText('')
        return edittedTask
    }

    async function postnewTask(newTask) {
        try {
            const response = await fetch(urlApi + "/api/todos", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(newTask),
            });
        
            if (!response.ok) throw new Error("Failed to add task");
        
            const savedTask = await response.json();
            updateUIList()
        } catch (error) {
            console.error("Error adding task:", error);
            alert("Something went wrong while saving the task.");
          }
    }

    async function getallTasks() {
        try {
            const response = await fetch(urlApi + "/api/todos", {
              method: "GET",
            });
        
            if (!response.ok) throw new Error("Failed to getting all tasks");
        
            const savedTask = await response.json(); 
            return savedTask
        } catch (error) {
            console.error("Error getting task:", error);
            alert("Something went wrong while getting all tasks.");
          }
    }

    // async function getSingleTask(newTask) {
    //     try {
    //         const response = await fetch(urlApi + "/api/todos/" +  newTask.id.toString(), {
    //           method: "GET",
    //         });
        
    //         if (!response.ok) throw new Error("Failed to get task");
        
    //         const savedTask = await response.json(); 
    //         setTasks(savedTask)
    //     } catch (error) {
    //         console.error("Error getting task:", error);
    //         alert("Something went wrong while getting the task.");
    //       }
    // }

    async function putEditTask(newTask) {
        try {
            const response = await fetch(urlApi + "/api/todos/" + newTask.id.toString(), {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(newTask),
            });
        
            if (!response.ok) throw new Error("Failed to edit task");
            updateUIList()
        } catch (error) {
            console.error("Error editing task:", error);
            alert("Something went wrong while editing the task.");
          }
    }

    async function deletenewTask(id) {
        try {
            const response = await fetch(urlApi + "/api/todos/" + id, {
              method: "DELETE",
            });
        
            if (!response.ok) throw new Error("Failed to delete task");
        
            const savedTask = await response.json();
            updateUIList()
        } catch (error) {
            console.error("Error delete task:", error);
            alert("Something went wrong while deleting the task.");
          }
    }

    return (
        <div className="todo-list">
            <h1 className="main-title">Task Management</h1>
            <div className='align-left'>
                <div className='tb-title' style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    Title:
                </div>
                <br />
                <input
                    className='add-task-text'
                    value={text}
                    onChange={e => setText(e.target.value)}
                />
            </div>
            <br />
            {buttonType === 'add' ?
                (
                    <button
                        onClick={addTask}
                        className="add-task"
                    >
                        Add Task
                    </button>
                )
                :
                (
                    <div className='button-list'>
                        <button
                            onClick={confirmEdit}
                            className="confirm-edit"
                        >
                            Update Task
                        </button>
                        <button
                            onClick={cancelEdit}
                            className="cancel-edit"
                        >
                            Cancel
                        </button>
                    </div>
                )
            }

            <div className='align-left'>
                <h2 className="task-type">Ongoing Task</h2>
                {tasks.filter((t) => !t.is_completed).map((task) => (
                    <TodoItem
                        key={task.id}
                        task={task}
                        onDelete={deleteTask}
                        onToggle={toggleTask}
                        onEdit={editTask}
                    />
                ))}

                <h2 className="task-type">Completed Task</h2>
                {tasks.filter((t) => t.is_completed).map((task) => (
                    <TodoItem
                        key={task.id}
                        task={task}
                        onDelete={deleteTask}
                        onToggle={toggleTask}
                        onEdit={editTask}
                    />
                ))}
            </div>
        </div>

    );
}
export default TodoList;
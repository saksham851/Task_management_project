document.addEventListener('DOMContentLoaded', () => {
  const taskList = document.getElementById('taskList');
  const taskDetails = document.getElementById('taskDetails');
  const taskForm = document.getElementById('taskForm');
  const addTaskButton = document.getElementById('addTaskButton');
  const cancelButton = document.getElementById('cancelButton');
  const saveTaskButton = document.getElementById('saveTaskButton');

  let tasks = [];


  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      tasks = await response.json();
      displayTasks();
    } catch (error) {
      console.error('Error fetching tasks:', error.message);
    }
  };

 
  const displayTasks = () => {
    taskList.innerHTML = '';
    tasks.forEach(task => {
      const taskElement = document.createElement('div');
      taskElement.classList.add('task');
      taskElement.innerHTML = `
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <p>Due Date: ${new Date(task.dueDate).toLocaleDateString()}</p>
        <button class="viewButton" data-task-id="${task._id}">View Details</button>
        <button class="editButton" data-task-id="${task._id}">Edit</button>
        <button class="deleteButton" data-task-id="${task._id}">Delete</button>
      `;
      taskList.appendChild(taskElement);

    
      const viewButton = taskElement.querySelector('.viewButton');
      const editButton = taskElement.querySelector('.editButton');
      const deleteButton = taskElement.querySelector('.deleteButton');

      viewButton.addEventListener('click', () => viewTask(task._id));
      editButton.addEventListener('click', () => editTask(task._id));
      deleteButton.addEventListener('click', () => deleteTask(task._id));
    });
  };

 
  const viewTask = async (taskId) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`);
      if (!response.ok) {
        throw new Error('Task not found');
      }
      const task = await response.json();
      populateForm(task);
      taskDetails.classList.remove('hidden');
    } catch (error) {
      console.error('Error fetching task details:', error.message);
    }
  };

 
  const populateForm = (task) => {
    taskForm.reset(); // Reset form fields before populating
    document.getElementById('title').value = task.title;
    document.getElementById('description').value = task.description;
    document.getElementById('dueDate').value = task.dueDate.slice(0, 10); 

    
    const taskIdField = document.createElement('input');
    taskIdField.type = 'hidden';
    taskIdField.name = 'taskId';
    taskIdField.value = task._id;
    taskForm.appendChild(taskIdField);

    saveTaskButton.textContent = 'Update'; 
  };

  const editTask = async (taskId) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`);
      if (!response.ok) {
        throw new Error('Task not found');
      }
      const task = await response.json();
      populateForm(task);
      taskDetails.classList.remove('hidden');
    } catch (error) {
      console.error('Error fetching task details:', error.message);
    }
  };

 
  addTaskButton.addEventListener('click', () => {
    taskForm.reset();
    saveTaskButton.textContent = 'Save'; // Reset button text to 'Save'
    taskDetails.classList.remove('hidden');
  });


  cancelButton.addEventListener('click', () => {
    taskForm.reset();
    saveTaskButton.textContent = 'Save'; // Reset button text to 'Save'
    taskDetails.classList.add('hidden');
  });

  
  saveTaskButton.addEventListener('click', async (event) => {
    event.preventDefault();
    const formData = new FormData(taskForm);
    const newTask = {
      title: formData.get('title'),
      description: formData.get('description'),
      dueDate: formData.get('dueDate')
    };

    try {
      let response;
      if (formData.has('taskId')) {
        const taskId = formData.get('taskId');
        response = await fetch(`/api/tasks/${taskId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newTask)
        });
      } else {
        response = await fetch('/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newTask)
        });
      }

      if (!response.ok) {
        throw new Error('Failed to save task');
      }

      taskForm.reset();
      saveTaskButton.textContent = 'Save'; // Reset button text to 'Save'
      taskDetails.classList.add('hidden');
      fetchTasks(); // Refresh task list
    } catch (error) {
      console.error('Error saving task:', error.message);
    }
  });

 
  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      
      tasks = tasks.filter(task => task._id !== taskId);
      displayTasks();
    } catch (error) {
      console.error('Error deleting task:', error.message);
    }
  };

  
  fetchTasks();
});

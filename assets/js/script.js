// Define a function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();

  const taskTitle = $('#taskTitle').val();
  const taskDescription = $('#taskDescription').val();
  const taskDuedate = $('#taskDuedate').val();

  console.log("Task Title:", taskTitle);
  console.log("Task Description:", taskDescription);
  console.log("Task Due Date:", taskDuedate);

  const newTask = {
    id: Date.now(),
    title: taskTitle,
    description: taskDescription,
    duedate: taskDuedate,
    status: 'to-do'
  };

  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push(newTask);
  localStorage.setItem('tasks', JSON.stringify(tasks));

  console.log("Tasks in localStorage:", tasks);

  renderTaskList();
  $('#formModal').modal('hide');
}

// Function to render the task list
function renderTaskList() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  
  console.log("Rendering tasks:", tasks);

  $('#todo-cards').empty();
  $('#in-progress-cards').empty();
  $('#done-cards').empty();
  
  tasks.forEach(task => {
    const taskCard = `
      <div class="card mb-3" data-id="${task.id}">
        <div class="card-body">
          <h5 class="card-title">${task.title}</h5>
          <p class="card-text">${task.description}</p>
          <p class="card-text"><small class="text-muted">${task.duedate}</small></p>
        </div>
      </div>
    `;

    $(`#${task.status}-cards`).append(taskCard);
  });

  // Initialize drag-and-drop
  initDragAndDrop();
}

// Function to initialize drag-and-drop
function initDragAndDrop() {
  $('.card').draggable({
    revert: 'invalid',
    start: function (event, ui) {
      $(this).css('z-index', 100);
    },
    stop: function (event, ui) {
      $(this).css('z-index', 1);
    }
  });

  $('.lane .card-body').droppable({
    accept: '.card',
    drop: function (event, ui) {
      const taskId = $(ui.draggable).data('id');
      const newStatus = $(this).parent().attr('id');
      const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

      const task = tasks.find(t => t.id === taskId);
      task.status = newStatus.replace('-cards', '');
      localStorage.setItem('tasks', JSON.stringify(tasks));

      renderTaskList();
    }
  });
}

// Initialize the application
$(document).ready(function () {
  renderTaskList();

  $('#taskForm').on('submit', handleAddTask);
  $('#formModal').on('show.bs.modal', function () {
    $('#taskTitle').val('');
    $('#taskDescription').val('');
    $('#taskDuedate').val('');
  });

  // Initialize date picker for task due date
  $('#taskDuedate').datepicker({
    dateFormat: 'mm/dd/yy'
  });
});

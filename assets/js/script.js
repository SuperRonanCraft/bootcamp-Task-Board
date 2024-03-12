// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));
const formModal = $("#formModal");
const inputTitle = $("#formTitle");
const inputDate = $("#formDate");
const inputDescription = $("#formDescription");
const tasksTodo = $("#todo-cards");
const tasksProgress = $("#in-progress-cards");
const tasksDone = $("#done-cards");

// Todo: create a function to generate a unique task id
function generateTaskId() {
  if (nextId === null) {
    nextId = 0;
  } else {
    nextId++;
  }
  localStorage.setItem("nextId", JSON.stringify(nextId));
  return nextId;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  const taskContainer = $("<div>");

  //Create Title
  const taskTitle = $("<h2>");
  taskTitle.text(task.title);
  taskContainer.append(taskTitle);

  //Create Description
  const taskDescription = $("<p>");
  taskDescription.text(task.description);
  taskContainer.append(taskDescription);

  //Create Date
  const taskDate = $("<p>");
  taskDate.text(task.date);
  taskContainer.append(taskDate);

  //Create a delete button
  const taskDelete = $("<button>");
  taskDelete.text("Delete");
  //Using Bootstrap css styling
  taskDelete.addClass("btn-danger").addClass("btn");
  taskDelete.css("margin-bottom", "5px");
  taskContainer.append(taskDelete);

  //Add task to todo
  taskContainer.addClass("task-card");
  taskContainer.data("id", task.id);

  //Set how important this is via due date
  //taskContainer.addClass("task-danger");

  return taskContainer;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  //Remove all previous tasks
  for (const taskDiv of $(".task-holder")) {
    $(taskDiv)
      .children()
      .each(function () {
        $(this).remove();
      });
  }

  //Load all saved tasks (if they exist...)
  if (taskList === null) return;
  for (let task of taskList) {
    const taskEl = createTaskCard(task);

    //Set the element via its task type
    switch (task.type) {
      case "todo":
        tasksTodo.append(taskEl);
        break;
      case "progress":
        tasksProgress.append(taskEl);
        break;
      case "done":
        tasksDone.append(taskEl);
        break;
    }
  }
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  //Hides the modal/form
  formModal.modal("hide");

  const taskData = {
    title: inputTitle.val(),
    date: inputDate.val(),
    description: inputDescription.val(),
    type: "progress",
    id: generateTaskId(),
  };

  taskList = JSON.parse(localStorage.getItem("tasks")) || [];
  taskList.push(taskData);
  localStorage.setItem("tasks", JSON.stringify(taskList));

  renderTaskList();
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  //Render all saved Tasks
  renderTaskList();
  //Set Datepicker on date picking element on Modal
  $("#formDate").datepicker({
    format: "MM/DD/YYYY",
  });
  //Add click event to forms submit button
  $("#submitTask").click(handleAddTask);
  $("#tasks").on("click", ".btn-danger", function () {
    //Get the id of the task
    //Grab the parent of the button
    const taskContainer = $(this).parent();
    const taskId = $(taskContainer).data("id");
    console.log(taskId);
  });
});

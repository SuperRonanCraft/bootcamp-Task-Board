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

//Data
let dragged = null;

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

  //Set how important this is via due date or if its donne
  const daysLeft = getDaysLeft(task.date);
  let priority = "task-danger";
  if (daysLeft >= 6 || task.type === "done") {
    priority = "task-good";
  } else if (daysLeft >= 2) {
    priority = "task-warning";
  }
  taskContainer.addClass(priority);

  return taskContainer;
}

function getDaysLeft(date) {
  const now = dayjs();
  const from = dayjs(date);
  const diff = from.diff(now, "day");
  return diff;
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
    //Make Task Draggable
    taskEl.attr("draggable", "true");

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
    type: "todo",
    id: generateTaskId(),
  };

  //Reset form values
  inputTitle.val("");
  inputDate.val("");
  inputDescription.val("");

  taskList = JSON.parse(localStorage.getItem("tasks")) || [];
  taskList.push(taskData);
  saveTasks();

  //Render all tasks
  renderTaskList();
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(taskList));
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
  //Grab the parent of the button
  const taskContainer = $(this).parent();
  //Get the id of the task
  const taskId = $(taskContainer).data("id");
  //Remove taskId from local storage and save
  removeTask(taskId);
  //Render all tasks again
  renderTaskList();
}

function removeTask(taskId) {
  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].id === taskId) {
      taskList.splice(i, 1);
      break;
    }
  }
  //Save modified taskList
  saveTasks();
}

//Retrieve the task object from the taskList
function getTask(taskId) {
  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].id === taskId) {
      return taskList[i];
    }
  }
}

//Change the status of a task and render tasks again
function changeTaskType(taskId, newType) {
  const task = getTask(taskId);
  task.type = newType;
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event) {
  const tasksListEl = $(event.target).children("div");
  //Get the element we are dropping
  const draggedTask = dragged;
  //Get the taskId of the dragged
  const taskId = $(draggedTask).data("id");

  //Get which task list we just dropped this task on
  switch (tasksListEl.attr("id")) {
    //Todo Div
    case tasksTodo.attr("id"):
      changeTaskType(taskId, "todo");
      break;
    case tasksProgress.attr("id"):
      changeTaskType(taskId, "progress");
      break;
    case tasksDone.attr("id"):
      changeTaskType(taskId, "done");
      break;
  }
  //Render the task list again when dropping
  renderTaskList();
}

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
  $("#tasks").on("click", ".btn-danger", handleDeleteTask);
  $(".card-body")
    //Need a dragover for drop to work?
    .on("dragover", false)
    .on("drop", handleDrop);
  //Save to data what task we are dragging
  $(document).on("dragstart", ".task-card", function () {
    dragged = this;
  });
});

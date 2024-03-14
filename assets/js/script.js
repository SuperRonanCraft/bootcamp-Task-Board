//Dependencies
const formModal = $("#formModal");
const inputTitle = $("#formTitle");
const inputDate = $("#formDate");
const inputDescription = $("#formDescription");
const tasksTodo = $("#todo-cards");
const tasksProgress = $("#in-progress-cards");
const tasksDone = $("#done-cards");

// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

//Functions
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

  //Add classes and taskid to data
  taskContainer.addClass("task-card draggable");
  taskContainer.data("id", task.id);

  //Set how important this task is via due date or if status is done
  const daysLeft = getDaysLeft(task.date);
  let priority = "task-danger";
  if (daysLeft >= 3 || task.type === "done") {
    priority = "task-good";
  } else if (daysLeft >= 1) {
    priority = "task-warning";
  }
  taskContainer.addClass(priority);
  taskContainer.attr("data-taskid", task.id);

  return taskContainer;
}

//Via the DayJS api, get how many days a task is due from todays date
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
    //Set the element via its task type
    // console.log(task.type);
    switch (task.type) {
      case "to-do":
        tasksTodo.append(taskEl);
        break;
      case "in-progress":
        tasksProgress.append(taskEl);
        break;
      default:
        tasksDone.append(taskEl);
    }
  }

  $(".draggable").draggable({
    opacity: 0.7,
    zIndex: 100,
    // ? This is the function that creates the clone of the card that is dragged. This is purely visual and does not affect the data.
    helper: function (e) {
      // ? Check if the target of the drag event is the card itself or a child element. If it is the card itself, clone it, otherwise find the parent card  that is draggable and clone that.
      const original = $(e.target).hasClass(".draggable")
        ? $(e.target)
        : $(e.target).closest(".draggable");
      // ? Return the clone with the width set to the width of the original card. This is so the clone does not take up the entire width of the lane. This is to also fix a visual bug where the card shrinks as it's dragged to the right.
      return original.clone().css({
        width: original.outerWidth(),
      });
    },
  });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  //Hides the modal/form
  formModal.modal("hide");

  const taskData = {
    title: inputTitle.val(),
    date: inputDate.val(),
    description: inputDescription.val(),
    type: "to-do",
    id: generateTaskId(),
  };

  //Reset form values
  inputTitle.val("");
  inputDate.val("");
  inputDescription.val("");

  //Set and save our new task to the list and localStorage
  taskList = JSON.parse(localStorage.getItem("tasks")) || [];
  taskList.push(taskData);
  saveTasks();

  //Render all tasks
  renderTaskList();
}

//Save the taskList to localStorage
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

//Remove a task from the taskList
function removeTask(taskId) {
  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].id === taskId) {
      //Remove this and only this task from the list
      taskList.splice(i, 1);
      break;
    }
  }
  //Save modified taskList
  saveTasks();
}

//Retrieve the specific task object from the taskList via its id
function getTask(taskId) {
  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].id == taskId) {
      return taskList[i];
    }
  }
  return null;
}

//Change the status of a task and render tasks again
function changeTaskType(taskId, newType) {
  const task = getTask(taskId);
  if (task !== null) {
    task.type = newType;
  }
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  //Get the element we are dropping
  const taskEl = ui.draggable[0];
  //Get the taskId of the dragged
  const taskId = taskEl.dataset.taskid;
  //Get which task list we just dropped this task on
  console.log(event.target.id + " " + tasksTodo.attr("id"));
  switch (event.target.id) {
    //Todo Div
    case "to-do":
      changeTaskType(taskId, "to-do");
      break;
    case "in-progress":
      changeTaskType(taskId, "in-progress");
      break;
    default:
      changeTaskType(taskId, "done");
  }
  saveTasks();
  //Render the task list again when dropping
  renderTaskList();
}

//User Interactions/Inits
// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  //Render all saved Tasks
  renderTaskList();
  //Set Datepicker on date picking element on Modal
  $("#formDate").datepicker();
  //Add click event to forms submit button
  $("#submitTask").click(handleAddTask);
  $("#tasks").on("click", ".btn-danger", handleDeleteTask);
  $(".lane").droppable({
    accept: ".draggable",
    drop: handleDrop,
  });
  // $(".card-body")
  //   //Need a dragover for drop to work?
  //   /* Got this from https://stackoverflow.com/questions/19223352/jquery-ondrop-not-firing */
  //   .on("dragover", false)
  //   .on("drop", handleDrop);
  //Save what task we are dragging on drag start
  // $(document).on("dragstart", ".task-card", function () {
  //   dragged = this;
  // });
});

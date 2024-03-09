//Dependencies
const addTaskEl = document.getElementById("newtask");
const taskBoxEl = document.querySelectorAll(".task-container");

//Data

//Functions
addTaskEl.addEventListener("click", newTask);

for (let taskBox of taskBoxEl) {
  taskBox.addEventListener("click", taskClick);
}

// New Task Button click Event
function newTask() {
  console.log("New Task Button!");
}

// Click event for all 3 task containers
function taskClick(event) {
  // Check if where clicked in inside a delete button
  if (event.target.classList.contains("task-delete")) {
    // Remove the task from the page
    event.target.parentElement.remove();
  }
}

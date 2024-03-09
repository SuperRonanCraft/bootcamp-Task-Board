//Dependencies
const addTaskEl = document.getElementById("newtask");
const taskBoxEl = document.querySelectorAll(".task-container");

//Data

//Functions
addTaskEl.addEventListener("click", newTask);

for (let taskBox of taskBoxEl) {
  taskBox.addEventListener("click", taskClick);
}

function newTask() {
  console.log("New Task Button!");
}

function taskClick(event) {
  // Check if where clicked in inside a delete button of a task box
  console.log(event);
  if (event.target.classList.contains("task-delete")) {
    console.log(event.srcElement);
    event.target.parentElement.remove();
  }
}

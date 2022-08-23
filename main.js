let addTaskBtn = document.querySelector("#new-task-submit");
let newTask = document.querySelector(".enter input");
let storageArray = [];

// creat task function
function creatTask(taskValue) {
  let task = document.createElement("div");
  task.classList.add("task");
  document.querySelector(".content").append(task);
  let taskName = document.createElement("input");
  taskName.setAttribute("readonly", true);
  taskName.setAttribute("type", "text");
  taskName.value = taskValue;
  taskValue = "";
  let editBtn = document.createElement("button");
  editBtn.id = "edit";
  editBtn.innerHTML = "EDIT";
  let deleteBtn = document.createElement("button");
  deleteBtn.id = "delete";
  deleteBtn.innerHTML = "DELETE";
  task.append(taskName, editBtn, deleteBtn);
  // local storage
  let obj = {
    id: Date.now(),
    completed: false,
    name: taskName.value,
  };
  storageArray.push(obj);
  localStorage.setItem("tasks", JSON.stringify(storageArray));
  // edit task
  editBtn.onclick = () => {
    editeTask(editBtn);
  };
  // delete task
  deleteBtn.onclick = () => {
    deleteTask(deleteBtn);
  };
}

// delete task function
function deleteTask(e) {
  let t = JSON.parse(localStorage.getItem("tasks"));
  t.forEach((ele) => {
    if (ele.name === e.parentElement.firstChild.value) {
      ele.completed = true;
    }
  });
  localStorage.setItem("tasks", JSON.stringify(t));
  e.parentElement.remove();
}

// edit task function
function editeTask(e) {
  if (e.innerHTML == "EDIT") {
    e.innerHTML = "DONE";
    e.parentElement.firstChild.removeAttribute("readonly");
    let t = JSON.parse(localStorage.getItem("tasks"));
    t.forEach((ele) => {
      if (ele.name === e.parentElement.firstChild.value) {
        ele.name = "";
      }
    });
    localStorage.setItem("tasks", JSON.stringify(t));
  } else {
    if (e.parentElement.firstChild.value === "") {
      console.log("enter any letter");
      document.querySelector("h2 + p").classList.add("show");
      setTimeout(() => {
        document.querySelector("h2 + p").classList.remove("show");
      }, 4000);
    } else {
      e.innerHTML = "EDIT";
      e.parentElement.firstChild.setAttribute("readonly", true);
      let t = JSON.parse(localStorage.getItem("tasks"));
      t.forEach((ele) => {
        if (ele.name === "") {
          ele.name = e.parentElement.firstChild.value;
        }
      });
      localStorage.setItem("tasks", JSON.stringify(t));
    }
  }
}

addTaskBtn.addEventListener("click", () => {
  if (newTask.value == "" || newTask.value == null) {
    document.querySelector("h1 + p").classList.add("show");
    setTimeout(() => {
      document.querySelector("h1 + p").classList.remove("show");
    }, 4000);
  } else {
    //   check if the task is repeated
    if (document.querySelector(".content").children.length > 0) {
      let tasksArray = Array.from(document.querySelector(".content").children);
      tasksArray = tasksArray.map((e) => {
        return e.firstChild.value;
      });
      let similar = false;
      tasksArray.forEach((e) => {
        if (e === newTask.value) {
          similar = true;
        }
      });
      if (similar === false) {
        creatTask(newTask.value);
      }
    } else {
      creatTask(newTask.value);
    }
    newTask.value = "";
  }
});

// get items from local storage
if (localStorage.length !== 0) {
  let t = JSON.parse(localStorage.getItem("tasks"));
  for (let i = 0; i < t.length; i++) {
    if (!t[i].completed && t[i].name !== "") creatTask(t[i].name);
  }
}

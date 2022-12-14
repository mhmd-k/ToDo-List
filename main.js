const addTaskBtn = document.querySelector("#new-task-submit");
const newTask = document.querySelector(".enter input");
const clearBtn = document.getElementById("clear");
const messageOne = document.querySelector("h1 + span");
const messageTow = document.querySelector("h2 + span");
let storageArray = [];

// creat task function
function creatTask(taskValue) {
  clearBtn.classList.add("visible");
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
    if (!document.querySelector(".tasks .content").hasChildNodes()) {
      clearBtn.classList.remove("visible");
    }
  };
}

// message function
function message(ele, eleClass, text) {
  ele.innerHTML = text;
  ele.classList.add(eleClass);
  setTimeout(() => {
    ele.classList.remove(eleClass);
  }, 3000);
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
  let taskkName = e.parentElement.firstChild;
  let availableTasks = Array.from(
    document.querySelectorAll(".task input")
  ).filter((at) => {
    return at !== taskkName;
  });
  if (e.innerHTML == "EDIT") {
    e.nextElementSibling.style.setProperty("pointer-events", "none");
    e.innerHTML = "DONE";
    taskkName.focus();
    window.onbeforeunload = function () {
      if (e.innerHTML === "DONE") {
        return "";
      }
    };
    document.querySelectorAll("#edit").forEach((btn) => {
      btn.style.setProperty("pointer-events", "none");
    });
    e.style.setProperty("pointer-events", "visible");
    taskkName.removeAttribute("readonly");
    let t = JSON.parse(localStorage.getItem("tasks"));
    t.forEach((ele) => {
      if (ele.name === taskkName.value) {
        ele.name = "";
      }
    });
    localStorage.setItem("tasks", JSON.stringify(t));
  } else if (e.innerHTML === "DONE") {
    if (taskkName.value === "") {
      // if task is empty
      message(messageTow, "empty", "Task can't be empty");
    } else if (availableTasks.length === 0) {
      // if we have only one task
      e.innerHTML = "EDIT";
      e.nextElementSibling.style.setProperty("pointer-events", "visible");
      taskkName.setAttribute("readonly", true);
      let t = JSON.parse(localStorage.getItem("tasks"));
      t.forEach((ele) => {
        if (ele.name === "") {
          ele.name = taskkName.value;
        }
      });
      localStorage.setItem("tasks", JSON.stringify(t));
    } else {
      // if we have more than one task
      let alreadyExists = false;
      availableTasks.forEach((at) => {
        if (
          taskkName.value.toString().split(" ").join("") ===
          at.value.toString().split(" ").join("")
        ) {
          message(
            messageTow,
            "empty",
            "there is already a task with the same name"
          );
          alreadyExists = true;
        }
      });
      if (alreadyExists === false) {
        document.querySelectorAll("#edit").forEach((btn) => {
          btn.style.setProperty("pointer-events", "visible");
        });
        e.innerHTML = "EDIT";
        e.nextElementSibling.style.setProperty("pointer-events", "visible");
        taskkName.setAttribute("readonly", true);
        let t = JSON.parse(localStorage.getItem("tasks"));
        t.forEach((ele) => {
          if (ele.name === "") {
            ele.name = taskkName.value;
          }
        });
        localStorage.setItem("tasks", JSON.stringify(t));
      }
    }
  }
}

// check if the task is repeated function
function checkIfRepeated(contentDiv) {
  if (contentDiv.children.length > 0) {
    let tasksArray = Array.from(contentDiv.children);
    tasksArray = tasksArray.map((e) => {
      return e.firstChild.value;
    });
    let similar = false;
    tasksArray.forEach((e) => {
      if (
        e.toString().split(" ").join("") ===
        newTask.value.toString().split(" ").join("")
      ) {
        similar = true;
      }
    });
    if (similar === false) {
      creatTask(newTask.value);
      message(messageOne, "added", "Task has been added");
    } else {
      message(
        messageOne,
        "empty",
        "There is already a task with the same name"
      );
    }
  } else {
    creatTask(newTask.value);
    message(messageOne, "added", "Task has been added");
  }
}

// add new task when pressing the button
addTaskBtn.addEventListener("click", () => {
  if (newTask.value == "" || newTask.value == null) {
    message(messageOne, "empty", "Task can't be an empty string");
  } else {
    checkIfRepeated(document.querySelector(".content"));
    newTask.value = "";
  }
});

// add new task when pressing ENTER
newTask.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    if (newTask.value == "" || newTask.value == null) {
      message(messageOne, "empty", "Task can't be an empty string");
    } else {
      checkIfRepeated(document.querySelector(".content"));
      newTask.value = "";
    }
  }
});

// delete all tasks
clearBtn.addEventListener("click", () => {
  storageArray = [];
  localStorage.removeItem("tasks");
  document.querySelector(".content").innerHTML = "";
  clearBtn.classList.remove("visible");
  message(messageOne, "added", "All tasks deleted");
});

// get items from local storage
if (localStorage.length !== 0) {
  let t = JSON.parse(localStorage.getItem("tasks"));
  for (let i = 0; i < t.length; i++) {
    if (!t[i].completed && t[i].name !== "") creatTask(t[i].name);
  }
  if (document.querySelector(".tasks .content").hasChildNodes()) {
    clearBtn.classList.add("visible");
  }
}

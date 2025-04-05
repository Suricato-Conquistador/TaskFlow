// Variables
const TaskArea = document.querySelector("#taskarea")
const ButtonAdd = document.querySelector("#buttonAdd")
const Title = document.querySelector("#title")


// 
ButtonAdd.addEventListener("click", () => {
    if(Title.value != "") {
        createTask()
        Title.value = ""
    }
})


// Function that create a task
function createTask() {
    const Div = document.createElement("div")
    Div.className = "taskbox"

    const p = document.createElement("p")
    p.innerHTML = Title.value

    Div.appendChild(p)
    TaskArea.appendChild(Div)
}


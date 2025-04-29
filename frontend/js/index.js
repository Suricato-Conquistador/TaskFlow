import { getTasksByUser, postUser } from "./connection.js"

// Tasks variables
const taskArea = document.querySelector('#taskarea')
const buttonAdd = document.querySelector('#buttonAdd')
const buttonRemove = document.querySelectorAll('#buttonRemove')
const title = document.querySelector('#title')








// 
buttonAdd.addEventListener("click", () => {
    if(title.value != "") {
        // getTasksByUser(1)
        createTask()
        title.value = ""
    }
})

const tira = () => buttonRemove.forEach(e => removeTask(e))


// Function that create a task
function createTask() {
    const div = document.createElement("div")
    div.className = "taskbox"

    const p = document.createElement("p")
    p.innerHTML = title.value

    const button = document.createElement("button")
    button.id = "buttonRemove"

    div.appendChild(button)
    div.appendChild(p)
    taskArea.appendChild(div)
}

function removeTask(e) {
    e.addEventListener("click", () => {
        let pai = e.parentElement
        pai.remove()
    })
}

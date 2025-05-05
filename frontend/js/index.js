import { getTasksByUser, postTask, deleteTask, getUserById } from "./connection.js"


// Tasks variables
const taskArea = document.querySelector('#taskarea')
const buttonAdd = document.querySelector('#buttonAdd')
const buttonRemove = document.querySelectorAll('#buttonRemove')
const title = document.querySelector('#title')
const description = document.querySelector('#description')
const userId = sessionStorage.getItem("id")


// Verify if exists a logged user
const verifyUser = async() => {
    if(userId === null) {
        window.location.href = "/frontend/login.html"
    }
    const response = await getUserById(userId)
    if(response["status_code"] != 200) {
        window.location.href = "/frontend/login.html"
    }
}

await verifyUser()


// Create task
buttonAdd.addEventListener("click", async() => {
    if(title.value == "") {
        return //SWAL
    } if(description.value == "") {
        description.value = title.value
    }

    const result = await postTask(userId, title.value, description.value)
    console.log(result)

    if (result["status_code"] == 200) {
        const taskId = result["_id"]
        renderTask(taskId, title.value, description.value)
    }

    title.value = ""
    description.value = ""
})


// Load tasks
const loadTask = async() => {
    const tasks = await getTasksByUser(userId)

    if(tasks) {
        tasks.forEach(task => {
            renderTask(task._id, task.title, task.description)
        })
    }
}


// Function that create a task
const renderTask = async(id, title, description) => {
    const div = document.createElement("div")
    div.className = "taskbox"
    div.dataset.taskId = id

    const pTitle = document.createElement("p")
    pTitle.innerHTML = `<strong>${title}</strong>`

    const pDesc = document.createElement("p")
    pDesc.innerHTML = description

    const button = document.createElement("button")
    button.innerText = "Remover"
    button.classList.add("buttonRemove")
    button.addEventListener("click", async() => {
        div.remove()
        await deleteTask(id)
    })

    div.appendChild(pTitle)
    div.appendChild(pDesc)
    div.appendChild(button)
    taskArea.appendChild(div)
}

await loadTask()


//
document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault()
        buttonAdd.click()
    }
})


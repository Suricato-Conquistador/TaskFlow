import { getTasksByUser, postTask, getUserById } from "./connection.js"


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
    console.log(response)
}

await verifyUser()



// Create task
buttonAdd.addEventListener("click", async() => {
    if(description.value == "") {
        description.value = title.value
    }

    const result = await postTask(userId, title.value, description.value)

    console.log(result)

    // console.log(userId)
    // console.log(title.value)
    // console.log(description.value)
    // createTask()
    // postTaskDB(userId, title.value, description.value)
    // title.value = ""
    // description.value = ""
})


//
const postTaskDB = async(id, title, description) => {
    const result = postTask(id, title, description)
    alert(result)
}


// Function that create a task
const createTask = async() => {
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

// function removeTask(e) {
//     e.addEventListener("click", () => {
//         let pai = e.parentElement
//         pai.remove()
//     })
// }

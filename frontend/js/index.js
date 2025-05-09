import { getTasksByUser, postTask, putTask, deleteTask, getUserById } from "./connection.js"


// Tasks variables
const taskArea = document.querySelector('#taskarea')
const buttonAdd = document.querySelector('#buttonAdd')
const title = document.querySelector('#title')
const description = document.querySelector('#description')
const userId = sessionStorage.getItem("id")


// Verify if exists a logged user
const verifyUser = async() => {
    if(userId === null) {
        window.location.href = "/frontend/index.html"
    }
    const response = await getUserById(userId)
    if(response["status_code"] != 200) {
        window.location.href = "/frontend/index.html"
    }
}

// await verifyUser()


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
        await loadTask()
    }

    title.value = ""
    description.value = ""
})


// Load tasks
const loadTask = async() => {
    taskArea.innerHTML=""
    const tasks = await getTasksByUser(userId)

    if(tasks) {
        tasks.forEach(task => {
            renderTask(task._id, task.title, task.description, task.status)
        })
    }
}


// Function that create a task
const renderTask = async(id, title, description, status) => {
    const div = document.createElement("div")
    div.className = "taskbox"
    div.dataset.taskId = id

    const pTitle = document.createElement("p")
    pTitle.innerHTML = `<strong>${title}</strong>`

    const pDesc = document.createElement("p")
    pDesc.innerHTML = description

    const select = document.createElement("select")

    const statusOptions = {
        0: "Não iniciado",
        1: "Em andamento",
        2: "Concluída"
    }

    for (const [value, label] of Object.entries(statusOptions)) {
        const option = document.createElement("option")
        option.value = value
        option.textContent = label
        select.appendChild(option)
    }

    select.value = status?.toString() || "0"

    select.addEventListener("change", async () => {
        const novoStatus = select.value
        await putTask(id, userId, undefined, undefined, novoStatus)
    })

    const button = document.createElement("button")
    button.innerText = "Remover"
    button.classList.add("buttonRemove")
    button.addEventListener("click", async() => {
        div.remove()
        await deleteTask(id)
    })

    const modalOverlay = document.createElement("div")
    modalOverlay.className = "modal-overlay"
    modalOverlay.style.display = "none"

    const modal = document.createElement("div")
    modal.className = "modal"

    const modalTitle = document.createElement("input")
    modalTitle.value = title

    const modalDesc = document.createElement("input")
    modalDesc.value = description

    const closeModal = document.createElement("button")
    closeModal.textContent = "Fechar"
    closeModal.addEventListener("click", () => {
        modalOverlay.style.display = "none"
    })

    const saveModal = document.createElement("button")
    saveModal.textContent = "Salvar"
    saveModal.addEventListener("click", async() => {
        const newTitle = modalTitle.value
        const newDesc = modalDesc.value

        const result = await putTask(id, userId, modalTitle.value, modalDesc.value, undefined)

        if (result["status_code"] === 200) {
            // Atualiza a exibição na tela
            pTitle.innerHTML = `<strong>${newTitle}</strong>`
            pDesc.innerHTML = newDesc
            modalOverlay.style.display = "none"
        } else {
            // opcional: exibir erro com Swal ou alert
            alert("Erro ao salvar a tarefa")
        }
    })

    modal.appendChild(modalTitle)
    modal.appendChild(modalDesc)
    modal.appendChild(closeModal)
    modal.appendChild(saveModal)
    modalOverlay.appendChild(modal)
    document.body.appendChild(modalOverlay)

    div.addEventListener("click", (e) => {
        if (e.target === select || e.target === button) return
        modalOverlay.style.display = "flex"
    });

    div.appendChild(pTitle)
    div.appendChild(pDesc)
    div.appendChild(select)
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


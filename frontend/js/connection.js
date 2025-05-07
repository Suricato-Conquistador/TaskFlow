const api = "http://127.0.0.1:8000"


// 
const getTasksByUser = async(id) => {
    try {
        const response = await fetch(`${api}/tasksByUser/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })

        const result = await response.json()

        if(response.ok) {
            return result
        }

    } catch (error) {
        alert(`Erro: ${error}`)
        return null
    }
}


//
const getTaskById = async(id) => {
    try {
        const response = await fetch(`${api}/taskById/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })

        const result = await response.json()

        if(response.ok) {
            return result[0]
        }
    } catch (error) {
        alert(`Erro: ${error}`)
        return null
    }
}


//
const postTask = async(id, title, description) => {
    try {
        const response = await fetch(`${api}/task`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                owner: id,
                title: title,
                description: description
            })
        })
    
        const result = await response.json()
    
        if(response.ok) {
            return result
        }

    } catch(error) {
        alert(`Erro: ${error}`)
        return null
    }
}


//
const putTask = async(id, owner, title, description, status) => {
    try {
        const task =  await getTaskById(id)
        
        const data = {
            "owner": owner
        }

        if (title !== undefined) data.title = title
        else data.title = task["title"]
        
        if (description !== undefined) data.description = description
        else data.description = task["description"]
        
        if (status !== undefined) data.status = parseInt(status)
        else data.status = parseInt(task["status"])
        
        console.log("Enviando body:", JSON.stringify(data))

        const response = await fetch(`${api}/task/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        
        const result = await response.json()

        if(response.ok) {
            return result
        }

    } catch(error) {
        alert(`Erro: ${error}`)
        return null
    }
}


//
const deleteTask = async(id) => {
    try {
        const response = await fetch(`${api}/task/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        })

        const result = await response.json()

        if(response.ok) {
            return result
        }

    } catch(error) {
        alert(`Erro: ${error}`)
        return null
    }
}


//
const getUserById = async(id) => {
    try {
        const response = await fetch(`${api}/userById/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })

        const result = await response.json()

        if(response.ok) {
            return result
        }
    } catch (error) {
        alert(`Erro: ${error}`)
        return null
    }
}


//
const postUser = async(name, email, password) => {
    try {
        const response = await fetch(`${api}/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        })

        const result = await response.json()

        if(response.ok) {
            return result
        }

    } catch(error) {
        alert(`Erro: ${error}`)
        return null
    }
}


//
const postLogin = async(email, password) => {
    try {
        const response = await fetch(`${api}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                login: email,
                password: password
            })
        })

        const result = await response.json()

        if(response.ok) {
            return result
        }

    } catch(error) {
        alert(`Erro: ${error}`)
        return null
    }
}


//
export { getTasksByUser, postTask, putTask, deleteTask }

//
export { getUserById, postUser, postLogin }
const api = "http://127.0.0.1:8000"


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
            console.log(result)
            return result
        }

    } catch (error) {
        alert(`Erro: ${error}`)
        return null
    }
}


const postTask = async(id, title, description, status) => {
    const response = await fetch(`${api}/task/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            owner: id,
            title: title,
            description: description,
            status: status
        })
    })
}



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


const postLogin = async(email, password) => {
    console.log(email)
    console.log(password)
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
            return result["status_code"]
        }

    } catch(error) {
        alert(`Erro: ${error}`)
        return null
    }
}


//
export { getTasksByUser }

//
export { postUser, postLogin };
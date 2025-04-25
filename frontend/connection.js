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
        alert(`Erro ao conectar com o servidor: ${error}`)
        return null
    }
}


const postTask = async(id, title, description, status) => {
    const response = await fetch(`${api}/task`, {
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





export default getTasksByUser;

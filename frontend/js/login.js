import { postLogin } from "./connection.js"


// Login variables
const email = document.querySelector('#email')
const password = document.querySelector('#password')
const buttonLogin = document.querySelector('#buttonLogin')


// Login function
buttonLogin.addEventListener("click", async() => {
    if(!email.value || !password.value) {
        return Swal.fire({
            title: 'Erro',
            text: 'Todos os campos devem ser preenchidos',
            icon: 'error',
            confirmButtonText: 'OK'
        })
    }

    const result = await postLogin(email.value, password.value)

    if(result["status_code"] == 200) {
        const userId = result["_id"]
        sessionStorage.setItem("id", userId)
        Swal.fire({
            title: 'Sucesso!',
            text: 'Seu login foi realizado com sucesso!',
            icon: 'success',
            confirmButtonText: 'Ir para home'
        }).then((result) => {
            if(result.isConfirmed){
                window.location.href = "../tasks.html"
            }
        })
    } else {
        Swal.fire({
            title: 'Erro',
            text: 'Credenciais inválidas',
            icon: 'error',
            confirmButtonText: 'OK'
        })
    }
})


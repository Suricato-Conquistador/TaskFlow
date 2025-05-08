import { postUser } from "./connection.js"

// Register variables
const name = document.querySelector('#name')
const email = document.querySelector('#email')
const password1 = document.querySelector('#password1')
const password2 = document.querySelector('#password2')
const buttonRegister = document.querySelector('#buttonRegister')


// Register function
buttonRegister.addEventListener("click", async() => {
    if(!name.value || !email.value || !password1.value || !password2.value){
        return Swal.fire({
            title: 'Erro',
            text: 'Todos os campos devem ser preenchidos',
            icon: 'error',
            confirmButtonText: 'OK'
        })
    } 
    if(password1.value != password2.value) {
        return Swal.fire({
            title: 'Erro',
            text: 'As senhas devem ser iguais',
            icon: 'error',
            confirmButtonText: 'OK'
        })
    }

    const result = await postUser(name.value, email.value, password1.value)

    if(result["status_code"] == 200) {
        Swal.fire({
            title: 'Sucesso!',
            text: 'Seu cadastro foi realizado com sucesso!',
            icon: 'success',
            confirmButtonText: 'Ir para login'
        }).then((result) => {
            if(result.isConfirmed){
                window.location.href = "/frontend/login.html"
            }
        })
    }

})

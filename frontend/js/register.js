import { postUser } from "./connection.js"

// Register variables
const name = document.querySelector('#name')
const email = document.querySelector('#email')
const password1 = document.querySelector('#password1')
const password2 = document.querySelector('#password2')
const buttonRegister = document.querySelector('#buttonRegister')


//
buttonRegister.addEventListener("click", async() => {
    if(password1.value != password2.value) {
        return alert('As senhas devem ser iguais')
    }

    await postUser(name.value, email.value, password1.value)
})

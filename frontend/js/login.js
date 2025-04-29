import { postLogin } from "./connection.js"


// Login variables
const email = document.querySelector('#email')
const password = document.querySelector('#password')
const buttonLogin = document.querySelector('#buttonLogin')


//
buttonLogin.addEventListener("click", async() => {
    if(!email.value || !password.value) {
        return alert('Preencha todos os campos')
    }

    const result = await postLogin(email.value, password.value)
    console.log(result)

    if(result == 200) {
        window.location.href = "/frontend/index.html"
        const userId = 0
        sessionStorage.setItem("id", 1)
    }
})


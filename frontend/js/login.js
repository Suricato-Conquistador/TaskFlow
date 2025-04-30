import { postLogin } from "./connection.js"


// Login variables
const email = document.querySelector('#email')
const password = document.querySelector('#password')
const buttonLogin = document.querySelector('#buttonLogin')


// Login function
buttonLogin.addEventListener("click", async() => {
    if(!email.value || !password.value) {
        return alert('Preencha todos os campos')
    }

    const result = await postLogin(email.value, password.value)

    if(result["status_code"] == 200) {
        const userId = result["_id"]
        sessionStorage.setItem("id", userId)
        window.location.href = "/frontend/index.html"
    }
})


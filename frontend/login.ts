export class  LoginForm {
    form: HTMLFormElement
    emailField: HTMLInputElement
    passwordField: HTMLInputElement
    requestUrl: string
    constructor() {
        this.requestUrl = "http://localhost:4000/user/login"
        this.form = document.getElementById("login-form") as HTMLFormElement
        const inputs = this.form.getElementsByTagName("input")
        this.emailField = inputs[0]
        this.passwordField = inputs[1]
        this.handleLogin()
    }

    private validateEmail() {}

    private handleSubmit(e: SubmitEvent) {
        e.preventDefault()
        fetch(this.requestUrl,{
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
               email: this.emailField.value,
               password: this.passwordField.value
            })
        }).then(res => res.json()).then(user => window.location.replace("http://localhost:4000")).catch(e => alert(e))
    }

    private handleLogin() {
        this.form.addEventListener("submit",(ev) => this.handleSubmit(ev))
    }
} 
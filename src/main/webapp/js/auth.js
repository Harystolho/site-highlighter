import '../css/bootstrap.min.css'
import '../css/auth.css'

const EMAIL_REGEX = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

window.onload = () => {
    document.querySelector('.authContainer__header__options_login').onclick = authContainer.showSignIn;
    document.querySelector('.authContainer__header__options_signup').onclick = authContainer.showSignUp;
    document.getElementById('authContainerSignIn').onclick = authContainer.signIn;
    document.getElementById('authContainerSignUp').onclick = authContainer.signUp;
};

window.onkeyup = (event) => {
    if (event.keyCode === 13) {
        authContainer.signUp();
    }
};

let authContainer = {
    showSignIn() {
        document.getElementById('authContainer').classList.add('login');
    },
    showSignUp() {
        document.getElementById('authContainer').classList.remove('login');
    },
    signIn() {

    },
    signUp() {
        let email = document.getElementById('authContainerEmail').value;
        let confirmEmail = document.getElementById('authContainerConfirmEmail').value;
        let password = document.getElementById('authContainerPassword').value;

        authContainer.hideError();

        if (!isEmailValid(email))
            return;

        if (email.trim().toLowerCase() !== confirmEmail.trim().toLowerCase()) {
            authContainer.showError("Emails are not equal");
            return;
        }

        if (!isPasswordValid(password))
            return;


        console.log("valid");
    },
    showError(msg) {
        let error = document.getElementById('authContainerError');
        error.style.display = 'block';

        error.innerHTML = msg;
    },
    hideError() {
        document.getElementById('authContainerError').style.display = 'none';
    }
};

function isEmailValid(email) {
    if (!EMAIL_REGEX.test(email)) {
        authContainer.showError("Email is not valid");
        return false;
    }

    return true;
}


function isPasswordValid(password) {
    if (password.trim().length < 6) {
        authContainer.showError("Password must be at least 6 characters long");
        return false;
    }

    return true;
}
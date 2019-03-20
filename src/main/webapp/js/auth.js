import '../css/bootstrap.min.css'
import '../css/auth.css'

import * as axios from 'axios'

const EMAIL_REGEX = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

window.onload = () => {
    document.querySelector('.authContainer__header__options_login').onclick = authContainer.showSignIn;
    document.querySelector('.authContainer__header__options_signup').onclick = authContainer.showSignUp;
    document.getElementById('authContainerSignIn').onclick = authContainer.signIn;
    document.getElementById('authContainerSignUp').onclick = authContainer.signUp;

    authContainer.signFunction = authContainer.signIn;
};

window.onkeyup = (event) => {
    if (event.keyCode === 13) {
        authContainer.signFunction();
    }
};

let authContainer = {
        /**
         * Holds a reference to a function that handles the sign up {@link authContainer#signUp} or
         * sign in {@link authContainer#signIn} process.
         */
        signFunction: () => {
        },
        showSignIn() {
            authContainer.signFunction = authContainer.signIn;
            document.getElementById('authContainer').classList.add('login');
            authContainer.hideError();
        }
        ,
        showSignUp() {
            authContainer.signFunction = authContainer.signUp;
            document.getElementById('authContainer').classList.remove('login');
            authContainer.hideError();
        }
        ,
        signIn() {
            let email = document.getElementById('authContainerEmail').value;
            let password = document.getElementById('authContainerPassword').value;

            if (email.length <= 6 || password.length < 4) {
                authContainer.showError("Email and password can't be empty");
                return;
            }

            authContainer.hideError();

            let formData = new FormData();
            formData.append("email", email);
            formData.append("password", password);

            axios.post('/auth/signin', formData, {
                headers: {'Content-Type': 'multipart/form-data'}
            }).then((response) => {
                response = response.data;

                if (response.error === 'OK') {
                    window.location.replace('/dashboard');
                } else if (response.error === 'FAIL') {
                    if (response.data.error === 'INVALID_EMAIL_OR_PASSWORD') {
                        authContainer.showError("Email or password are invalid");
                    }
                }
            });
        }
        ,
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

            let formData = new FormData();
            formData.append("email", email);
            formData.append("password", password);

            axios.post('/auth/signup', formData, {
                headers: {'Content-Type': 'multipart/form-data'}
            }).then((response) => {
                response = response.data;

                if (response.error === 'OK') {
                    // Redirect to login page
                    window.location.replace('/auth?mode=SIGN_IN');
                }
            });
        }
        ,
        showError(msg) {
            let error = document.getElementById('authContainerError');
            error.style.display = 'block';

            error.innerHTML = msg;
        }
        ,
        hideError() {
            document.getElementById('authContainerError').style.display = 'none';
        }
    }
;

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
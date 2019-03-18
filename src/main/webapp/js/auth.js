import '../css/bootstrap.min.css'
import '../css/auth.css'

let authContainer = {
    showSignIn() {
        document.getElementById('authContainer').classList.add('login');
    },
    showSignUp() {
        document.getElementById('authContainer').classList.remove('login');
    }
};

window.onload = () => {
    document.querySelector('.authContainer__header__options_login').onclick = authContainer.showSignIn;
    document.querySelector('.authContainer__header__options_signup').onclick = authContainer.showSignUp;
};


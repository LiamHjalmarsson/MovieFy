const Login = () => {
    let login = document.createElement('div');
    login.classList.add('auth-login');
    login.classList.add('auth');

    login.innerHTML = `
        <form id="loginForm" class="auth-form">
            <input type="text" placeholder="Username" name="username" class="auth-form__input" />
            <input type="password" placeholder="Password" name="pwd" class="auth-form__input" />
            <p class="auth-form__p">
                Don't have a account <span> sign up! </span>
            </p>
            <button type="submit" class="button button--sub auth-form__button">
                Login
            </button>
        </form>
    `;
    
    return login;
};

export default Login;

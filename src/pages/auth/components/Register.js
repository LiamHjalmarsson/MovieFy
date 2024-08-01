const Register = () => {
    let register = document.createElement('div');
    register.classList.add('auth-register');
    register.classList.add('auth');

    register.innerHTML = `
        <form id="registerForm" class="auth-form">
            <input type="text" placeholder="Username" name="username" class="auth-form__input" />
            <input type="email" placeholder="Email" name="email" class="auth-form__input" />
            <input type="password" placeholder="Password" name="pwd" class="auth-form__input" />
            <p class="auth-form__p">
                Already have a account <span class="auth-form__span"> Log in! </span>
            </p>
            <button type="submit" class="button button--sub auth-form__button">
                Register
            </button>
        </form>
    `;

    
    return register;
};

export default Register;

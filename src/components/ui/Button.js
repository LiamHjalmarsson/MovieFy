const Button = (text, primaryClass = true) => {
    let button = document.createElement('button');
    button.classList.add('button', primaryClass ? "button--primary" : "button--sub");

    button.innerHTML = `
        ${text}
    `;

    return button;
}

export default Button;

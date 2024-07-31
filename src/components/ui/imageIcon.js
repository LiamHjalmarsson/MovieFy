const ImageIcon = (path, name) => {
    let imageIcon = document.createElement("div");
    imageIcon.classList.add("member");

    imageIcon.innerHTML = `
        <img src="${path}" alt="${name}" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover; margin-bottom: 0.5rem;" />
        <p>
            ${name}
        </p>
    `;

    return imageIcon;
}

export default ImageIcon;

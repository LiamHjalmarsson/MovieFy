const Icon = (iconPath) => {
    let icon = document.createElement("img");
    icon.src = iconPath;

    icon.classList.add("icon");

    return icon;
};

export default Icon;
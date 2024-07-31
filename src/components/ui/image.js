const Image = (path, altTitle, loadingIcon = false) => {
    let image = document.createElement('img');

    image.src = path;
    image.alt = altTitle;
    image.style.display = 'none';

    image.onload = () => {
        if (loadingIcon) {
            loadingIcon.style.display = 'none';
        }
        
        image.style.display = 'block';
    };

    return image;
}

export default Image;

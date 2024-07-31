const Loading = () => {
    let app = document.getElementById('app');
    app.innerHTML = "";

    let loading = document.createElement('div');
    loading.classList.add('loading');

    let text = "MovieFy".split("").map((letter, index) => 
        `<span style="animation-delay: ${index * 0.1}s">${letter}</span>`
    ).join("");

    loading.innerHTML = text;
    
    app.appendChild(loading);

    return loading;
}

export const LoadingImage = () => {
    let loadingIcon = document.createElement('div');
    loadingIcon.classList.add('loadingIcon');

    return loadingIcon;
}

export default Loading;
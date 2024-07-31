const Trailer = (movie) => {
    let trailer = document.createElement('div');
    trailer.classList.add("trailer");

    let youtubeURL = `https://www.youtube.com/embed/${movie}?autoplay=1`;

    trailer.innerHTML = `
        <iframe
            src=${youtubeURL}
            allowFullScreen
            muted
            class="trailer"
        ></iframe>
    `;

    return trailer;
}

export default Trailer;
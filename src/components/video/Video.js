const Video = () => {
    let video = document.createElement('div');
    video.classList.add("video__container");

    video.innerHTML = `
        <video class="video__container-video" src="/src/assets/video.mp4" id="myVideo" loop autoplay muted></video>
    `;

    return video;
}

export default Video;

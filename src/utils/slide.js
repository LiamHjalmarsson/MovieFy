export const slide = (element, direction) => {
    let scrollAmount = 250;
    if (direction === 'left') {
        element.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
        element.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
}

export const initializeSlider = (slider) => {
    let index = 0;
    let banners = slider.children;
    let totalBanners = banners.length;

    let nextBanner = () => {
        index++;
        slider.style.transition = `transform 1000ms ease-in-out`;
        slider.style.transform = `translateX(-${index * 100}vw)`;

        setTimeout(() => {
            if (index === totalBanners - 1) {
                slider.style.transition = 'none';
                slider.style.transform = `translateX(0)`;
                index = 0;
            }
        }, 1000); 
    }

    setInterval(nextBanner, 3000);
}

export const updateIcon = (element, iconPath) => {
    element.querySelector('img').src = iconPath;
};
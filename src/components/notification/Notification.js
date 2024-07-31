const showNotification = (message, time = 2000) => {   
    if (document.querySelector(".notification")) {
        document.querySelector(".notification").remove();
    }

    let notification = document.createElement("div");
    notification.classList.add("notification");

    if (message.error) {
        Object.entries(message.error).forEach(element => {
            let msg = document.createElement("div");
            msg.textContent = element[1];
            
            notification.appendChild(msg);
        });

        notification.classList.add("notification-errorMessage");
    } else {
        let msg = document.createElement("div");
        msg.textContent = message.success;
        notification.classList.add("notification-successMessage");

        notification.appendChild(msg);
    }

    document.body.appendChild(notification);

    if (time) { 
        setTimeout(() => {
            notification.classList.add("hidden");
            notification.addEventListener("transitionend", () => {
                notification.remove();
            });
        }, time); 
    } 
};

export default showNotification;
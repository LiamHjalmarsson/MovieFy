import Header from "../../components/layouts/header/Header.js";
import showNotification from "../../components/notification/Notification.js";
import Video from "../../components/video/Video.js";
import { setUser } from "../../state/userState.js";
import Login from "./components/Login.js";
import Register from "./components/Register.js";

const AuthPage = () => {
    let app = document.getElementById('app');
    let auth = document.createElement('div');

    document.body.style.overflow = "hidden";

    let video = Video();
    app.appendChild(video);

    let login = Login();
    let register = Register();

    auth.append(login, register);

    app.appendChild(auth);

    registerHandler();
    loginHandler();

    document.querySelector(".auth-login p").addEventListener("click", () => {
        document.querySelector('.auth-register').scrollIntoView({ behavior: 'smooth' });

        if (document.querySelector(".notification")) {
            document.querySelector(".notification").remove();
        }

    });

    document.querySelector(".auth-register p").addEventListener("click", () => {
        document.querySelector('.auth-login').scrollIntoView({ behavior: 'smooth' });

        if (document.querySelector(".notification")) {
            document.querySelector(".notification").remove();
        }

    });
}

const loginHandler = () => {
    document.getElementById("loginForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        let formData = new FormData(e.target);

        let data = {
            username: formData.get('username'),
            pwd: formData.get('pwd')
        };

        let response = await fetch("routes/authRoute.php?action=login", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        let recourse = await response.json();

        handleResponse(response, recourse);

        if (response.ok) {
            document.body.style.overflow = "";

            setUser(recourse.user, recourse.token);
            let { default: Home } = await import('../home/HomePage.js');

            Header();
            await Home();
        } else {
            document.querySelectorAll("#loginForm > input").forEach(input => {
                input.id = ("error");
            });
        }

    });
}

const registerHandler = () => {
    document.getElementById("registerForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        let formData = new FormData(e.target);
        let data = {
            username: formData.get('username'),
            email: formData.get('email'),
            pwd: formData.get('pwd')
        };

        let response = await fetch("routes/authRoute.php?action=register", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        let recourse = await response.json();

        handleResponse(response, recourse);

        if (response.ok) {
            document.querySelector('.auth-login').scrollIntoView({ behavior: 'smooth' });
            showNotification(recourse);
        }
    });
}

const handleResponse = (response, recourse) => {
    if (!response.ok || recourse.error) {
        document.querySelectorAll("#registerForm > input").forEach(input => {
            input.id = ("error");
        });
        showNotification(recourse, false);
    } else {
        showNotification(recourse);
    }
}

export default AuthPage;
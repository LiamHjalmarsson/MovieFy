import Profile from "../profile/Profile.js";

const UsersPage = async () => {
    let response = await fetch(`routes/userRoute.php?action=getAll`);
    let recourse = await response.json();

    let app = document.getElementById('app');
    app.innerHTML = "";

    let page = document.createElement('div');
    page.classList.add("users");
    app.appendChild(page);
    
    let container = document.createElement('div');
    container.className = "users__container";
    page.appendChild(container);

    recourse.forEach(data => {
        let user = document.createElement('div');
        user.classList.add("users__user");

        user.innerHTML = `
            <div>
                <img class="users__avatar" src=${data.avatar || "../../../src/assets/default/deafultuser.png"} alt="${data.username}'s avatar" />
                <p class="users__name">
                    ${data.username}
                </p>
            </div>
        `;

        user.addEventListener("click", async () => {
            await Profile(data.id);
        });

        container.appendChild(user);
    });
}

export default UsersPage;

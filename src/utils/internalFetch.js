import showNotification from "../components/notification/Notification.js";

const fetchDataInternal = async (path) => {
    try {
        let response = await fetch(`routes/${path}`);

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        showNotification(error);
    }
};

export const fetchUserMovieStatus = async (id) => {
    let recourse = await fetchDataInternal(`moviesRoute.php?action=getMovieStatus&movie_id=${id}`);
    return recourse;
}

export const fetchReview = async (id) => {
    let recourse = await fetchDataInternal(`reviewRoute.php?action=getUserReview&movie_id=${id}`);

    return recourse;
}

export const fetchMovieReviews = async (id) => {
    let recourse = await fetchDataInternal(`reviewRoute.php?action=getMovieReviews&movie_id=${id}`);

    return recourse;
}

export const fetchFollowing = async () => {
    return await fetchDataInternal(`followsRoute.php?action=userFollowing`);
}

export const fetchUsers = async () => {
    return await fetchDataInternal(`userRoute.php?action=getAll`);
}

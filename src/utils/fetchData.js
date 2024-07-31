let urlPath = `https://api.themoviedb.org/3/movie/`;
let api = `?api_key=61abd3b74d3f82c9dd4f0647ff31fb34`;

export const fetchData = async (endpoint) => {
    try {
        let response = await fetch(`${urlPath}${endpoint}${api}`);

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
    }
};

export const fetchMovies = async (path) => {
    let { results } = await fetchData(path);

    return results;
}

export const fetchMovie = async (id) => {
    let results = await fetchData(id);

    return results;
}

export const fetchVideo = async (id) => {
    let { results } = await fetchData(id + "/videos");

    let trailer = results.find(video => video.type === "Trailer");

    if (!trailer) {
        return false;
    }

    if (trailer) {
        return trailer;
    } else {
        return recourse.results[0];
    }
}

export const fetchMoviePoster = async (id) => {
    let recourse = await fetchData(id + "/images");

    return recourse.backdrops[0].file_path;
}

export const fetchMoviePosters = async (id) => {
    let recourse = await fetchData(id + "/images");
    
    return recourse.backdrops;
}

export const fetchMovieCredits = async (id) => {
    let { cast } = await fetchData(id + "/credits");

    return cast;
}

export const fetchProviders = async (id) => {
    let { results } = await fetchData(id + "/watch/providers");

    return results["US"];
}

export const fetchSimilar = async (id) => {
    let { results } = await fetchData(id + "/similar");

    return results;
}

export const fetchMovieStatus = async (id) => {
    let response = await fetch(`/routes/moviesRoute.php?action=getMovieStatus&movie_id=${id}`);

    if (response.ok) {
        let data = await response.json();
        return data.status;
    } else {
        return null;
    }
}

export const fetchReview = async (id) => {
    let response = await fetch(`routes/reviewRoute.php?action=getUserReview&movie_id=${id}`);

    if (response.ok) {
        let data = await response.json();

        console.log(data);
        return data.status;
    } else {
        return null;
    }
}
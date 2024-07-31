const fetchData = async (path) => {
    try {
        let response = await fetch(`https://api.themoviedb.org/3/${path}?api_key=61abd3b74d3f82c9dd4f0647ff31fb34`);

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
    }
};

export const fetchExternalMovies = async (id) => {
    let recourse = await fetchData(`movie/${id}`);
    return recourse.results;
};

export const fetchExternalMovie = async (id) => {
    let results = await fetchData(`movie/${id}`);
    return results;
}

export const fetchExternalMoviePoster = async (id) => {
    let recourse = await fetchData("movie/" + id + "/images");

    return recourse.backdrops;
}

export const fetchExternalMovieVideo = async (id) => {
    let { results } = await fetchData("movie/" + id + "/videos");

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

export const fetchExternalMovieCredits = async (id) => {
    let { cast } = await fetchData("movie/" + id + "/credits");
    return cast;
}

export const fetchExternalProviders = async (id) => {
    let { results } = await fetchData("movie/" + id + "/watch/providers");
    return results["US"];
}

export const fetchExternalSimilarMovies = async (id) => {
    let { results } = await fetchData("movie/" + id + "/similar");
    return results;
}
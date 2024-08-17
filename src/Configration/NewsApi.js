const fetchCricbuzzData = async () => {
    const url = 'https://cricbuzz-cricket.p.rapidapi.com/news/v1/index';
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '0d495dae1emshb22946f1284feaap176e4ajsn0f05a28b1f97',
            'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        return result;
    } catch (error) {
        throw new Error('Failed to fetch data');
    }
};

export default fetchCricbuzzData;

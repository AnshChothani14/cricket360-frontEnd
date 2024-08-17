import React, { useState } from 'react';

const RecentMatches = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        const url = 'https://cricbuzz-cricket.p.rapidapi.com/news/v1/index';
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': '0d495dae1emshb22946f1284feaap176e4ajsn0f05a28b1f97',
                'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com'
            }
        };

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            setData(result);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };
    console.log()

    return (
        <div>
            <button onClick={fetchData}>Get Data</button>
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error.message}</div>}
            {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
        </div>
    );
};

export default RecentMatches;

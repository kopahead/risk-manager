const axios = require('axios');

exports.handler = async function(event) {
    const { token } = JSON.parse(event.body);

    try {
        const response = await axios.post('https://api.notion.com/v1/databases/1cfbe24c0c90801d80a3e3f220e4f50c/query', {}, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Notion-Version': '2022-06-28'
            }
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ results: response.results })
        };
    } catch (error) {
        debugger
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message })
        };
    }
};

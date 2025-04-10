const axios = require('axios');

exports.handler = async function(event) {
    const { token, start_cursor, page_size } = JSON.parse(event.body);

    const payload = {};

    if (start_cursor) {
        payload.start_cursor = start_cursor;
    }

    if (page_size) {
        payload.page_size = page_size;
    }

    try {
        const response = await axios.post('https://api.notion.com/v1/databases/1cfbe24c0c90801d80a3e3f220e4f50c/query', payload, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Notion-Version': '2022-06-28'
            }
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ results: response.data })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message })
        };
    }
};

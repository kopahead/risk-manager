const { Client } = require('@notionhq/client');

exports.handler = async function(event) {
    const { token } = JSON.parse(event.body);
    const notion = new Client({ auth: token });

    try {
        const response = await notion.databases.query({
            database_id: '1cfbe24c0c90801d80a3e3f220e4f50c'
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ results: response.results })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message })
        };
    }
};

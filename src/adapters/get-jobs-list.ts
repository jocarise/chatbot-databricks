const PATH = '/api/2.1/jobs/list';
const HOST = process.env.DATABRICKS_HOST;
const TOKEN = process.env.DATABRICKS_ACCESS_TOKEN;

export const getJobList = async () => {
  try {
    const response = await fetch(
      `${HOST}${PATH}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );
    return await response.json();
  } catch (err) {
    console.error('Error getting response');
  }
};
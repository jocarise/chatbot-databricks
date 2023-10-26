const PATH = '/api/2.0/jobs/runs/get-output';
const HOST = process.env.DATABRICKS_HOST;
const TOKEN = process.env.DATABRICKS_ACCESS_TOKEN;

export const getJobOutput = async (id: string) => {
  try {
    const response = await fetch(
      `${HOST}${PATH}?run_id=${id}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
        
      }
    );
    const res = await response.json();

    //@ts-ignore
    return res;
  } catch (err) {
    console.error('Error getting response');
  }
};
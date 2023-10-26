const PATH = '/api/2.1/jobs/run-now';
const HOST = process.env.DATABRICKS_HOST;
const TOKEN = process.env.DATABRICKS_ACCESS_TOKEN;
const JOB_ID = '366785471178878';

export const postJob = async (query: string) => {
  try {
    const response = await fetch(
      `${HOST}${PATH}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify({ "job_id": JOB_ID, "notebook_params": { query } })
      }
    );
    const res = await response.json();

    //@ts-ignore
    return res;
  } catch (err) {
    console.error('Error getting response');
  }
};
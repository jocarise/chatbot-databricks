// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getJobOutput } from '@/adapters/get-job-output';
import { postJob } from '@/adapters/post-job';
import type { NextApiRequest, NextApiResponse } from 'next';

enum JOBS_STATUS {
  FINISHED = 'TERMINATED',
  PENDING = 'PENDING',
  SKIPPED = 'SKIPPED'
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }

  async function getJobStatusPoll(run_id:string) {
    const jobStatus = await getJobOutput(run_id);

    if (jobStatus?.metadata?.state?.life_cycle_state === JOBS_STATUS.FINISHED) {
      return res.status(200).json({ ...jobStatus })
    } else {
      setTimeout(() => {
        getJobStatusPoll(run_id);
      }, 3000);
    }
  } 

  const body = JSON.parse(req.body);
  const response = await postJob(body.query);
  await getJobStatusPoll(response.run_id);
}



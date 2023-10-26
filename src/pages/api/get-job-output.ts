// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getJobList } from '@/adapters/get-jobs-list'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const response = await getJobList();

  res.status(200).json(response)
}

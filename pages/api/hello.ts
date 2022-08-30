// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import MONGO_DB from 'config/db.config';
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await MONGO_DB.connect(res);

  await MONGO_DB.disconnect();

  res.status(200).json({ name: 'John Doe' });
}

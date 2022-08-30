/* eslint-disable class-methods-use-this */

import mongoose from 'mongoose';
import { NextApiResponse } from 'next';

export const ServerError = ({
  message,
  status,
}: {
  message: string;
  status: number;
}) => console.log(`${message} & Status ${status}`);

export const Error = ({
  message,
  status,
  res,
}: {
  message: string;
  status: number;
  res: NextApiResponse;
}) => res.status(status).json({ message, status });

class DB {
  async connect(res: NextApiResponse) {
    if (!process.env.DB_URL)
      return Error({ message: 'process.env.DB_URL missing', status: 500, res });

    return mongoose
      .connect(process.env.DB_URL)
      .then(() => console.log('Connected to DB'));
  }

  async disconnect() {
    return mongoose.disconnect().then(() => console.log('Disconnected !!'));
  }
}

export default new DB();

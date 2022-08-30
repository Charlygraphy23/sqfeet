/* eslint-disable class-methods-use-this */

import mongoose from 'mongoose';
import { NextApiResponse } from 'next';

export const ServerClientError = ({
  message,
  status,
}: {
  message: string;
  status: number;
}) => console.error(`${message} & Status ${status}`);

export const ClientError = ({
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
      return ClientError({
        message: 'process.env.DB_URL missing',
        status: 500,
        res,
      });

    return mongoose
      .connect(process.env.DB_URL)
      .then(() => console.log('Connected to DB'));
  }

  async disconnect() {
    return mongoose.disconnect().then(() => console.log('Disconnected !!'));
  }
}

export default new DB();

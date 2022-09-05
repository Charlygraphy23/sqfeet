/* eslint-disable class-methods-use-this */

import mongoose from 'mongoose';
import { NextApiResponse } from 'next';

export const ServerError = ({
  message,
  status,
}: {
  message: string;
  status: number;
}) => {
  const error = `${message} & Status ${status}`;
  console.error(error);
  return Promise.reject(error);
};

export const ClientError = ({
  message = 'Error',
  status = 400,
  res,
}: {
  message: string;
  status: number;
  res: NextApiResponse;
}) => res.status(status).json({ message, status });

export const Response = <T>({
  message = 'Success',
  status = true,
  res,
  data,
}: {
  message: string;
  status?: boolean;
  res: NextApiResponse;
  data?: T;
}) => res.status(200).json({ message, status, data });

export const AppResponse = <T>({
  status = 'SUCCESS',
  data,
  error = null,
  code = 500,
}: {
  status: 'ERROR' | 'SUCCESS';
  error: any;
  data: T;
  code: number;
}) => ({
  data,
  status,
  error,
  code,
});
class DB {
  async connect(res?: NextApiResponse) {
    if (!process.env.DB_URL) {
      if (res)
        return ClientError({
          message: 'process.env.DB_URL missing',
          status: 500,
          res,
        });
      return ServerError({
        message: 'process.env.DB_URL missing',
        status: 500,
      });
    }

    return mongoose
      .connect(process.env.DB_URL)
      .then(() => console.log('Connected to DB'));
  }

  async disconnect() {
    console.log('[DB] status', mongoose.connection.readyState);
    if (![0, 3, 99].includes(mongoose.connection.readyState))
      return mongoose.disconnect().then(() => console.log('Disconnected !!'));
  }
}

export default new DB();

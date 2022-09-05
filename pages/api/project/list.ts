/* eslint-disable no-throw-literal */
import { ClientError, Response, ServerError } from 'config/db.config';
import { getAllProjectsByUser } from 'database/helper';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== 'GET')
    return ClientError({
      message: `${req.method} not supported!!`,
      status: 400,
      res,
    });

  try {
    const response = await getAllProjectsByUser({ req });

    if (response.status === 'SUCCESS') {
      return Response<any[]>({
        message: 'Success',
        data: response.data,
        res,
      });
    }

    throw {
      message: response.error?.message,
      status: response.code,
      error: response.error,
    };
  } catch (err: any) {
    ServerError({ message: err?.message, status: err?.status });
    return ClientError({
      message: err?.message,
      status: err?.status,
      res,
    });
  }
};

export default handler;

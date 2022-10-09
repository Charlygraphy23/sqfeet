/* eslint-disable no-throw-literal */
import DB, { ClientError, Response, ServerError } from 'config/db.config';
import { BatchModel } from 'database';
import mongoose from 'mongoose';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== 'POST')
    return ClientError({
      message: `${req.method} not supported!!`,
      status: 400,
      res,
    });

  try {
    const { projectId } = req.body;

    // check sign in
    const session = await getSession({ req }).catch((err) => {
      throw err;
    });

    if (!session) throw { message: 'Un-Authorized', status: 401 };

    if (!projectId) throw { message: 'Please provide project id', status: 422 };

    await DB.connect(res).catch((err) => {
      throw err;
    });

    const batchDates = await BatchModel.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              { $eq: ['$projectId', new mongoose.Types.ObjectId(projectId)] },
            ],
          },
        },
      },
      {
        $addFields: {
          dateInMilis: {
            $toDate: { $toLong: { $multiply: ['$date', 1000] } },
          },
        },
      },

      {
        $project: {
          date: {
            $dateToString: {
              date: '$dateInMilis',
              timezone: '+0530',
              format: '%Y-%m-%d',
            },
          },
          _id: '$_id',
          projectId: '$projectId',
        },
      },
    ]).catch((err) => {
      throw err;
    });

    await DB.disconnect().catch((err) => {
      throw err;
    });

    return Response({
      message: 'Success',
      res,
      data: batchDates ?? [],
    });
  } catch (err: any) {
    await DB.disconnect();
    ServerError({ message: err?.message, status: err?.status });
    return ClientError({
      message: err?.message,
      status: err?.status,
      res,
    });
  }
};

export default handler;

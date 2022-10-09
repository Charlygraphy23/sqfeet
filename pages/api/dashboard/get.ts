/* eslint-disable no-throw-literal */
import DB, { ClientError, Response, ServerError } from 'config/db.config';
import { ProjectModel, UserModel } from 'database';
import { serializedGraphDataForTask } from 'database/helper';
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
    const { startTime, endTime } = req.body;

    // check sign in
    const session = await getSession({ req }).catch((err) => {
      throw err;
    });

    if (!session) throw { message: 'Un-Authorized', status: 401 };
    const { user } = session;

    if (!startTime || !endTime)
      throw { status: 422, message: 'please provide all details' };

    await DB.connect(res).catch((err) => {
      throw err;
    });

    // @ts-expect-error
    const userFound = await UserModel._findByGoogleId(user?.userId).catch(
      (err: any) => {
        throw err;
      }
    );

    if (!userFound) throw { status: 400, message: 'User not found' };

    const projectData = await ProjectModel.aggregate([
      {
        $match: { $expr: { $eq: ['$createdBy', userFound._id] } },
      },

      {
        $lookup: {
          from: 'batches',
          let: { projectId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $gt: ['$date', startTime] },
                    { $lte: ['$date', endTime] },
                    { $eq: ['$projectId', '$$projectId'] },
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
              $lookup: {
                from: 'tasks',
                let: { batchId: '$_id' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$batchId', '$$batchId'],
                      },
                    },
                  },

                  {
                    $group: {
                      _id: null,

                      count: { $sum: 1 },
                    },
                  },
                ],
                as: 'tasks',
              },
            },

            {
              $unwind: {
                path: '$tasks',
                preserveNullAndEmptyArrays: true,
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
                rateOfSquareFt: '$rateOfSquareFt',
                totalPrice: '$totalPrice',
                totalSquareFt: '$totalSquareFt',
                projectId: '$projectId',
                batchId: '$_id',
                taskCount: { $sum: '$tasks.count' },
              },
            },

            {
              $group: {
                _id: '$date',
                data: {
                  $first: {
                    rateOfSquareFt: '$rateOfSquareFt',
                    totalPrice: '$totalPrice',
                    totalSquareFt: '$totalSquareFt',
                    projectId: '$projectId',
                    date: '$date',
                    batchId: '$batchId',
                  },
                },
                taskCount: { $first: '$taskCount' },
              },
            },
          ],
          as: 'batches',
        },
      },

      {
        $unwind: {
          path: '$batches',
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $group: {
          _id: '$_id',
          count: { $sum: '$batches.taskCount' },
          batches: { $push: '$batches' },
          name: { $first: '$name' },
          createdBy: { $first: '$createdBy' },
        },
      },
    ]);

    await DB.disconnect().catch((err) => {
      throw err;
    });

    const updatedGraphData = serializedGraphDataForTask(projectData);

    return Response({
      message: 'Success',
      res,
      data: updatedGraphData ?? {},
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

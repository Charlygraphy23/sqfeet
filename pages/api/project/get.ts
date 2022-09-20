/* eslint-disable no-throw-literal */
import DB, { ClientError, Response, ServerError } from 'config/db.config';
import { ProjectModel, UserModel } from 'database';
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
    const session = await getSession({ req });

    if (!session) throw { message: 'Un-Authorized', status: 401 };
    const { user } = session;

    if (!projectId) throw { message: 'Please provide project id', status: 422 };

    await DB.connect(res);

    // @ts-expect-error
    const userFound = await UserModel._findByGoogleId(user?.userId);

    if (!userFound)
      throw {
        message: 'User Not found!!',
        status: 400,
      };

    const projectData = await ProjectModel.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              { $eq: ['$_id', new mongoose.Types.ObjectId(projectId)] },
              { $eq: ['$createdBy', userFound?._id] },
            ],
          },
        },
      },

      {
        $lookup: {
          from: 'batches',
          let: { projectId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ['$projectId', '$$projectId'] }],
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
                        $and: [{ $eq: ['$batchId', '$$batchId'] }],
                      },
                    },
                  },
                ],
                as: 'tasks',
              },
            },
          ],
          as: 'batches',
        },
      },
    ]).catch((err) => {
      throw err;
    });

    await DB.disconnect();

    return Response({
      message: 'Success',
      res,
      data: projectData?.[0] ?? [],
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

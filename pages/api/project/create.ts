/* eslint-disable no-throw-literal */
import DB, { ClientError, ServerError } from 'config/db.config';
import { ProjectModel, UserModel } from 'database';
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
    const { name } = req.body;

    // check sign in
    const session = await getSession({ req });

    if (!session) throw { message: 'Un-Authorized', status: 401 };
    const { user } = session;

    if (!name) throw { message: 'Please provide project name', status: 422 };

    await DB.connect(res);

    // @ts-expect-error
    const userFound = await UserModel._findByGoogleId(user?.userId);

    if (!userFound)
      throw {
        message: 'User Not found!!',
        status: 400,
      };

    // @ts-expect-error
    const projectFound = await ProjectModel._findByName(name, userFound?._id);

    if (projectFound) throw { message: 'Project Exist', status: 400 };

    console.log('Id', userFound?._id.toString());

    await ProjectModel.create({
      name,
      createdBy: userFound?._id,
    });

    await DB.disconnect();

    return res.status(201).json({
      message: 'Success',
      status: true,
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

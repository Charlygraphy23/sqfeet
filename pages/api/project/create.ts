/* eslint-disable no-throw-literal */
import DB, { ClientError, ServerError } from 'config/db.config';
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
    // check sign in
    const session = await getSession({ req });

    if (!session) throw { message: 'Un-Authorized', status: 401 };

    // const {} = session.user.;

    await DB.connect(res);

    // TODO check project by name

    const { name } = req.body;

    if (!name) throw { message: 'Please provide project name', status: 422 };

    // TODO create a new project

    await DB.disconnect();
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

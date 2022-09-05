import DB, { AppResponse } from 'config/db.config';
import { ProjectModel, UserModel } from 'database/model';
import { NextApiRequest } from 'next';
import { CtxOrReq } from 'next-auth/client/_utils';
import { getSession } from 'next-auth/react';

type GetAllProjectsByUser = {
  req: NextApiRequest | CtxOrReq['req'];
};

export const getAllProjectsByUser = async ({ req }: GetAllProjectsByUser) => {
  try {
    // check sign in
    const session = await getSession({ req });

    if (!session) throw { message: 'Un-Authorized', status: 401 };
    const { user } = session;

    await DB.connect().catch((err: any) => {
      throw { message: err?.message, status: 500, err };
    });
    // @ts-expect-error
    const userFound = await UserModel._findByGoogleId(user?.userId);

    if (!userFound)
      throw {
        message: 'User Not found!!',
        status: 400,
      };

    // @ts-expect-error
    const projectFound = (await ProjectModel._findByUser(userFound?._id)) ?? [];

    await DB.disconnect();

    return AppResponse<typeof projectFound>({
      status: 'SUCCESS',
      data: projectFound,
      error: null,
      code: 200,
    });
  } catch (err: any) {
    await DB.disconnect();
    return AppResponse({
      status: 'ERROR',
      data: null,
      error: err?.message,
      code: err?.status ?? 500,
    });
  }
};

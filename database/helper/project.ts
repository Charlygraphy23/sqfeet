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

export const getTotalNumberOfTasks = (data: any): number =>
  Object.values(data).reduce(
    (prevState: number, currentState: any) =>
      // @ts-ignore
      // eslint-disable-next-line no-unsafe-optional-chaining
      prevState + currentState?.count ?? 0,
    0
  );

export const serializedGraphDataForTask = (data: any[]) => {
  const tempProjectData: {
    [k: string]: any;
  } = {}; // ? for re-formatting graph data

  data.forEach((_data: any) => {
    const batches = _data?.batches ?? [];

    batches.forEach((batch: any) => {
      if (batch?._id && tempProjectData[batch?._id]) {
        const prevData = tempProjectData[batch?._id] ?? {};

        tempProjectData[batch?._id] = {
          ...prevData,

          // eslint-disable-next-line no-unsafe-optional-chaining
          count: prevData?.count ?? 0 + batch?.taskCount ?? 0,
        };
      } else {
        tempProjectData[batch?._id] = {
          count: batch?.taskCount ?? 0,
          _id: batch?._id,
        };
      }
    });
  });

  const getTotalCountOfTasks = getTotalNumberOfTasks(tempProjectData);

  Object.defineProperties(tempProjectData, {
    length: {
      value: getTotalCountOfTasks || 0,
    },
  });

  return tempProjectData;
};

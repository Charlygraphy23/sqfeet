/* eslint-disable prettier/prettier */
/* eslint-disable no-throw-literal */
import DB, { ClientError, Response, ServerError } from 'config/db.config';
import { UserModel } from 'database';
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

        await DB.disconnect();

        return Response<any[]>({
            message: 'Success',
            data: userFound,
            res,
        });
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

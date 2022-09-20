/* eslint-disable prettier/prettier */
/* eslint-disable no-throw-literal */
import {
  calculateArea,
  calculateProjectTotal,
  calculateTotal
} from 'config/app.config';
import DB, { ClientError, Response, ServerError } from 'config/db.config';
import { BatchModel, TaskModel, UserModel } from 'database';
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

  const { ratePerSqaureFt, batchId, taskList, deletedTaskIds } = req.body;

  await DB.connect(res);
  const mongoSession = await mongoose.startSession();



  await mongoSession.withTransaction(async () => {

    if (!batchId || !ratePerSqaureFt)
      throw { message: 'Please provide batchId and square feet', status: 422 };

    if (!taskList.every((val: any) => val?._id && val?.title && val?.type && val?.batchId))
      throw { message: 'Please fill all required fields', status: 422 };

    // check sign in
    const session = await getSession({ req });

    if (!session) throw { message: 'Un-Authorized', status: 401 };
    const { user } = session;




    const [userFound, batchFound] = await Promise.all([
      // @ts-expect-error
      UserModel._findByGoogleId(user?.userId),
      BatchModel.findById(
        new mongoose.Types.ObjectId(batchId)
      )
    ]);

    if (!userFound)
      throw {
        message: 'User Not found!!',
        status: 400,
      };


    if (!batchFound) throw { message: 'Batch Not Found', status: 400 };

    // calculating price & sqfeet for each task

    const updatedTaskList = taskList.map((val: any) => {
      const area = calculateArea(val);
      const total = calculateTotal({
        area: +area,
        perSquareFtRate: ratePerSqaureFt,
      });

      return {
        ...val,
        total,
        sq: area,
        createdby: userFound?._id,
      };
    });

    const { price = 0, sqft = 0 } = calculateProjectTotal(updatedTaskList);



    if (deletedTaskIds?.length) {
      // ? First delete all tasks
      const convertedIds: any[] = deletedTaskIds.map((id: string) => new mongoose.Types.ObjectId(id));
      await TaskModel.deleteMany({ _id: { $in: convertedIds } }, { session: mongoSession });
    }


    await Promise.all(taskList.map(async (task: any) => TaskModel.findByIdAndUpdate({ _id: task?._id }, { ...task }, { session: mongoSession })));

    await BatchModel.findByIdAndUpdate(
      { _id: batchFound?._id },
      {
        totalPrice: price,
        totalSquareFt: sqft,
        rateOfSquareFt: ratePerSqaureFt,
      },
      { session: mongoSession }
    );

    await mongoSession.commitTransaction();
    mongoSession.endSession();

    await DB.disconnect();
    return Response({
      message: 'Success',
      res,
    });



  }).catch(async err => {
    mongoSession.endSession();
    await DB.disconnect();
    ServerError({ message: err?.message, status: err?.status });
    return ClientError({
      message: err?.message,
      status: err?.status,
      res,
    });
  });

};

export default handler;

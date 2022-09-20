/* eslint-disable prettier/prettier */
/* eslint-disable no-throw-literal */
import {
  calculateArea,
  calculateProjectTotal,
  calculateTotal
} from 'config/app.config';
import DB, { ClientError, Response, ServerError } from 'config/db.config';
import { BatchModel, ProjectModel, TaskModel, UserModel } from 'database';
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



  await DB.connect(res);


  const mongoSession = await mongoose.startSession();
  await mongoSession.withTransaction(async () => {
    const { date, ratePerSqaureFt, projectId, taskList } = req.body;


    if (!date || !ratePerSqaureFt)
      throw { message: 'Please provide date and square feet', status: 422 };

    if (!taskList.every((val: any) => val.title && val.type && projectId))
      throw { message: 'Please fill all required fields', status: 422 };

    // check sign in
    const session = await getSession({ req });

    if (!session) throw { message: 'Un-Authorized', status: 401 };
    const { user } = session;




    const [userFound, projectFound] = await Promise.all([
      // @ts-expect-error
      UserModel._findByGoogleId(user?.userId),
      // @ts-expect-error
      ProjectModel._findById(
        new mongoose.Types.ObjectId(projectId)
      )
    ]);

    if (!userFound)
      throw {
        message: 'User Not found!!',
        status: 400,
      };

    if (!projectFound) throw { message: 'Project No Found', status: 400 };

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
        projectId: projectFound?._id,
        date
      };
    });

    const { price = 0, sqft = 0 } = calculateProjectTotal(updatedTaskList);

    const [batch] = await BatchModel.create([{
      totalPrice: price,
      totalSquareFt: sqft,
      rateOfSquareFt: ratePerSqaureFt,
      date,
      projectId: projectFound?._id
    }], { session: mongoSession });

    if (!batch) throw { status: 500, message: "Can't create batch" };


    // ? Adding batchId in Each task
    const taskListWithBatch = updatedTaskList.map((task: any) => ({
      ...task,
      batchId: batch?._id
    }));


    await TaskModel.create(taskListWithBatch, { session: mongoSession });

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

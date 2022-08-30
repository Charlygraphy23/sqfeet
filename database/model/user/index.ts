import mongoose from 'mongoose';

export type TaskModelType = {
  title?: string;
  description?: string;
  width?: number;
  length?: number;
  diameter?: number;
  createdby?: mongoose.Types.ObjectId;
  projectId?: mongoose.Types.ObjectId;
};

const schema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      default: '',
    },

    lastName: {
      type: String,
      default: '',
    },

    profileImage: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const model = mongoose.model<TaskModelType>('tasks', schema);

schema.statics.findById = (_id: mongoose.Types.ObjectId) => model.findById(_id);

schema.statics.find = () => model.find();

schema.statics.taskByProjectId = (projectId: mongoose.Types.ObjectId) =>
  model.find({ projectId });

export default model;

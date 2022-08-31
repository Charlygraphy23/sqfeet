import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: '',
      trim: true,
    },

    description: {
      type: String,
      default: '',
      trim: true,
    },

    width: {
      type: Number,
      default: 0,
    },

    length: {
      type: Number,
      default: 0,
    },

    diameter: {
      type: Number,
      default: 0,
    },

    createdby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'projects',
    },
  },
  {
    timestamps: true,

    statics: {
      _findById(_id: mongoose.Types.ObjectId) {
        return this.findById(_id);
      },

      _find() {
        return this.find();
      },

      taskByProjectId(projectId: mongoose.Types.ObjectId) {
        return this.findOne({ projectId });
      },
    },
  }
);

schema.index({ projectId: 1, createdby: 1 });

export type TaskModelType = typeof schema;

const model =
  mongoose.models.tasks ?? mongoose.model<TaskModelType>('tasks', schema);

export const TaskModel = model;

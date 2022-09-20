import { AREAS } from 'config/app.config';
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

    type: {
      type: String,
      default: AREAS.RECTANGLE,
      enum: AREAS,
    },

    width: {
      type: Number,
      default: 0,
    },

    sq: {
      type: Number,
      default: 0,
    },

    total: {
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

    date: {
      type: Number,
      default: 0,
    },

    createdby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },

    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'batches',
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

schema.index({ projectId: 1, createdby: 1, batchId: 1 });

export type TaskModelType = typeof schema;

const model =
  mongoose.models.tasks ?? mongoose.model<TaskModelType>('tasks', schema);

export const TaskModel = model;

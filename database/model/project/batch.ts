import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'projects',
    },
    rateOfSquareFt: {
      type: Number,
      default: 0,
    },

    totalPrice: {
      type: Number,
      default: 0,
    },

    totalSquareFt: {
      type: Number,
      default: 0,
    },

    date: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

schema.index({ projectId: 1 });

export type BatchModelType = typeof schema;

const model =
  mongoose.models.batches ?? mongoose.model<BatchModelType>('batches', schema);

export const BatchModel = model;

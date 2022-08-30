import mongoose from 'mongoose';

export type ProjectModelType = {
  name?: string;
  rateOfSquareFt?: number;
  totalPrice?: number;
  totalSquareFt?: number;
  createdby?: mongoose.Types.ObjectId;
};

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: '',
    },

    createdby: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
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
  },
  { timestamps: true }
);

const model = mongoose.model<ProjectModelType>('projects', schema);

schema.statics.findById = (_id: mongoose.Types.ObjectId) => model.findById(_id);

schema.statics.find = () => model.find();

export const projectModel = model;

import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: '',
      trim: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
    rateOfSquareFt: {
      type: Number,
      default: 0,
    },

    date: {
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
  {
    timestamps: true,
    statics: {
      _findById(_id: mongoose.Types.ObjectId) {
        return this.findById(_id);
      },
      _find() {
        return this.find();
      },
      _findByUser(_id: mongoose.Types.ObjectId) {
        return this.find({ createdby: _id });
      },
      _findByName(name: string, id: mongoose.Types.ObjectId) {
        return this.find(
          {
            name: { $regex: `^${name.toLowerCase()}$`, $options: 'i' },
            createdby: id,
          },
          { _v: 0 }
        );
      },
    },
  }
);

schema.index({ createdby: 1, name: 1 });

export type ProjectModelType = typeof schema;

const model =
  mongoose.models.projects ??
  mongoose.model<ProjectModelType>('projects', schema);

export const ProjectModel = model;

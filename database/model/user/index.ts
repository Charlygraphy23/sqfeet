/* eslint-disable import/prefer-default-export */
/* eslint-disable no-unused-vars */
import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      default: '',
    },

    lastName: {
      type: String,
      default: '',
      trim: true,
    },

    profileImage: {
      type: String,
      default: '',
    },
    loginType: {
      type: String,
      default: 'google',
      trim: true,
    },
    googleId: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    statics: {
      _findById(_id: mongoose.Types.ObjectId) {
        return this.findById(_id);
      },

      _find() {
        return this.find();
      },

      _findByGoogleId(_id: string) {
        return this.findOne({ googleId: _id });
      },
    },
    timestamps: true,
  }
);

schema.index({ email: 1, googleId: 1 });

type ModelType = typeof schema;

const model =
  mongoose.models?.users ?? mongoose.model<ModelType>('users', schema);

export const UserModel = model;

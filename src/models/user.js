import { model, Schema } from 'mongoose';

const usersSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    phoneNumber: {
      type: String,
      unique: true
    }
  },
  { timestamps: true }
);

export default model('user', usersSchema);

import { model, Schema } from 'mongoose';

const wordsSchema = new Schema(
  {
    word: {
      type: String,
      required: true,
      unique: true
    },
    genderwise: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected']
    }
  },
  { timestamps: true }
);

export default model('word', wordsSchema);

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
      default: 'pending',
      enum: ['pending', 'approved', 'rejected']
    },
    twitterPostId: {
      type: String,
      default: null
    },
    upvotes: {
      type: Number,
      default: 0
    },
    downvotes: {
      type: Number,
      defaut: 0
    }
  },
  { timestamps: true }
);

export default model('word', wordsSchema);

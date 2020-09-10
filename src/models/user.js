/* eslint-disable operator-linebreak */
/* eslint-disable no-underscore-dangle */
import { model, Schema } from 'mongoose';
import jwt from 'jsonwebtoken';

const usersSchema = new Schema(
  {
    facebook: String,
    google: String,
    twitter: String,
    name: String,
    email: String
  },
  { timestamps: true }
);

usersSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (document, returnedObject) => {
    delete returnedObject.facebook;
    delete returnedObject.google;
    delete returnedObject.twitter;
  }
});

usersSchema.methods = {
  generateToken: function generateToken() {
    const user = this;
    const token = jwt.sign(
      {
        exp:
          Date.now() / 100 +
          86400 * (parseFloat(process.env.JWTExpireDays || 1) || 1),
        _id: user._id
      },
      process.env.JWTSecret
    );
    return token;
  }
};

usersSchema.static = {
  findByToken: async function findByToken(token = '') {
    token = token.replace('Bearer ', '');
    const _id = jwt.verify(token, process.env.JWTSecret);
    return this.findOne({ _id });
  }
};

export default model('gender-wise-user', usersSchema);

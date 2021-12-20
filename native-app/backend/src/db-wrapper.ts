import { connect, model, Schema } from 'mongoose';

export const createMongoConnection = async () => {
  await connect(process.env.MONGODB_URI);
};

const userSchema = new Schema({
  email: String,
  name: String,
  password: String,
  token: String,
  role: Number,
});

export const UserModel = model('User', userSchema);

const getUser = async (email: string) => {
  const document = await UserModel.findOne({ email });
  if (!document) {
    return null;
  }
  return document.toObject();
};

export default {
  getUser,
};

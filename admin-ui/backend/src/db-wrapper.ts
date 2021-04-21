import { connect, model, Schema } from "mongoose";

export const createMongoConnection = async () => {
  await connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
}

interface User {
  email: String,
  name: String,
  password: String,
}

const userSchema = new Schema({
  email: String,
  name: String,
  password: String,
});

export const UserModel = model('User', userSchema);

const getUser = async (email: string) => {
  const document = await UserModel.findOne({ email });
  if (!document) {
    return null;
  }
  return document.toObject() as User;
}

export default {
  getUser
}

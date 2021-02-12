import { connect, model, Schema } from "mongoose";

export const createMongoConnection = async () => {
  await connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
}

const userSchema = new Schema({
  name: String,
  password: String,
});

export const UserModel = model('User', userSchema);

const getUser = async (name: string, password: string) => {
  const document = await UserModel.findOne({ name, password }).select({ password: 0});
  return document ? document.toObject() : null;
}

export default {
  getUser
}

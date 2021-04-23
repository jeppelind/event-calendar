import { connect, model, Schema } from "mongoose";

export const createMongoConnection = async () => {
  await connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
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
  return document.toObject();
}

const getUserById = async (id: string) => {
  const document = await UserModel.findById(id);
  return document ? document.toObject() : null;
}

const addUser = async (email: string, password: string, name?: string) => {
  const existingDoc = await UserModel.findOne({ email });
  if (existingDoc) {
    throw Error('Email already in use.');
  }
  const document = await UserModel.create({
    email,
    password,
    name: (name) ? name : '',
  });
  return document.toObject();
}

const updateUser = async (email: string, name: string) => {
  const document = await UserModel.findOneAndUpdate({ email }, {
    name
  });
  return document ? document.id : null;
}

const changePassword = async (id: string, password: string, newPassword: string) => {
  const document = await UserModel.findOneAndUpdate({ _id: id, password }, {
    password: newPassword
  }, { new: true });
  if (!document) {
    throw Error('Cant update user.');
  }
  return document.toObject();
}

export default {
  getUser,
  getUserById,
  addUser,
  updateUser,
  changePassword,
}

import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import dbWrapper from "./db-wrapper"

export interface User {
    _id: string,
    name: string,
    email: string,
    password: string,
    token: string,
    role: number,
}

export const getUserByEmail = async (email: string) => {
  const user = await dbWrapper.getUser(email) as User;
  return user;
}

export const getUserById = async (id: string) => {
  const user = await dbWrapper.getUserById(id) as User;
  return user;
}

export const validatePassword = async (password: string, actualPassword: string) => {
  const passwordMatch = await bcrypt.compare(password, actualPassword);
  return passwordMatch;
}

export const getUserData = (requestUser: User) => {
  return {
    name: requestUser.name,
    email: requestUser.email,
    role: requestUser.role,
  }
}

export const createNewUser = async (email: string, password: string, role: number, name?: string) => {
    const token = uuidv4();
    const hashedPwd = await bcrypt.hash(password, 10);
    const newUser = await dbWrapper.addUser(email, hashedPwd, role, token, name);
    return newUser._id;
}

export const changeUserPassword = async (id: string, password: string, newPassword: string) => {
    const user = await dbWrapper.getUserById(id) as User;
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
        throw Error('Incorrect password.');
    const newHashedPwd = await bcrypt.hash(newPassword, 10);
    const updatedUser = await dbWrapper.changePassword(id, user.password, newHashedPwd);
    return updatedUser._id;
}

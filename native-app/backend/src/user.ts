import bcrypt from 'bcrypt';
import dbWrapper from './db-wrapper';

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
};

export const validatePassword = async (password: string, actualPassword: string) => {
  const passwordMatch = await bcrypt.compare(password, actualPassword);
  return passwordMatch;
};

export const getUserData = (requestUser: User) => (
  {
    name: requestUser.name,
    email: requestUser.email,
    role: requestUser.role,
    token: requestUser.token,
  }
);

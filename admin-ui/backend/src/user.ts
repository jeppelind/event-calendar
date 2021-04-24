import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import dbWrapper from "./db-wrapper"

interface User {
    _id: string,
    name: string,
    email: string,
    password: string,
    token: string,
    role: number,
}

export const getUserObject = async (email: string, password: string) => {
    const user = await dbWrapper.getUser(email) as User;
    if (!user)
        throw Error('User not found.');
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
        throw Error('Incorrect password.');
    if (!user.role || user.role < 1)
        throw Error('Access denied.');
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        token: user.token,
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

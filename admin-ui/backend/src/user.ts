import bcrypt from 'bcrypt';
import dbWrapper from "./db-wrapper"

export const getUserObject = async (email: string, password: string) => {
    const user = await dbWrapper.getUser(email) as any;
    if (!user)
        throw Error('User not found.');
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
        throw Error('Incorrect password.');
    return {
        id: user._id,
        name: user.name,
        email: user.email,
    }
}

export const createNewUser = async (email: string, password: string, name?: string) => {
    const hashedPwd = await bcrypt.hash(password, 10);
    const newUser = await dbWrapper.addUser(email, hashedPwd, name);
    return newUser._id;
}

export const changeUserPassword = async (id: string, password: string, newPassword: string) => {
    const user = await dbWrapper.getUserById(id) as any;
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
        throw Error('Incorrect password.');
    const newHashedPwd = await bcrypt.hash(newPassword, 10);
    const updatedUser = await dbWrapper.changePassword(id, user.password, newHashedPwd);
    return updatedUser._id;
}

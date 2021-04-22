import dbWrapper from "./db-wrapper"

export const getUserObject = async (email: string, password: string) => {
    const user = await dbWrapper.getUser(email);
    if (!user) {
        throw Error('User not found.');
    } else if (user.password !== password) {
        throw Error('Incorrect password.');
    }
    return {
        name: user.name,
        email: user.email,
    }
}

export const createNewUser = async (email: string, password: string, name?: string) => {
    const newUser = await dbWrapper.addUser(email, password, name);
    return newUser.id;
}

export const changeUserPassword = async (email:string, password: string, newPassword: string) => {
    const user = await dbWrapper.changePassword(email, password, newPassword);
    return user.id;
}
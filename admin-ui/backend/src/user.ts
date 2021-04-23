import dbWrapper from "./db-wrapper"

interface User {
    id: String,
    email: String,
    name: String,
    password: String,
}

export const getUserObject = async (email: string, password: string) => {
    const user = await dbWrapper.getUser(email) as User;
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
    console.log(user)
    return user.id;
}

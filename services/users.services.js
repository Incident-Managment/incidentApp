import { fetchData, postData } from "../config/api";

export const getUsers = async () => {
    try {
        const users = await fetchData("users/usersGlobal");
        return users;
    } catch (error) {
        console.error("Error fetching users:", error.message);
        throw error;
    }
};

export const login = async (email, password) => {
    try {
        const data = await postData("users/login", { email, password });
        return data;
    } catch (error) {
        console.error("Error logging in:", error.message);
        throw error;
    }
};

export const getUserById = async (id) => {
    try {
        const user = await fetchData(`users/getUserById/${id}`);
        return user;
    } catch (error) {
        console.error(`Error fetching user with id ${id}:`, error.message);
        throw error;
    }
};

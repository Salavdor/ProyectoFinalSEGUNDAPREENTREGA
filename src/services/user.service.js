import userDaoManager from "../daos/mongodb/user.dao.js";

const userDao = new userDaoManager();

export const findByEmail = async (email) => {
  return userDao.getByEmail(email);
};

export const register = async (user) => {
  try {
    const { email, password } = user;
    if (email === "adminCoder@coder.com" && password === "adminCoder123") {
      return await userDao.createUser({ ...user, role: "admin" });
    }
    const exists = await userDao.getByEmail(email);
    if (!exists) return await userDao.createUser(user);
    else return false;
  } catch (error) {
    console.log(error);
  }
};

export const login = async (email, password) => {
  try {
    const userExist = await userDao.login( email, password );
    if (!userExist) return false;
    else return userExist;
  } catch (error) {
    console.log(error);
  }
};

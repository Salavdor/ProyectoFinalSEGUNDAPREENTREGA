import UserDaoMongoDB from "../daos/mongodb/user.dao.js";

const userDao = new UserDaoMongoDB();

export const register = async (user) => {
  try {
    const { email, password } = user;
    if(email === 'adminCoder@coder.com' && password === 'adminCoder123'){
      return await userDao.createUser({...user, role: 'admin'});
    }
    const exists = await userDao.getByEmail(email);
    console.log(exists);
    if (!exists) return await userDao.createUser(user);
    else return false;
  } catch (error) {
    console.log(error);
  }
};

export const login = async (email, password) => {
  try {
    console.log('body', email, password);
    const userExist = await userDao.login(email, password);
    console.log('login::', userExist);
    if (!userExist) return false;
    else return userExist;
  } catch (error) {
    console.log(error);
  }
};

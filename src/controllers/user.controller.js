import * as UserService from "../services/user.service.js";


export const register = async (req, res, next) => {
  try {
    const user = await UserService.register(req.body);
    if (user) res.redirect("/views");
    else res.redirect("/views/register-error");
  } catch (error) {
    next(error);
  }
};
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserService.login(email, password);
    if (user) {
      req.session.info = {
        email: email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        loggedIn: true,
      };
      res.redirect("/views/profile");
    } else res.redirect("/views/error-login");
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    req.session.destroy();
    res.redirect("/login");
  } catch (error) {
    console.log(error);
  }
};

export const perfil = async (req, res, next) => {
  try {
    const info = req.session.info
    console.log(info)
    res.render("profile")
  } catch (error) {}
};

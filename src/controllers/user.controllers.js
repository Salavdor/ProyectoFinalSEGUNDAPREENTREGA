import Controllers from "./class.controller.js";
import UserService from "../services/user.services.js";
import { createResponse } from "../utils.js";
const userService = new UserService();
import { generateToken } from "../middlewares/authJwt.js";
import { HttpResponse } from "../http.response.js";
const httpResponse = new HttpResponse();

export default class UserController extends Controllers {
  constructor() {
    super(userService);
  }

  // -----------------------------------------------------  //
  //                         VIEWS                          //
  // -----------------------------------------------------  //
  //Renderizar vista de registro
  registerForm = async (req, res, next) => {
    try {
      res.render("register.handlebars");
    } catch (error) {
      next(error);
    }
  };

  //Renderizar vista de login
  loginForm = async (req, res, next) => {
    try {
      res.render("login.handlebars");
    } catch (error) {
      next(error);
    }
  };

  // -----------------------------------------------------  //
  //                       BACKEND                          //
  // -----------------------------------------------------  //

  register = async (req, res, next) => {
    try {
      const newUser = await userService.register(req.body);
      if (!newUser) return httpResponse.NotFound(res, "User already exists");
      else return httpResponse.Ok(res, newUser);
    } catch (error) {
      next(error);
    }
  };

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await userService.login(email, password);
      if (!user) return httpResponse.NotFound(res, "invalid credentials");

      req.session.info = {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        cartID: user.cartID,
        last_connection: user.last_connection,
        loggedIn: true,
      };

      const access_token = generateToken(user);
      if (!access_token)
        return httpResponse.NotFound(res, "invalid credentials");
      else
        return httpResponse.Ok(
          res.cookie("token", access_token, { httpOnly: true }),
          access_token
        );
      // res
      //      .cookie('token', access_token, { httpOnly: true })
      //      // .header('Authorization', access_token)

      //      .json({msg: 'Login OK', access_token})
      //      // .redirect('/api/users/current')
      //      ;
    } catch (error) {
      next(error);
    }
  };

  current = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const user = await userService.getById(userId);
      if (!user) return httpResponse.NotFound(res, "Not found");
      const { first_name, last_name, email, role, cartID } = user;
      const userData = {
        first_name,
        last_name,
        email,
        role,
        cartID,
      };
      return httpResponse.Ok(res, userData);
    } catch (error) {
      next(error);
    }
  };

  // Obtener lista de usuarios
  getUsersList = async (req, res, next) => {
    try {
      let users_list = await userService.getUsers();
      if (!users_list)
        return httpResponse.NotFound(res, "Not found users list");
      else return httpResponse.Ok(res, users_list);
    } catch (error) {
      next(error);
    }
  };

  // Obtener usuario por ID
  userById = async (req, res, next) => {
    try {
      let { uid } = req.params;
      let user = await userService.getById(uid);
      if (!user) return httpResponse.NotFound(res, "Usuario no registrado");
      else return httpResponse.Ok(res, user);
    } catch (error) {
      next(error);
    }
  };

  // Eliminar un usuario por id
  deleteUser = async (req, res, next) => {
    try {
      let { uid } = req.params;
      let result = await userService.deleteById(uid);
      if (!result) return httpResponse.NotFound(res, "Usuario no eliminado");
      else return httpResponse.Ok(res, result);
    } catch (error) {
      next(error);
    }
  };

  //--------------------------------------------------------------------//

  //Destruir session
  destroySession = async (req, res, next) => {
    try {
      //Actualizar última conexión cada vez vez que el usuario realice el proceso de logout.
      req.session.info.last_connection = new Date();

      const { _id } = await userService.getByEmail(req.session.info.email);
      const result = await userService.updateUser(
        _id,
        req.session.info
      );
      req.session.destroy();
      if (!result) return httpResponse.NotFound(res, "Error al intentar salir");
      else return httpResponse.Ok(res, result);
      
    } catch (error) {
      next(error);
    }
  };

  //--------------------------------------------------------------------//

  //Autenticación con JWT
  authenticateWithJwt = async (req, res, next) => {
    try {
      let { email, password } = req.body;

      //Buscar usuario en la base.
      let user = await userService.getUserByEmail(email);
      if (!user) return res.send({ message: "Usuario no registrado" });

      //Comparación del pass del usuario con el pass hasheado.
      if (!isValidatePassword(user, password))
        return res.send({ message: "Contraseña incorrecta." });

      //Creación del token.
      let token = jwt.sign({ email: user.email }, "coderSecret", {
        expiresIn: "24h",
      });

      //El cliente envía sus credenciales mediante una cookie.
      res.cookie("token", token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
      });

      req.session.user = {
        _id: user._id,
        full_name: user.full_name,
        age: user.age,
        email: user.email,
        role: user.role,
      };

      res.redirect("/api/users/current");
    } catch (error) {
      next(error);
    }
  };

  //Ruta para renderizar vista del usuario.
  currentUser = (req, res, next) => {
    try {
      if (!req.user) {
        return res.redirect("/api/sessions");
      }

      let { _id, full_name, email, age, role } = req.session.user;

      res.render("current.handlebars", {
        _id,
        full_name,
        email,
        age,
        role,
      });
    } catch (error) {
      next(error);
    }
  };

  //Ruta para devolver el actual usuario en JSON.
  currentUserJson = (req, res, next) => {
    try {
      if (!req.user) {
        return res.redirect("/api/sessions");
      }

      res.send({ payload: req.user });
    } catch (error) {
      next(error);
    }
  };
  //--------------------------------------------------------------------//

  // Renderizar vista para enviar correo y restablecer password
  renderViewToSendEmail = (req, res) => {
    try {
      res.render("restorePass.handlebars");
    } catch (error) {
      next(error);
    }
  };

  //Renderizar vista para cambiar password.
  renderViewChangePassword = (req, res, next) => {
    try {
      res.render("restore.handlebars");
    } catch (error) {
      next(error);
    }
  };

  // Enviar correo con enlace de restablecimiento de contraseña
  emailToRestorePassword = async (req, res, next) => {
    try {
      const { email } = req.body;
      if (!email)
        return res
          .status(400)
          .send({ status: "error", error: "Valores inexistentes" });

      //Verificar existencia de usuario en db
      let user = await userService.getUserByEmail(email);
      if (!user)
        return res
          .status(400)
          .send({ status: "error", error: "Usuario no encontrado" });

      const token = jwt.sign({ email }, "coderSecret", { expiresIn: "1h" });

      // Enviar un correo con el enlace para restablecer la contraseña
      const { transporter } = require("../app");

      const mailOptions = {
        from: "Coder Tests <francogaray2314@gmail.com>",
        to: email,
        subject: "Restablecer contraseña",
        html: `
          <div>
          <h1>Restablecer contraseña</h1>
          <p>Ingrese en el siguiente enlace: 
          <a href="http://localhost:8080/api/sessions/restore/${token}">Haga click aquí</a>
          </p>
          </div>
          `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Correo enviado", info.response);
          res.status(200).json({
            message:
              "Revise su correo, se le envió un enlace para restablecer su contraseña.",
          });
        }
      });
    } catch (error) {
      next(error);
    }
  };

  // Cambiar Contraseña
  changePassword = async (req, res, next) => {
    try {
      let { token } = req.params;
      if (!token)
        return res
          .status(400)
          .send({ status: "error", error: "Token inexistente." });

      let { newPassword } = req.body;
      if (!newPassword)
        return res
          .status(400)
          .send({ status: "error", error: "Valores inexistentes" });

      //Verificar existencia de usuario en db
      const { email } = jwt.verify(token, "coderSecret");
      let user = await userService.getUserByEmail(email);
      if (!user)
        return res
          .status(400)
          .send({ status: "error", error: "Usuario no encontrado" });

      // Verificar si son iguales la pass vieja con la nueva
      if (isValidatePassword(user, newPassword))
        return res
          .status(400)
          .json({ message: "Las contraseñas son iguales." });

      //Actualizando password con hash
      user.password = createHash(newPassword);

      //Actualizamos usuario en la base con su nuevo password.
      await userService.updateUser(user._id, user);

      //Redirigir para logearse.
      console.log("Contraseña cambiada correctamente.");
      res.redirect("/api/sessions");
    } catch (error) {
      next(error);
    }
  };
}

import { Router } from 'express';
// import { checkAuth } from '../middlewares/authJwt.js';
import passport from "passport";
import UserController from '../controllers/user.controllers.js';
const controller = new UserController();

const router = Router();

router
        
        //Renderizar vista de registro
        .get('/register', controller.registerForm)
        // .get("/register", controller.renderViewRegister)

        //Renderizar vista de login
        // .get("/", controller.renderViewLogin)
        .get('/login', controller.loginForm)


        .get('/current', passport.authenticate("jwtCookies"), controller.current)
        
        // Logica de registro
        .post('/register', controller.register)
        .post('/login', controller.login)

        // Obtener lista de usuarios
        .get("/users_list", controller.getUsersList)

        // Obtener usuario por ID
        .get("/user/:uid", controller.userById)

        // Eliminar un usuario
        .delete("/", controller.deleteAllUsers)

        //--------------------------------------------------------------------//

        //Destruir session
        .get("/logout", controller.destroySession)

        //--------------------------------------------------------------------//

        //Registrar usuario (Estrategia local)
        .post("/register", passport.authenticate('jwtCookies', { failureRedirect: "/api/sessions/failRegister" }), controller.registerUser)

        //Ruta por si no se logra hacer el passport register.
        .get('/failRegister', controller.failRegister)

        //--------------------------------------------------------------------//

        //Autenticación con JWT
        .post("/", controller.authenticateWithJwt)

        //Ruta para renderizar vista con los datos del usuario.
        .get("/current", passport.authenticate("jwtCookies", { session: false }), controller.currentUser)

        // Ruta para devolver el actual usuario en JSON
        .get("/currentJson", passport.authenticate("jwtCookies", { session: false }), controller.currentUserJson)

        //--------------------------------------------------------------------//

        // Renderizar vista para enviar correo con enlace para restablecer contraseña
        .get('/restore', controller.renderViewToSendEmail)

        // Restablecer contraseña
        .post('/restore', controller.emailToRestorePassword)

        //Renderizar vista para cambiar password.
        .get('/restore/:token', controller.renderViewChangePassword)

        //Cambiar contraseña.
        .post('/restore/:token', controller.changePassword)

        //--------------------------------------------------------------------//
export default router;


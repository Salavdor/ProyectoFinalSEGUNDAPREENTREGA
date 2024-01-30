import jwt from 'jsonwebtoken';
import UserService from "../services/user.services.js";
const userService = new UserService();

const PRIVATE_KEY = '1234'

export const generateToken = (user) => {
  const payload = {
    userId: user._id,
  };

  const token = jwt.sign(payload, PRIVATE_KEY, {
    expiresIn: '20m',  
  });
  return token;
};

// Roles disponibles
const ROLES = ["user", "admin", "premium"]

//Validar Token
export const verifyToken = async (req, res, next) => {
    try {
        // Obtener token de cookie
        const token = req.cookies.token
        console.log("______token verify",token)
        if (!token) return res.status(403).json({ status: "error", error: "No token provided." })

        //Obtenemos el usuario a partir del token
        let decoded = jwt.verify(token, "coderSecret")
        req.userEmail = decoded.email

        // Buscar usuario con el Id del token recibido
        const user = await userService.getUserByEmail(req.userEmail)
        if (!user) return res.status(404).json({ message: 'No user found' })
        next()

    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}


// Validar que el usuario sea de role admin
export const isUserOrPremium = async (req, res, next) => {
    const user = await userService.getUserByEmail(req.userEmail)

    if (user.role === "user" || user.role === "premium") {
        next()
        return
    }

    return res.status(403).json({message:"Require User or Premium role"})
}


// Validar que el usuario sea de role admin
export const isAdminOrPremium = async (req, res, next) => {
    const user = await userService.getUserByEmail(req.userEmail)

    if(user.role === "admin" || user.role === "premium") {
        next()
        return
    }

    return res.status(403).json({message:"Require Admin or Premium role"})
}

// Validar que el usuario sea de role user 
export const isUser = async (req, res, next) => {
    const user = await userService.getUserByEmail(req.userEmail)

    if(user.role === "user") {
        next()
        return
    }

    return res.status(403).json({message:"Require User role"})
}
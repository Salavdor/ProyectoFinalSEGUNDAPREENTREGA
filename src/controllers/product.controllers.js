import Controllers from "./class.controller.js";
import ProductService from "../services/product.services.js";
const productService = new ProductService();
import UserService from "../services/user.services.js";
const userService = new UserService();
import { createResponse } from "../utils.js";
import jsonwebtoken from 'jsonwebtoken';
const { jwt } = jsonwebtoken;

export default class ProductController extends Controllers {
  constructor() {
    super(productService);
  }

  //Obtener los productos
  getProducts = async (req, res, next) => {
  try {

      // obtiene datos de paginacion desde query
      const pageSize = parseInt(req.query.limit) || 10;  //Query limit opcional
      const page = parseInt(req.query.page) || 1;        //Query page opcional

      let filtro = {}
      if (req.query.categoria) filtro = { categoria: req.query.categoria }
      if (req.query.stock) filtro = { stock: req.query.stock }

      let orden
      if (req.query.sort) {
          orden = {precio: req.query.sort}
      } else {
          orden = null
      }

      const options = {
          page,
          limit: pageSize,
          sort: orden
      };

      let result = await productService.paginateProducts(filtro, options)
      result.payload = result.docs;
      const products = result.payload;

      console.log("============== products:  "+products)

      // res.send({ result: "Success", payload: result })

      res.render("home.handlebars", {
        // style: "products.css",
        products
        // options: options,
        // query: query,
        // session: info,
      });
      
     

  } catch (error) {
    next(error.message);
  }
}

//Obtener producto por ID
getProductById = async (req, res, next) => {
  try {
      let { pid } = req.params;

      let result = await productService.getProductById(pid)

      res.send({ result: "Success", payload: result });

  } catch (error) {
    next(error.message);
  }
}

//Agregar productos
createProducts = async(req, res, next) => {
  try {
      let { title, categoria, precio, stock, imagen, owner } = req.body

      if (!title || !categoria || !precio || !stock || !imagen) {
          res.send({ status: "error", error: "Faltan parámetros para crear el producto." })
      }

      if (owner) {
          // Obtener token de cookie
          const token = req.cookies.token
          if (!token) return res.status(403).json({ status: "error", error: "No token provided." })

          // Obtener id del token para buscar usuario
          const { email } = jwt.verify(token, "coderSecret")

          let resultUser = await userService.getUserByEmail(email)
          if (!resultUser) return res.status(400).json({message: "Usuario no encontrado."})

          if (resultUser.email !== owner) return res.status(400).json({message: "Owner no coincide con el email de usuario logeado."})

          // Validar que el usuario cuente con role premium
          if (resultUser.role === "admin") {
              owner = resultUser.email
          } else {
              owner = null
          }
      }

      let product = {
          title,
          categoria,
          precio,
          stock,
          imagen,
          owner
      }

      let result = await productService.createProduct(product)

      res.send({ result: "Success", payload: result });

  } catch (error) {
    next(error.message);
  }
}

//Obtener producto por ID
getProductById = async (req, res, next) => {
  try {
      let { pid } = req.params;

      let result = await productService.getProductById(pid)

      res.send({ result: "Success", payload: result });

  } catch (error) {
    next(error.message);
  }
}

//Agregar productos
createProducts = async(req, res, next) => {
  try {
      let { title, categoria, precio, stock, imagen, owner } = req.body

      if (!title || !categoria || !precio || !stock || !imagen) {
          res.send({ status: "error", error: "Faltan parámetros para crear el producto." })
      }

      if (owner) {
          // Obtener token de cookie
          const token = req.cookies.token
          if (!token) return res.status(403).json({ status: "error", error: "No token provided." })

          // Obtener id del token para buscar usuario
          const { email } = jwt.verify(token, "coderSecret")

          let resultUser = await userService.getUserByEmail(email)
          if (!resultUser) return res.status(400).json({message: "Usuario no encontrado."})

          if (resultUser.email !== owner) return res.status(400).json({message: "Owner no coincide con el email de usuario logeado."})

          // Validar que el usuario cuente con role premium
          if (resultUser.role === "premium") {
              owner = resultUser.email
          } else {
              owner = null
          }
      }

      let product = {
          title,
          categoria,
          precio,
          stock,
          imagen,
          owner
      }

      let result = await productService.createProduct(product)

      res.send({ result: "Success", payload: result });

  } catch (error) {
    next(error.message);
  }
}

//Actualizar un producto
updateProduct = async (req, res, next) => {
  try {
      let { pid } = req.params;
      let productToReplace = req.body;

      let result = await productService.updateProduct(pid, productToReplace)

      res.send({ result: "Success", payload: result });

  } catch (error) {
    next(error.message);
  }
}

//Eliminar producto por su ID.
deleteProduct = async (req, res, next) => {
  try {
      let { pid } = req.params;

      let resultProduct = await productService.getProductById(pid)

      // Obtener token de cookie
      const token = req.cookies.token
      if (!token) return res.status(403).json({ status: "error", error: "No token provided." })

      // Obtener id del token para buscar usuario
      const { email } = jwt.verify(token, "coderSecret")

      // Buscar usuario
      let resultUser = await userService.getUserByEmail(email)
      if (!resultUser) return res.status(400).json({ message: "Usuario no encontrado." })


      // Role admin ? Puede eliminar cualquier producto
      // Role premium ? Puede eliminar si es que le pertenece
      if (resultUser.role === "admin") {
          let result = await productService.deleteProduct(pid)
          res.send({ result: "Success", payload: result });

      } else if (resultUser.email === resultProduct.owner) {
          let result = await productService.deleteProduct(pid)
          res.send({ result: "Success", payload: result });

      } else {
          res.status(401).json({ messsage: "No puede eliminar producto, no le pertenece." })
      }

  } catch (error) {
    next(error.message);
  }
}


aggregation1 = async (req, res, next) => {
  try {
    const filtro = req.query.filter;
    const response = await service.aggregation1(filtro);
    if (!response) throw new Error("No data found");
    return res.status(200).json({ response });
  } catch (error) {
    next(error.message);
  }
};

}

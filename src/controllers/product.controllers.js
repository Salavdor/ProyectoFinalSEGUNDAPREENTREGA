import Controllers from "./class.controller.js";
import ProductService from "../services/product.services.js";
const productService = new ProductService();
import UserService from "../services/user.services.js";
const userService = new UserService();
import { createResponse } from "../utils.js";
import jsonwebtoken from 'jsonwebtoken';
const { jwt } = jsonwebtoken;
import { HttpResponse } from "../http.response.js";
const httpResponse = new HttpResponse();
import { logger } from "../logs/winstonlog.js";

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
      if (!result) return httpResponse.NotFound(res, "producto no encontrado");
      else return httpResponse.Ok(res, result);
  } catch (error) {
    next(error.message);
  }
}

//Agregar productos
createProducts = async(req, res, next) => {
  try {
      let { title, categoria, precio, stock, imagen, owner } = req.body

      if (!title || !categoria || !precio || !stock || !imagen) return httpResponse.NotFound(res, "Faltan parámetros para crear el producto.");


      if (owner) {
          // Obtener token de cookie
          const token = req.cookies.token
          if (!token) return httpResponse.NotFound(res, "No token provided.");

          // Obtener id del token para buscar usuario
          const { email } = jwt.verify(token, "coderSecret")

          let resultUser = await userService.getUserByEmail(email)
          if (!resultUser) return httpResponse.NotFound(res, "Usuario no encontrado.");

          if (resultUser.email !== owner) return httpResponse.NotFound(res, "Owner no coincide con el email de usuario logeado.");

          // Validar que el usuario cuente con role amin
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

      if (!result) return httpResponse.NotFound(res, "producto no creado");
      else return httpResponse.Ok(res, result);

  } catch (error) {
    next(error.message);
  }
}

//Obtener producto por ID
getProductById = async (req, res, next) => {
  try {
      let { pid } = req.params;
      let result = await productService.getProductById(pid)

      if (!result) return httpResponse.NotFound(res, "producto no encontrado");
      else return httpResponse.Ok(res, result);

  } catch (error) {
    logger.error(error);
  }
}

//Actualizar un producto
updateProduct = async (req, res, next) => {
  try {
      let { pid } = req.params;
      let productToReplace = req.body;

      let result = await productService.updateProduct(pid, productToReplace)
      if (!result) return httpResponse.NotFound(res, "producto no actualizado");
      else return httpResponse.Ok(res, result);
  } catch (error) {
    next(error.message);
  }
}

//Eliminar producto por su ID.
deleteProduct = async (req, res, next) => {
  try {
      let { pid } = req.params;

      let resultProduct = await productService.getProductById(pid)
      if (!resultProduct) return httpResponse.NotFound(res, "producto no existe");

      // Obtener token de cookie
      const token = req.cookies.token
      if (!token) return httpResponse.NotFound(res, "No token provided");

      // Obtener id del token para buscar usuario
      const { email } = jwt.verify(token, "coderSecret")

      // Buscar usuario
      let resultUser = await userService.getUserByEmail(email)
      if (!resultUser) return httpResponse.NotFound(res, "Usuario no encontrado");


      // Role admin ? Puede eliminar cualquier producto
      // Role premium ? Puede eliminar si es que le pertenece
      if (resultUser.role === "admin") {
          let result = await productService.deleteProduct(pid)
          return httpResponse.Ok(res, result);

      } else {
          return httpResponse.NotFound(res, "No puede eliminar producto, no tienes permisos de administrador.");
      }

  } catch (error) {
    logger.error(error);
  }
}


aggregation1 = async (req, res, next) => {
  try {
    const filtro = req.query.filter;
    const response = await service.aggregation1(filtro);
    if (!response) return httpResponse.NotFound(res, "No data found");
    else return httpResponse.Ok(res, response);
  } catch (error) {
    logger.error(error);
  }
};

createProduct = async (req, res, next) => {
  try {
    const { cant } = req.query;
    const response = await productService.createProductMock(cant);
    if (!response) return httpResponse.NotFound(res, "No data found");
    else return httpResponse.Ok(res, response);
  } catch (error) {
    logger.error(error);
  }
};

}

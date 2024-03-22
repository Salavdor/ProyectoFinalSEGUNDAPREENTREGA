import Controllers from "./class.controller.js";
import ProductService from "../services/product.services.js";
const productService = new ProductService();
import UserService from "../services/user.services.js";
const userService = new UserService();
import CartService from "../services/cart.services.js";
const cartService = new CartService();
import { createResponse } from "../utils.js";
import jsonwebtoken from 'jsonwebtoken';
const { jwt } = jsonwebtoken;
import { HttpResponse } from "../http.response.js";
const httpResponse = new HttpResponse();
import { logger } from "../logs/winstonlog.js";
import ProductDTO from "../dtos/product.dto.js";
import { transporter } from "../services/email.service.js";

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

      res.send({ result: "Success", payload: result })

      // res.render("home.handlebars", {
        // style: "products.css",
        // products
        // options: options,
        // query: query,
        // session: info,
      // });
      
     

  } catch (error) {
    logger.error(error.message);
  }
}

//Obtener producto por ID
getProductById = async (req, res, next) => {
  try {
      let { pid } = req.params;
      let result = await productService.getProductById(pid)
      if (!result) return httpResponse.NotFound(res, "producto no encontrado"), logger.warn(`🚫 producto no encontrado`);
      else return httpResponse.Ok(res, result), logger.info(`✅ obteniendo producto con el id: ${result.pid}`);
  } catch (error) {
    next(error.message);
  }
}

//Agregar productos
createProducts = async(req, res, next) => {
  try {
      let { title, descripcion, categoria, precio, stock, imagen, codigo } = req.body
      if (!title || !categoria || !precio || !stock || !imagen || !codigo) return httpResponse.NotFound(res, "Faltan parámetros para crear el producto."), logger.warn(`🚫 Faltan parámetros para crear el producto.`);

      // if (owner) {
      //     // Obtener token de cookie
      //     const token = req.cookies.token
      //     if (!token) return httpResponse.NotFound(res, "No token provided."), logger.warn(`🚫 Token no proporcionado`);
      //     console.log('Hola desde owner')
      //     // Obtener id del token para buscar usuario
      //     const { email } = jwt.verify(token, "coderSecret")

      //     let resultUser = await userService.getUserByEmail(email)
      //     if (!resultUser) return httpResponse.NotFound(res, "Usuario no encontrado."), logger.warn(`🚫 Usuario no encontrado`);

      //     if (resultUser.email !== owner) return httpResponse.NotFound(res, "Owner no coincide con el email de usuario logeado."), logger.warn(`🚫 Owner no coincide con el email de usuario logeado`);

      //     // Validar que el usuario cuente con role amin
      //     if (resultUser.role === "admin") {
      //         owner = resultUser.email
      //     } else {
      //         owner = null
      //     }
      // }

      let product = {
          title,
          descripcion,
          categoria,
          precio,
          stock,
          imagen,
          codigo
      }

      let productToInsert = new ProductDTO(product)
      let result = await productService.createProduct(productToInsert)

      if (!result) return httpResponse.NotFound(res, "producto no creado"), logger.warn(`🚫 producto no creado`);
      else return httpResponse.Ok(res, result), logger.info(`✅ producto creado`);

  } catch (error) {
    next(error.message);
  }
}

//Obtener producto por ID
getProductById = async (req, res, next) => {
  try {
      let { pid } = req.params;
      let result = await productService.getProductById(pid)

      if (!result) return httpResponse.NotFound(res, "producto no encontrado"), logger.warn(`🚫 producto no encontrado`);
      else return httpResponse.Ok(res, result), logger.info(`✅ producto encontrado`);

  } catch (error) {
    logger.error(error);
  }
}

//Actualizar un producto
updateProduct = async (req, res, next) => {
  try {
      let { pid } = req.params;
      let productToReplace = req.body;

      let productToUpdate = new ProductDTO(productToReplace)
      let result = await productService.updateProduct(pid, productToUpdate)
      if (!result) return httpResponse.NotFound(res, "producto no actualizado"), logger.warn(`🚫 producto no actualizado`);
      else return httpResponse.Ok(res, result), logger.info(`✅ producto actualizado`);
  } catch (error) {
    next(error.message);
  }
}

//Eliminar producto por su ID.
deleteProduct = async (req, res, next) => {
  try {
      let { pid } = req.params;

      let resultProduct = await productService.getProductById(pid)
      if (!resultProduct) return httpResponse.NotFound(res, "producto no existe"), logger.warn(`🚫 producto no existe`);
      
      let carts_list = await cartService.getCarts();
      let index = carts_list.length;

      const userlist = await userService.getUsers();

      for (var i = 0; i < index; i++) {
        let cart = carts_list[i];
        let cartProdList = cart.products_list;
        let index = cartProdList.length;

        let lista_de_Productos_ = [];
        let prodInCart;
        let prodSwitch = false;

        // Busca producto en el carrito
        for (let j = 0; j < index; j++) {
          let prod = cartProdList[j].product;
          if(prod._id.equals(resultProduct._id)){
            prodSwitch = true;
            prodInCart = cartProdList[j];
          } else {
            lista_de_Productos_.push(cartProdList[j]);
          } 
        }

        if(prodSwitch) {
          function findCart(user) {
            return user.cartID.equals(cart._id);
          }
          let userCoincidence = userlist.find(user => findCart(user));

          // Enviar un correo con notificacion de eliminacion de producto
          const mailOptions = {
            from: "Farmacia",
            to: userCoincidence.email,
            subject: "Un Producto en tu carrito fue eliminado en el Sistema 🚫",
            html: `
              <div>
              <h1>En Producto: ${prodInCart._id} en tu carrito fue eliminado en el Sistema 🚫</h1>
              </div>
              `,
          };
          const responseMail = await transporter.sendMail(mailOptions);
          // Actualiza carrito
          cart.products_list = lista_de_Productos_;
          let cart_Update = await cartService.updateCart(cart._id, cart);
          logger.info(`✅ carrito actualizado`);
        }
      }

      console.log('Llegamos al Delete')

      let result = await productService.deleteProduct(pid)
      return httpResponse.Ok(res, result), logger.info(`✅ producto eliminado`);

  } catch (error) {
    logger.error(error);
  }
}


aggregation1 = async (req, res, next) => {
  try {
    const filtro = req.query.filter;
    const response = await service.aggregation1(filtro);
    if (!response) return httpResponse.NotFound(res, "No data found"), logger.warn(`🚫 No data found`);
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

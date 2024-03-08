import Controllers from "./class.controller.js";
import CartService from "../services/cart.services.js";
const cartService = new CartService();
import ProductService from "../services/product.services.js";
const productService = new ProductService();
import UserService from "../services/user.services.js";
const userService = new UserService();
import TicketController from "../controllers/ticket.controllers.js";
const ticketController = new TicketController();
import { HttpResponse } from "../http.response.js";
const httpResponse = new HttpResponse();
import { logger } from "../logs/winstonlog.js";

import { createResponse } from "../utils.js";

export default class ProductController extends Controllers {
  constructor() {
    super(cartService);
  }

  //Crear carrito
  createCart = async (req, res, next) => {
    try {
      let newCart = await cartService.createCart({ name, description });
      if (!newCart)
        return httpResponse.NotFound(res, "Algo salió mal al crear el carrito"), logger.warn(`🚫 Carrito no creado`);
      else return httpResponse.Ok(res, newCart), logger.info(`✅ carrito creado`);
    } catch {
      logger.error(error);
    }
  };

  //Obtener carrito por id
  getCartById = async (req, res, next) => {
    try {
      let { cid } = req.params;
      let result = await cartService.getCartById(cid);
      if (!result) return httpResponse.NotFound(res, "Carrito no obtenido"), logger.warn(`🚫 Carrito no obtenido`);
      else return httpResponse.Ok(res, result), logger.info(`✅ carrito obtenido`);
    } catch (error) {
      logger.error(error);
    }
  };

  //Agregar producto al carrito
  addProduct = async (req, res, next) => {
    try {
      // obtener datos de usuario
      const { userId } = req.user;
      const user = await userService.getById(userId);
      if (!user) return httpResponse.NotFound(res, "usuario no obtenido"), logger.warn(`🚫 usuario no obtenid`);

      //Buscar carrito
      const cartID = user.cartID;
      let cart = await cartService.getCartById(cartID);
      if (!cart) return httpResponse.NotFound(res, "El carrito con el id proporcionado no existe"), logger.warn(`🚫 El carrito con el id proporcionado no existe`);

      //Buscar producto
      let { pid } = req.params;
      let product = await productService.getProductById(pid);
      if (!product) return httpResponse.NotFound(res, "El producto con el id proporcionado no existe"), logger.warn(`🚫 El producto con el id proporcionado no existe`);

      //Cantidad
      let { quantity } = req.body;
   
      // Validamos la existencia del producto en el carrito
      const foundProductInCart = cart.products_list.find((p) => {
        if (p.product._id.equals(pid)) return p;
      });
     
      //Si existe le actualizamos la cantidad enviada por body o no.
      //Si no existe pusheamos el nuevo producto con la cantidad.
      const indexProduct = cart.products_list.findIndex((p) =>
        p.product._id.equals(pid)
      );
      if (foundProductInCart) {
        cart.products_list[indexProduct].quantity += quantity || 1;
      } else {
        cart.products_list.push({ product: pid, quantity: quantity });
      }
     

      //Actualizar carrito
      await cartService.updateCart(cart._id, cart);

      //Buscar cart nuevamente para el populate
      cart = await cartService.getCartById(cartID);
      if (!cart) return httpResponse.NotFound(res, "no se pudo guardar el producto"), logger.warn(`🚫 no se pudo guardar el producto`);
      else return httpResponse.Ok(res, cart), logger.info(`✅ producto agregado`);
    } catch (error) {
      logger.error(error);
    }
  };

  //Eliminar productos del carrito
  deleteOneProduct = async (req, res, next) => {
    try {
      // obtener datos de usuario
      const { userId } = req.user;
      const user = await userService.getById(userId);
      if (!user) return httpResponse.NotFound(res, "no se pudo obtener datos de usuario"), logger.warn(`🚫 no se pudo obtener datos de usuario`);

      //Buscar carrito
      const cartID = user.cartID;
      let cart = await cartService.getCartById(cartID);
      if (!cart) return httpResponse.NotFound(res, "El carrito con el id proporcionado no existe"), logger.warn(`🚫 El carrito con el id proporcionado no existe`);

      //Buscar producto
      let { pid } = req.params;
      let product = await productService.getProductById(pid);
      if (!product) return httpResponse.NotFound(res, "El producto con el id proporcionado no existe"), logger.warn(`🚫 El producto con el id proporcionado no exist`);


      //Validar la existencia del producto en el carrito
      const foundProductInCart = cart.products_list.find((p) => {
        if (p.product._id.equals(pid)) return p;
      });
      if (!foundProductInCart) return httpResponse.NotFound(res, "El producto no existe en el carrito."), logger.warn(`🚫 El producto no existe en el carrito`);

      //Filtrando array para eliminar el producto indicado
      cart.products_list = cart.products_list.filter(
        (p) => !p.product._id.equals(pid)
      );

      //Actualizar carrito
      await cartService.updateCart(cart._id, cart);

      //Buscar cart nuevamente para el populate
      cart = await cartService.getCartById(cartID);
      if (!cart) return httpResponse.NotFound(res, "no se pudo borrar el producto"), logger.warn(`🚫 no se pudo borrar el producto`);
      else return httpResponse.Ok(res, cart), logger.info(`✅ producto eliminado`);
    } catch (error) {
        logger.error(error);
    }
  };

  //Eliminar todos los productos del carrito
  deleteAllProducts = async (req, res, next) => {
    try {
      // obtener datos de usuario
      const { userId } = req.user;
      const user = await userService.getById(userId);
      if (!user) return httpResponse.NotFound(res, "no se pudo obtener datos de usuario"), logger.warn(`🚫 no se pudo obtener datos de usuario`);

      //Buscar carrito
      const cartID = user.cartID;
      let cart = await cartService.getCartById(cartID);
      if (!cart) return httpResponse.NotFound(res, "El carrito con el id proporcionado no existe"), logger.warn(`🚫 El carrito con el id proporcionado no existe`);

      //Vaciar carrito
      cart.products_list = [];

      //Actualizamos las modificaciones del carrito.
      let result = await cartService.updateCart(cart._id, cart);
      if (!result) return httpResponse.NotFound(res, "Error al vaciar el carrito."), logger.warn(`🚫 Error al vaciar el carrito`);
      else return httpResponse.Ok(res, result) , logger.info(`✅ productos eliminados`);
    } catch (error) {
        logger.error(error);
    }
  };

  // Finalizar compra
  finalizePurchase = async (req, res, next) => {
    try {
      // obtener datos de usuario
      const { userId } = req.user;
      const user = await userService.getById(userId);
      if (!user) return httpResponse.NotFound(res, "no se pudo obtener datos de usuario"), logger.warn(`🚫 no se pudo obtener datos de usuario`);

      //Buscar carrito
      const cartID = user.cartID;
      let cart = await cartService.getCartById(cartID);
      if (!cart) return httpResponse.NotFound(res, "El carrito con el id proporcionado no existe") , logger.warn(`🚫 El carrito con el id proporcionado no existe`);
      
      // Productos confirmados
      let productosConfirmados = [];

      // // Validar stock de cada producto
      // // Quedarán en el carrito aquellos productos con stock insuficiente
      for (let i = cart.products_list.length - 1; i >= 0; i -= 1) {
        if (
          cart.products_list[i].product.stock >= cart.products_list[i].quantity
        ) {
          cart.products_list[i].product.stock =
            cart.products_list[i].product.stock -
            cart.products_list[i].quantity;

          // Lo agregamos al array de productos confirmados
          productosConfirmados.push(cart.products_list[i]);

          // Actualizar stock del producto en la db
          await productService.updateProduct(
            cart.products_list[i].product._id,
            cart.products_list[i].product
          );

          // Lo retiramos del carrito
          cart.products_list.splice(i, 1);
        }
      }

      // Obtener usuario de req.usuario para luego crear el ticket
     ticketController.createTicket(
        user._id,
        productosConfirmados,
        cart,
        req,
        res
      );
   
      // Actualizar carrito
      await cartService.updateCart(cartID, cart);
      logger.info(`✅ compra finalizada`)

    } catch (error) {
        logger.error(error);
    }
  };
}

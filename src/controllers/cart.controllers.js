import Controllers from "./class.controller.js";
import CartService from "../services/cart.services.js";
const cartService = new CartService();
import ProductService from "../services/product.services.js";
const productService = new ProductService();
import UserService from "../services/user.services.js";
const userService = new UserService();
import TicketController from '../controllers/ticket.controllers.js';
const ticketController = new TicketController();

import { createResponse } from "../utils.js";


export default class ProductController extends Controllers {
  constructor() {
    super(cartService);
  }

  //Crear carrito
createCart = async (req, res) => {
    let { name, description } = req.body;

    let result = await cartService.createCart({ name, description })

    if (!result) return res.status(500).send({status:"Error", error: "Algo salió mal al crear el carrito."})

    res.send({ result: "Success", payload: result });
}

//Obtener carrito por id
getCartById = async (req,res) => {
    try {
        let { cid } = req.params;

        let result = await cartService.getCartById(cid)

        res.send({ result: "Success", payload: result });

    } catch (error) {
        res.send({ status: error, error: "Error al obtener un carrito por su ID." });
    }
}


//Agregar producto al carrito
addProduct = async(req, res) => {

    // obtener datos de usuario
    const { userId } = req.user;
    const user = await userService.getById(userId);
      
    //Buscar carrito
    const cartID = user.cartID;
    let cart = await cartService.getCartById(cartID)
    console.log('========= cart: '+cartID,cart)
    if (!cart) {
        res.status(404).json({ error: `El carrito con el id proporcionado no existe` })
    }

    //Buscar producto
    let {pid} = req.params
    let product = await productService.getProductById(pid)
    console.log("======= product " , product);
    if (!product) {
        res.status(404).json({ error: `El producto con el id proporcionado no existe` })
    }

    //Cantidad
    let { quantity } = req.body;

    // Validamos la existencia del producto en el carrito
    const foundProductInCart = cart.products_list.find((p) => {
        if (p.product._id.equals(pid)) return p
    })
    
    //Si existe le actualizamos la cantidad enviada por body.
    //Si no existe pusheamos el nuevo producto con la cantidad enviada por body.
    const indexProduct = cart.products_list.findIndex((p) => p.product._id.equals(pid))
    if (foundProductInCart) {
        cart.products_list[indexProduct].quantity += quantity || 1;
    } else {
        cart.products_list.push({ product: pid, quantity: quantity});
    }

    //Actualizar carrito
    await cartService.updateCart(cart._id, cart)

    //Buscar cart nuevamente para el populate
    cart = await cartService.getCartById(cartID)

    console.log("==============",JSON.stringify(cart, null, '\t'));

    res.send({status:"Success", result:cart})
}


//Eliminar productos del carrito
deleteOneProduct = async (req, res) => {
    try {
        // obtener datos de usuario
        const { userId } = req.user;
        const user = await userService.getById(userId);
           
        //Buscar carrito
        const cartID = user.cartID;
        let cart = await cartService.getCartById(cartID)
        if (!cart) {
            res.status(404).json({ error: `El carrito con el id proporcionado no existe` })
        }
        console.log("********** Buscar carrito", cart)
    
        //Buscar producto
        let { pid } = req.params
        let product = await productService.getProductById(pid)
        if (!product) {
            res.status(404).json({ error: `El producto con el id proporcionado no existe` })
        }
        console.log("********** Buscar producto", product)
    
        //Validar la existencia del producto en el carrito
        const foundProductInCart = cart.products_list.find((p) => {
            if (p.product._id.equals(pid)) return p
        })
        console.log("********** Validar la existencia del producto en el carrito", foundProductInCart)
        if(!foundProductInCart){
            res.status(404).json({ error: `El producto no existe en el carrito.` })
        }
    
        //Filtrando array para eliminar el producto indicado
        cart.products_list = cart.products_list.filter(p => !p.product._id.equals(pid))
        console.log("********** Filtrando array para eliminar el producto indicado", cart.products_list)
    
        //Actualizar carrito
        await cartService.updateCart(cart._id, cart)
        console.log("********** Actualizar carrito", cart.products_list)
    
        //Buscar cart nuevamente para el populate
        cart = await cartService.getCartById(cartID)
        console.log("********** Buscar cart nuevamente para el populate", cart)
    
        console.log(JSON.stringify(cart, null, '\t'));
    
        res.send({status:"Success", result:cart})
        
    } catch (error) {
        res.status(404).json({ error: `Error al eliminar un producto.` })
    }
}


//Eliminar todos los productos del carrito
deleteAllProducts = async (req, res) => {
    try {
        // obtener datos de usuario
        const { userId } = req.user;
        const user = await userService.getById(userId);
    
        //Buscar carrito
        const cartID = user.cartID;
        let cart = await cartService.getCartById(cartID)
        if (!cart) {
            res.status(404).json({ error: `El carrito con el id proporcionado no existe` })
        }

        //Vaciar carrito
        cart.products_list = []

        //Actualizamos las modificaciones del carrito.
        let result = await cartService.updateCart(cart._id, cart)
        console.log(JSON.stringify(cart, null, '\t'));
        res.send({ result: "Success", payload: result });

    } catch (error) {
        res.status(404).json({ error: `Error al vaciar el carrito.` })
    }
}


// Finalizar compra
finalizePurchase = async (req, res) => {
    try {
        // obtener datos de usuario
        const { userId } = req.user;
        const user = await userService.getById(userId);
           
        //Buscar carrito
        const cartID = user.cartID;
        let cart = await cartService.getCartById(cartID)
        if (!cart) return res.status(404).json({message: "El carrito con el id proporcionado no existe"})
        

        // Productos confirmados
        let productosConfirmados = []

        // // Validar stock de cada producto
        // // Quedarán en el carrito aquellos productos con stock insuficiente
        for (let i = cart.products_list.length-1; i >= 0; i-=1) {

            if (cart.products_list[i].product.stock >= cart.products_list[i].quantity) {
                cart.products_list[i].product.stock = cart.products_list[i].product.stock - cart.products_list[i].quantity

                
                // Lo agregamos al array de productos confirmados
                productosConfirmados.push(cart.products_list[i])
                
                // Actualizar stock del producto en la db
                await productService.updateProduct(cart.products_list[i].product._id, cart.products_list[i].product)

                // Lo retiramos del carrito
                cart.products_list.splice(i, 1)

            }
        }


        // Obtener usuario de req.usuario para luego crear el ticket
        ticketController.createTicket(user._id, productosConfirmados, cart, req, res)

                // Actualizar carrito
                await cartService.updateCart(cartID, cart)
        
    } catch (error) {
        res.status(404).json({ error: `Error al finalizar la compra.` })
    }
}
}

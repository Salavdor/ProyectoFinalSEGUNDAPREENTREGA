import * as service from "../services/carts.service.js";
import * as serviceProduct from "../services/products.service.js";

export const getAll = async (req, res, next) => {
  try {
    const response = await service.getAll();
    if (!response) {
      return res.status(401).json({ message: "No se encontraron carritos" });
    } else {
      return res.status(200).send(response);
    }
  } catch (error) {
    console.log(error);
  }
};

export const cambiarCantidad = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const { cid, pid } = req.params;
    const response = await service.updateCart(cid, pid, quantity);
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const getCart = async (req, res, next) => {
  const detalles = [];

  try {
    const { cid } = req.params;
    const cart = await service.getById(cid);
    if (!cart) {
      return res.status(401).json({ message: "No se encontraron carritos" });
    } else {
      const products = cart.products;
      for (let index = 0; index < products.length; index++) {
        const element = products[index];
        let id = element._id.valueOf();
        const detalle = await serviceProduct.getById(id);
        detalles.push(detalle);
      }
    }

    const data = combinarDetallesYCantidad(cart, detalles);
    res.render("cart", { style: "cart.css", data, cid });
  } catch (error) {
    next(error.message);
  }
};

export const getById = async (req, res, next) => {
  try {
    const carro = await service.getById(req.params.id);
    if (!carro) {
      res.status(404).json({ msg: "Cart Not Found!" });
    } else {
      res.status(200).json(carro);
    }
  } catch (error) {
    next(error.message);
  }
};

export const create = async (req, res, next) => {
  try {
    const newCart = await service.create();
    if (!newCart) {
      throw Error("Error creating cart");
    } else {
      res.status(201).json({ msg: "Carro creado con exito ", newCart });
    }
  } catch (error) {
    next(error.message);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const cartDel = await service.remove(cid, pid);
    if (!cartDel) res.status(404).json({ msg: "Error eliminado el producto" });
    else res.status(200).json({ msg: "Prodcuto eliminado" });
  } catch (error) {
    next(error.message);
  }
};
export const removeAll = async (req, res, next) => {
  try {
    const { cid } = req.params;
    if (cid) {
      const response = await service.removeAll(cid);
      if (response)
        res.status(200).json({ msg: "Todos los productos eliminados" });
    } else {
      res.status(500).json({
        msg: "No se ha encontrado un carrito de compras para borrar todos sus productos",
      });
    }
  } catch (error) {
    next(error.message);
  }
};

export const addProduct = async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const response = await service.addProduct(cid, pid);
    if (!response) res.status(404).json({ msg: "Error" });
    else res.status(200).json({ msg: "Producto agregado" });
  } catch (error) {
    next(error.message);
  }
};

function combinarDetallesYCantidad(response, detalles) {
  let dataCombinada = [];
  response.products.forEach((element) => {
    dataCombinada.push({
      cantidad: element.quantity,
      producto: element._id.valueOf(),
    });
  });

  dataCombinada.forEach((principal) => {
    detalles.forEach((secundaria) => {
      if (principal.producto == secundaria._id.valueOf()) {
        principal.price = secundaria.price;
        principal.stock = secundaria.stock;
        principal.category = secundaria.category;
        principal.title = secundaria.title;
      } else {
      }
    });
  });
  let total = 0;
  dataCombinada.forEach((element) => {
    total += element.cantidad * element.price;
  });
  dataCombinada.total = total;
  console.log(dataCombinada);
  return dataCombinada;
}

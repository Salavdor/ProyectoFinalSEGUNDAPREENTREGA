import Controllers from "./class.controller.js";
import TicketService from "../services/ticket.services.js";
import { createResponse } from "../utils.js";
const ticketService = new TicketService();
import { generateToken } from "../middlewares/authJwt.js";
import UserService from "../services/user.services.js";
const userService = new UserService();


export default class TicketController extends Controllers {
  constructor() {
    super(ticketService);
  }

  //Obtener tickets
getTicket = async(req, res) => {
    try {
        let result = await ticketService.getTicket()
    
        res.send({status:"Success", result:result})
    } catch (error) {
        res.send({ status: error, error: "Error al obtener los tickets." });
    }
 }

//Obtener ticket por Id
getTicketById = async(req, res) => {
    try {
        const {tid} = req.params
    
        let ticket = await ticketService.getTicketById(tid)
    
        res.send({status:"Success", result:ticket})
    } catch (error) {
        res.send({ status: error, error: "Error al obtener ticket por su ID." });
    }
}


// Crear ticket
createTicket = async(user, productosConfirmados, cart, req, res) => {
    try {
        //Obtener usuario
        let resultUser = await userService.getUserById(user)
        console.log('$$$$$$$$ Generate ticket usuario', resultUser)
        if (!resultUser) res.status(404).json({ error: "El usuario con el id proporcionado no existe" })

        //Suma del precio total
        let sum = productosConfirmados.reduce((acc, prev) => {
            acc += prev.product.price * prev.quantity
            return acc
        }, 0)
        console.log('$$$$$$$$ Suma del precio total', sum)
        console.log('$$$$$$$$ Suma del precio total', productosConfirmados)

        //Creación de un número de orden al azar
        let ticketNumber = Math.floor(Math.random() * 10000 + 1)
        let fechaActual = new Date()
    
        //Orden final
        let ticket = {
            code: ticketNumber,
            purchase_datetime: fechaActual,
            amount: sum,
            purchaser: resultUser.email,
            products: productosConfirmados
        }
        console.log('$$$$$$$$ ticket: ', ticket)
        console.log('$$$$$$$$ ticket.products', ticket.products)

        //Creación de la orden en la db
        let ticketResult = await ticketService.createTicket(ticket)
        console.log('$$$$$$$$ Orden final ticket', ticketResult)

        // Enviar correo con el resumen de la compra
        // const {transporter} = require('../app')

        // const mailOptions = {
        //     from: 'Coder Tests <user@gmail.com>',
        //     to: "user@Mail.com",
        //     subject: "Mail de prueba",
        //     html: `
        //     <div>
        //         <h1>¡Gracias por su compra!</h1>

        //         <h2>Resumen: </h2>

        //         <div>
        //         <p><strong>Número de orden: </strong> ${ticketResult.code}</p>
        //         <p><strong>Fecha y hora: </strong> ${ticketResult.purchase_datetime}</p>
        //         <p><strong>Precio total: </strong> $${ticketResult.amount}</p>
        //         <p><strong>Email del comprador: </strong> ${ticketResult.purchaser}</p>

        //         <p><strong>Productos: </strong>
        //         <ul> 
        //         ${ticketResult.products.map((p) => `
        //         <li>${p.product.nombre} - $${p.product.precio} - Cantidad: ${p.quantity}</li>
        //         `).join('')}
        //         </ul>

        //         </div>
        //     </div>
        //     `
        // }

        // transporter.sendMail(mailOptions, (error, info) => {
        //     if (error) {
        //         console.log(error);
        //     } else {
        //         console.log("Correo enviado", info.response);
        //     }
        // })

        // Enviar sms de confirmación
        // const twilio = require('twilio')
        // const config = require('../config/config.dotenv')
        // const client = twilio(config.twilio_account_sid, config.twilio_auth_token)
        
        // await client.messages.create({
        //     body: `¡ Gracias por su compra ! Puede ver el resumen en su correo.
        //     Número de orden: ${ticketResult.code}`,
        //     from: config.twilio_sms_number,
        //     to: "+542615939115"
        // })

        res.status(200).json({status:"Success", result: ticketResult, productosSinComprarPorStockInsuficiente: cart.products_list})

    } catch (error) {
        res.status(404).json({ message: "Error al crear ticket" });
    }
    }
}


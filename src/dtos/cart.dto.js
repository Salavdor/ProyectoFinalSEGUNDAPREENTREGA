export default class CartDTO {
    constructor(cart) {
        this.title = cart.name
        this.active = true
        this.description = cart.description
    }
}
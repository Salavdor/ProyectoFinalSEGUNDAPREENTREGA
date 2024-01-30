export default class CartDTO {
    constructor(cart) {
        this.active = true
        this.description = cart.products_list
    }
}
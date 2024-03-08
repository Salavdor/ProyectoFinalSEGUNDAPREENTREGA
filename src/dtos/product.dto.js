export default class ProductDTO {
    constructor(product) {
        this.title = product.title,
        this.description = product.descripcion,
        this.price = product.precio,
        this.thumbnails = product.imagen,
        this.code = product.codigo,
        this.stock = product.stock,
        this.category = product.categoria
    }
}


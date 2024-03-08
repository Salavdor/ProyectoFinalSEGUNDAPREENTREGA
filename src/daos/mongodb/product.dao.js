import MongoDao from "./mongo.dao.js";
import { ProductModel } from "./models/products.model.js";

export default class ProductDaoMongo extends MongoDao {
    constructor() {
        super(ProductModel);
    }
   

    async paginate(filter, options){
        try {
            const result = await ProductModel.paginate(filter, options);
            return result
        } catch (error) {
          throw new Error(error.message);
        }
      }
};



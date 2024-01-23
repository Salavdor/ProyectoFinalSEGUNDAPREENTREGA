import MongoDao from "./mongo.dao.js";
import { ProductModel } from "./models/products.model.js";

export default class ProductDaoMongo extends MongoDao {
    constructor() {
        super(ProductModel);
    }
   

    async paginate(filter, options){
        try {
            // console.log('========>  paginateDao: filter, options' +  filter, options)
            const result = await ProductModel.paginate(filter, options);
            // console.log('========>  paginateDao: result' +  filter, result)
            return result
        } catch (error) {
          throw new Error(error)
        }
      }
};



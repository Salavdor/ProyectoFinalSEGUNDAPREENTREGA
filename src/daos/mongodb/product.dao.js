import { ProductModel } from "./models/product.model.js";

export default class ProductDaoMongoDB {
  async aggregation1(filtro) {
    console.log(filtro);
    try {
      return await ProductModel.aggregate([
        {
          $match: {
            category: filtro,
          },
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  }

  async getAll(query, opciones) {
    try {
      const response = await ProductModel.paginate(
        { category: query },
        opciones
      );
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async getById(id) {
    try {
      const response = await ProductModel.findById(id).lean();
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async getByIdJSON(id) {
    try {
      const response = await ProductModel.findById(id).lean();
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async create(obj) {
    try {
      const response = await ProductModel.create(obj);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async update(id, obj) {
    try {
      const response = await ProductModel.findByIdAndUpdate(id, obj, {
        new: true,
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async delete(id) {
    try {
      const response = await ProductModel.findByIdAndDelete(id);
      return response;
    } catch (error) {
      console.log(error);
    }
  }
}

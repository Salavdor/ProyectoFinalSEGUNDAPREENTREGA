import { HttpResponse } from "../http.response.js";
const httpResponse = new HttpResponse();
import { logger } from "../logs/winstonlog.js";

export default class Controllers {
  constructor(service) {
    this.service = service;
  }

  getAll = async (req, res, next) => {
    try {
      const items = await this.service.getAll();
      if (!items) return httpResponse.NotFound(res, "Items not found") , logger.warn(`🚫 Items not found`);
      else return httpResponse.Ok(res, items), logger.info(`✅ items succes`);
    } catch (error) {
      logger.error(error);
    }
  };

  getById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const item = await this.service.getById(id);
      if (!item) return httpResponse.NotFound(res, "Items not found"), logger.warn(`🚫 Items not found`);
      else return httpResponse.Ok(res, item), logger.info(`✅ items succes`);
    } catch (error) {
      logger.error(error);
    }
  };

  create = async (req, res, next) => {
    try {
      const newItem = await this.service.create(req.body);
      if (!newItem) return httpResponse.NotFound(res, "NewItem not found"), logger.warn(`🚫 NewItem not found`);
      else return httpResponse.Ok(res, newItem), logger.info(`✅ item create`);
    } catch (error) {
      logger.error(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const { id } = req.params;
      const item = await this.service.getById(id);
      if (!item) return httpResponse.NotFound(res, "Items not found") , logger.warn(`🚫 Items not found`);
      
      
      const itemUpd = await this.service.update(id, req.body);
      if (!itemUpd) return httpResponse.NotFound(res, "NewItem not found"), logger.warn(`🚫 NewItem not found`);
      else return httpResponse.Ok(res, itemUpd), logger.info(`✅ item Update`);
 
    } catch (error) {
      logger.error(error);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { id } = req.params;
      const item = await this.service.getById(id);
      if (!item) return httpResponse.NotFound(res, "Item not found"), logger.warn(`🚫 Items not found`);

      const itemDel = await this.service.delete(id);
      if (!itemDel) return httpResponse.NotFound(res, "Item delete not found"), logger.warn(`🚫 Item delete not found`);
      else return httpResponse.Ok(res, itemDel), logger.info(`✅ item delete`);
      
    } catch (error) {
      logger.error(error);
    }
  };
}

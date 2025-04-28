import { responseSuccess } from "../common/helpers/reponse";
import { demoService } from "../services/demo";

export const demoController = {
  create: async function (req, res, next) {
    try {
      const result = await demoService.create(req);
      const response = responseSuccess(result, `Create demo successfully`);
      res.status(response.statusCode).json(response);
    } catch (err) {
      next(err);
    }
  },

  findAll: async function (req, res, next) {
    try {
      const result = await demoService.findAll(req);
      const response = responseSuccess(result, `Get all demos successfully`);
      res.status(response.statusCode).json(response);
    } catch (err) {
      next(err);
    }
  },

  findOne: async function (req, res, next) {
    try {
      const result = await demoService.findOne(req);
      const response = responseSuccess(
        result,
        `Get demo #${req.params.id} successfully`
      );
      res.status(response.statusCode).json(response);
    } catch (err) {
      next(err);
    }
  },

  update: async function (req, res, next) {
    try {
      const result = await demoService.update(req);
      const response = responseSuccess(
        result,
        `Update demo #${req.params.id} successfully`
      );
      res.status(response.statusCode).json(response);
    } catch (err) {
      next(err);
    }
  },

  remove: async function (req, res, next) {
    try {
      const result = await demoService.remove(req);
      const response = responseSuccess(
        result,
        `Remove demo #${req.params.id} successfully`
      );
      res.status(response.statusCode).json(response);
    } catch (err) {
      next(err);
    }
  },
};

import { responseSuccess } from "../common/helpers/reponse";
import { pinService } from "../services/pin";

export const pinController = {
  create: async function (req, res, next) {
    try {
      const result = await pinService.create(req);
      const response = responseSuccess(result, `Create pin successfully`);
      res.status(response.statusCode).json(response);
    } catch (err) {
      next(err);
    }
  },

  findAll: async function (req, res, next) {
    try {
      const result = await pinService.findAll(req);
      const response = responseSuccess(result, `Get all pin successfully`);
      res.status(response.statusCode).json(response);
    } catch (err) {
      next(err);
    }
  },

  findOne: async function (req, res, next) {
    try {
      const result = await pinService.findOne(req);
      const response = responseSuccess(
        result,
        `Get pin #${req.params.id} successfully`
      );
      res.status(response.statusCode).json(response);
    } catch (err) {
      next(err);
    }
  },

  remove: async function (req, res, next) {
    try {
      const result = await pinService.remove(req);
      const response = responseSuccess(
        result,
        `Remove pin #${req.params.id} successfully`
      );
      res.status(response.statusCode).json(response);
    } catch (err) {
      next(err);
    }
  },

  getCommentsByPinId: async function (req, res, next) {
    try {
      const result = await pinService.getCommentsByPinId(req);
      const response = responseSuccess(
        result,
        `Get comments by pin #${req.params.id} successfully`
      );
      res.status(response.statusCode).json(response);
    } catch (err) {
      next(err);
    }
  },

  checkSavedPin: async function (req, res, next) {
    try {
      const result = await pinService.checkSavedPin(req);
      const response = responseSuccess(
        result,
        `Check saved pin #${req.params.id} successfully`
      );
      res.status(response.statusCode).json(response);
    } catch (err) {
      next(err);
    }
  },

  createComment: async function (req, res, next) {
    try {
      const result = await pinService.createComment(req);
      const response = responseSuccess(result, `Create comment successfully`);
      res.status(response.statusCode).json(response);
    } catch (err) {
      next(err);
    }
  },
};

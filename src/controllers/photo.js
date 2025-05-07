import photoService from "../services/photo";
import { responseSuccess } from "../common/helpers/reponse";

export const photoController = {
  create: async function (req, res, next) {
    try {
      const result = await photoService.create(req);
      const response = responseSuccess(result, `Upload ảnh mới thành công`);
      res.status(response.statusCode).json(response);
    } catch (err) {
      next(err);
    }
  },

  findAll: async function (req, res, next) {
    try {
      const result = await photoService.findAll(req);
      const response = responseSuccess(result, `Lấy danh sách ảnh thành công`);
      res.status(response.statusCode).json(response);
    } catch (err) {
      next(err);
    }
  },

  findOne: async function (req, res, next) {
    try {
      const result = await photoService.findOne(req);
      const response = responseSuccess(
        result,
        `Lấy thông tin ảnh #${req.params.id} đã tạo thành công`
      );
      res.status(response.statusCode).json(response);
    } catch (err) {
      next(err);
    }
  },

  savedImage: async function (req, res, next) {
    try {
      const result = await photoService.savedImage(req);
      const response = responseSuccess(
        result,
        `Lấy danh sách ảnh #${req.params.id} đã lưu theo người dùng`
      );
      res.status(response.statusCode).json(response);
    } catch (err) {
      next(err);
    }
  },

  remove: async function (req, res, next) {
    try {
      const result = await photoService.remove(req);
      const response = responseSuccess(
        result,
        `Xóa ảnh #${req.params.id} thành công`
      );
      res.status(response.statusCode).json(response);
    } catch (err) {
      next(err);
    }
  },

  saveImage: async function (req, res, next) {
    try {
      const result = await photoService.saveImage(req);
      const response = responseSuccess(
        result,
        `Lưu ảnh #${req.params.id} thành công`
      );
      res.status(response.statusCode).json(response);
    } catch (err) {
      next(err);
    }
  },

  unSaveImage: async function (req, res, next) {
    try {
      const result = await photoService.unSaveImage(req);
      const response = responseSuccess(
        result,
        `Hủy lưu ảnh #${req.params.id} thành công`
      );
      res.status(response.statusCode).json(response);
    } catch (err) {
      next(err);
    }
  },
};
export default photoController;

import { responseSuccess } from "../common/helpers/reponse";
import authService from "../services/auth";

const authController = {
  register: async (req, res, next) => {
    try {
      const result = await authService.register(req, res, next);
      const response = responseSuccess(result, `Đăng ký thành công`);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const result = await authService.login(req, res, next);
      const response = responseSuccess(result, `Đăng nhập thành công`);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },

  refreshToken: async (req, res, next) => {
    try {
      const result = await authService.refreshToken(req);
      const response = responseSuccess(result, `Refresh token thành công`);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },
  getInfo: async (req, res, next) => {
    try {
      const result = await authService.getInfo(req);
      const response = responseSuccess(
        result,
        `Lấy thông tin người dùng thành công`
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },
  googleLogin: async (req, res, next) => {
    try {
      const result = await authService.googleLogin(req);
      const response = responseSuccess(
        result,
        `Lấy thông tin người dùng thành công`
      );
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  },
};

export default authController;

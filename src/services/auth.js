import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REFRESH_TOKEN_SECRET,
} from "../common/constant/app";
import {
  BadRequestException,
  UnAuthorizedException,
} from "../common/helpers/exception";
import prisma from "../common/prisma/init";
import logger from "../common/winston/init";
import tokenService from "./token";

const authService = {
  register: async (req) => {
    const { email, password, fullName, age } = req.body;
    console.log({ email, password, fullName, age });

    // Kiểm tra đầu vào cơ bản
    if (!email || !password) {
      throw new BadRequestException("Email và mật khẩu là bắt buộc");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new BadRequestException("Định dạng email không hợp lệ");
    }
    if (password.length < 6) {
      throw new BadRequestException("Mật khẩu phải có ít nhất 6 ký tự");
    }

    const userExist = await prisma.users.findUnique({
      where: { email },
    });
    if (userExist)
      throw new BadRequestException(`Tài khoản đã tồn tại, vui lòng đăng nhập`);
    console.log({ userExist });

    const salt = await bcrypt.genSalt(10); // tạo ra một chuỗi ngẫu nhiên để làm tăng phức tạp mã hoá ()
    console.log({ salt });
    const hashPassword = await bcrypt.hash(password, salt);

    // (token) => base64;
    // mã hoá chữ ký

    const userNew = await prisma.users.create({
      data: {
        email,
        password: hashPassword,
        full_name: fullName,
        age: typeof age === "number" ? age : null,
      },
    });

    console.log({ userNew });
    delete userNew.password;
    return userNew;
  },

  login: async (req) => {
    const { email, password } = req.body;

    // Kiểm tra đầu vào
    if (!email || !password) {
      throw new BadRequestException("Email và mật khẩu là bắt buộc");
    }

    const userExist = await prisma.users.findUnique({
      where: { email },
    });
    if (!userExist)
      throw new BadRequestException("Tài khoản chưa tồn tại, vui lòng đăng ký");

    if (!userExist?.password)
      throw new BadRequestException(
        "Vui lòng đăng ký hoặc đăng nhập bằng google"
      );

    const isPassword = bcrypt.compareSync(password, userExist.password);
    if (!isPassword) {
      // logic kiểm tra nếu đăng nhập quá 3 lần, lưu dấu vết hoặc cho vào blacklist để theo
      logger.error(
        `Người dùng ${userExist.id} đăng nhập thất bại: mật khẩu sai`
      );
      throw new BadRequestException("Mật khẩu không chính xác");
    }

    const tokens = tokenService.createTokens(userExist.id);
    return tokens;
  },

  refreshToken: async (req) => {
    const { accessToken, refreshToken } = req.body;

    if (!accessToken || !refreshToken)
      throw new UnAuthorizedException(
        "Access token và refresh token là bắt buộc"
      );

    try {
      const decodeRefreshToken = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
      const decodeAccessToken = jwt.verify(accessToken, ACCESS_TOKEN_SECRET, {
        ignoreExpiration: true,
      });

      if (decodeRefreshToken.userId !== decodeAccessToken.userId) {
        throw new UnAuthorizedException("Tokens không hợp lệ");
      }

      const newTokens = tokenService.createTokens(decodeAccessToken.userId);
      return newTokens;
    } catch (error) {
      throw new UnAuthorizedException("Token không hợp lệ hoặc hết hạn");
    }
  },

  getInfo: async (req) => {
    if (!req.user) {
      throw new UnAuthorizedException("Người dùng chưa được xác thực");
    }
    delete req.user.password;
    return req.user;
  },

  googleLogin: async (req) => {
    const { code } = req.body;
    console.log({ code });

    // Kiểm tra đầu vào
    if (!code) {
      throw new BadRequestException("Mã xác thực Google là bắt buộc");
    }

    try {
      const oAuth2Client = new OAuth2Client(
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET,
        "postmessage"
      );

      const { tokens } = await oAuth2Client.getToken(code);
      const googleDecode = jwt.decode(tokens.id_token);
      console.log({ googleDecode });

      // email_verified: có ý nghĩa là email của google có xác thực hay chưa
      // Nếu email_verified = false thì sao?
      // Có thể là:
      // Email được thêm qua ứng dụng bên thứ ba, chưa được xác thực.
      // Email là alias chưa xác minh.
      // Hoặc là lỗi hoặc cấu hình sai từ phía client.
      if (googleDecode.email_verified === false)
        throw new BadRequestException(`Email chưa hợp lệ`);

      let userExist = await prisma.users.findUnique({
        where: {
          email: googleDecode.email,
        },
      });

      // 1 - userExist có tồn tại: sẽ có id
      // 2 - userExist chưa có thì sẽ chạy vào if, tạo người dùng mới => có id
      if (!userExist) {
        userExist = await prisma.users.create({
          data: {
            email: googleDecode.email,
            fullName: googleDecode.name,
            avatar: googleDecode.picture,
            googleId: googleDecode.sub,
          },
        });
      }

      // nếu code chạy được xuống đây, thì userExist luôn tồn tại => có id
      const tokensSystem = tokenService.createTokens(userExist.id);
      return tokensSystem;
    } catch (error) {
      logger.error("Đăng nhập bằng Google thất bại:", error.message);
      throw new BadRequestException(
        `Đăng nhập bằng Google thất bại: ${error.message}`
      );
    }
  },
};

export default authService;

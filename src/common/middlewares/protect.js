import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET } from "../constant/app";
import { UnAuthorizedException } from "../helpers/exception";
import prisma from "../prisma/init";

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const [type, token] = authHeader.split(" ");
    if (!token) throw new UnAuthorizedException(`Không tìm thấy token`);
    if (type !== "Bearer")
      throw new UnAuthorizedException(`Token không hợp lệ`);

    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);

    console.log(decoded);

    const user = await prisma.users.findUnique({
      where: {
        id: decoded.userId,
      },
    });

    if (!user) throw new UnAuthorizedException(`Không tìm thấy user`);

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

export default protect;

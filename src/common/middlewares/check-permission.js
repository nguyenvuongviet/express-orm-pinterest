import { BadRequestException } from "../helpers/exception";
import prisma from "../prisma/init";

const checkPermission = async (req, res, next) => {
  try {
    const user = req.user;
    const roleId = user.roleId;

    // nếu là admin thì pass qua
    if (roleId === 1) return next();

    // 1 - endpoint người dùng gọi
    const routerPath = req.route.path;
    const baseUrl = req.baseUrl;
    const endpoint = `${baseUrl}${routerPath}`;
    const method = req.method;
    // console.log({ endpoint, method, roleId });

    const isPermission = await prisma.rolePermission.findFirst({
      where: {
        roleId: roleId,
        Roles: {
          isActive: true,
        },
        Permissions: {
          endpoint: endpoint,
          method: method,
        },
        isActive: true,
      },
    });

    if (!isPermission)
      throw new BadRequestException("Không có quyền truy cập endpoint");

    console.log({ isPermission });

    next();
  } catch (error) {
    next(error);
  }
};

export default checkPermission;

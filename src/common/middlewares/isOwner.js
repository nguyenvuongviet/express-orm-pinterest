import { BadRequestException, ForbiddenException } from "../helpers/exception";
import prisma from "../prisma/init";

const isOwner = async (req, res, next) => {
  try {
    const pinId = req.params.id;
    const userId = req.user.id;

    const pin = await prisma.pins.findUnique({
      where: { id: pinId },
      select: { userId: true },
    });
    if (!pin) throw new BadRequestException(`Không tìm thấy Pin`);

    if (pin.userId !== userId)
      throw new ForbiddenException("Không phải người tạo Pin này");
    next();
  } catch (error) {
    next(error);
  }
};

export default isOwner;

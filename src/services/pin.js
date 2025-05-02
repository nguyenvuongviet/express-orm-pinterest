import { BadRequestException } from "../common/helpers/exception";
import { paginate } from "../common/helpers/paginate";
import prisma from "../common/prisma/init";

export const pinService = {
  create: async function (req) {
    return `This action create`;
  },

  findAll: async function (req) {
    let { page, pageSize, search } = req.query;
    search = search || ``;

    const where = {
      isDeleted: false,
      image_name: { contains: search },
    };
    return paginate(
      prisma.images,
      { where, orderBy: { createdAt: "desc" } },
      page,
      pageSize
    );
  },

  findOne: async function (req) {
    const { id } = req.params;
    const pinId = +id;

    if (isNaN(pinId)) {
      throw new BadRequestException("ID không hợp lệ.");
    }

    const pin = await prisma.images.findFirst({
      where: {
        id: pinId,
        isDeleted: false,
      },
    });

    if (!pin) throw new BadRequestException(`Không tìm thấy Pin`);

    const user = await prisma.users.findUnique({
      where: { id: pin.user_id },
    });

    return { pin, user };
  },

  remove: async function (req) {
    return `This action removes a id: ${req.params.id} pin`;
  },

  getCommentsByPinId: async function (req) {
    const { page, pageSize } = req.query;
    const { pin } = await pinService.findOne(req);

    const where = { image_id: pin.id, isDeleted: false };

    return paginate(
      prisma.comments,
      { where, orderBy: { createdAt: "desc" } },
      page,
      pageSize
    );
  },

  checkSavedPin: async function (req) {
    const { pin } = await pinService.findOne(req);

    const saved = await prisma.saved_images.findFirst({
      where: { image_id: pin.id, user_id: req.user.id, isDeleted: false },
    });

    return { isSaved: !!saved };
  },

  createComment: async function (req) {
    const { content } = req.body;
    if (!content) {
      throw new BadRequestException("Nội dung bình luận là bắt buộc");
    }

    const { pin } = await pinService.findOne(req);
    
    return prisma.comments.create({
      data: {
        content,
        image_id: pin.id,
        user_id: req.user.id,
        comment_date: new Date(),
      },
    });
  },
};

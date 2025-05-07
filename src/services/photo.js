import { v2 as cloudinary } from "cloudinary";
import prisma from "../common/prisma/init";
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_NAME,
} from "../common/constant/app";
import { BadRequestException } from "../common/helpers/exception";

export const photoService = {
  // Tạo ảnh mới
  create: async function (req) {
    const file = req.file;
    if (!file) {
      throw new BadRequestException("No file Upload");
    }
    const user_id = req.user?.id;
    if (!user_id) {
      throw new BadRequestException("Không xác định được người dùng");
    }
    const { description } = req.body;

    cloudinary.config({
      cloud_name: CLOUDINARY_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
    });

    const uploadResult = await new Promise((resolve) => {
      cloudinary.uploader
        .upload_stream({ folder: "images" }, (error, uploadResult) => {
          return resolve(uploadResult);
        })
        .end(file.buffer);
    });

    const image_name = uploadResult.public_id;
    const image_url = uploadResult.secure_url;

    const newImage = await prisma.images.create({
      data: {
        image_name,
        image_url,
        user_id,
        ...(description ? { description } : {}),
      },
    });

    return {
      id: newImage.id,
      file_name: newImage.image_name,
      image_url: newImage.image_url,
      ...(newImage.description ? { description: newImage.description } : {}),
      message: "Upload ảnh thành công",
    };
  },

  // Lấy danh sách ảnh (có phân trang + tìm kiếm theo image_name)
  findAll: async function (req) {
    let { page, pageSize, search } = req.query;
    page = +page > 0 ? +page : 1;
    pageSize = +pageSize > 0 ? +pageSize : 3;
    search = search || ``;
    const skip = (page - 1) * pageSize;
    const where = { image_name: { contains: search } };

    const items = await prisma.images.findMany({
      skip: skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      where: where,
    });

    const totalItem = await prisma.images.count({
      where: where,
    });
    const totalPage = Math.ceil(totalItem / pageSize);

    return {
      page: page,
      pageSize: pageSize,
      totalItem: totalItem,
      totalPage: totalPage,
      items: items || [],
    };
  },

  // Lấy chi tiết 1 ảnh, kèm thông tin user đăng
  findOne: async function (req) {
    const id = Number(req.params.id);
    if (!id) {
      throw new BadRequestException("ID ảnh không hợp lệ");
    }

    const image = await prisma.images.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            full_name: true,
            email: true,
            avatar: true,
          },
        },
      },
    });

    if (!image) {
      throw new BadRequestException("Không tìm thấy ảnh");
    }

    return {
      id: image.id,
      image_name: image.image_name,
      image_url: image.image_url,
      description: image.description,
      createdAt: image.createdAt,
      postedBy: image.users,
    };
  },

  // Lấy chi tiết 1 ảnh, kèm thông tin user lưu
  savedImage: async function (req) {
    const id = Number(req.params.id);
    if (!id || id < 1) {
      throw new BadRequestException("ID ảnh không hợp lệ");
    }

    const image = await prisma.images.findUnique({
      where: { id },
      include: {
        // thông tin người đăng (poster)
        users: {
          select: {
            id: true,
            full_name: true,
            email: true,
            avatar: true,
          },
        },
        // thông tin các bản ghi saved_images
        saved_images: {
          select: {
            saved_date: true,
            users: {
              select: {
                id: true,
                full_name: true,
                email: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            saved_date: "desc",
          },
        },
      },
    });

    if (!image) {
      throw new BadRequestException("Không tìm thấy ảnh");
    }

    return {
      id: image.id,
      image_name: image.image_name,
      image_url: image.image_url,
      description: image.description,
      createdAt: image.createdAt,
      postedBy: image.users,
      savedBy: image.saved_images.map((si) => ({
        id: si.users.id,
        full_name: si.users.full_name,
        email: si.users.email,
        avatar: si.users.avatar,
        saved_date: si.saved_date,
      })),
    };
  },

  // Xóa ảnh (cả trên Cloudinary + DB)
  remove: async function (req) {
    const id = Number(req.params.id);
    if (!id) {
      throw new BadRequestException("ID của ảnh không hợp lệ");
    }

    const user_id = req.user?.id;
    if (!user_id) {
      throw new BadRequestException("Không xác định được người dùng");
    }

    const image = await prisma.images.findUnique({
      where: { id },
    });
    if (!image) {
      throw new BadRequestException("Không tìm thấy ảnh");
    }
    if (image.user_id !== user_id) {
      throw new BadRequestException("Bạn không có quyền xóa ảnh này");
    }

    cloudinary.config({
      cloud_name: CLOUDINARY_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
    });
    await cloudinary.uploader.destroy(image.image_name);

    await prisma.images.delete({
      where: { id },
    });

    return {
      message: "Xóa ảnh thành công",
      image_id: id,
    };
  },

  // Lưu ảnh (ghi vào bảng saved_images với khóa chính (user_id, image_id))
  saveImage: async function (req) {
    const user_id = req.user?.id;
    const image_id = Number(req.params.id);
    if (!user_id || !image_id) {
      throw new BadRequestException("Dữ liệu không hợp lệ");
    }

    // Kiểm tra ảnh tồn tại
    const image = await prisma.images.findUnique({ where: { id: image_id } });
    if (!image) {
      throw new BadRequestException("Không tìm thấy ảnh");
    }

    // Kiểm tra đã lưu chưa
    const already = await prisma.saved_images.findUnique({
      where: {
        user_id_image_id: { user_id, image_id },
      },
    });
    if (already) {
      throw new BadRequestException("Ảnh đã được lưu trước đó");
    }

    await prisma.saved_images.create({
      data: {
        user_id,
        image_id,
        saved_date: new Date(),
      },
    });
    return { message: "Lưu ảnh thành công" };
  },

  // Hủy lưu ảnh
  unSaveImage: async function (req) {
    const user_id = Number(req.user?.id);
    const image_id = Number(req.params.id);
    if (!user_id || !image_id) {
      throw new BadRequestException("Dữ liệu không hợp lệ");
    }

    const already = await prisma.saved_images.findUnique({
      where: {
        user_id_image_id: { user_id, image_id },
      },
    });
    if (!already) {
      throw new BadRequestException("Ảnh chưa được lưu trước đó");
    }

    await prisma.saved_images.delete({
      where: {
        user_id_image_id: { user_id, image_id },
      },
    });
    return { message: "Hủy lưu ảnh thành công" };
  },
};

export default photoService;

import bcrypt from "bcrypt";
import prisma from "../common/prisma/init";
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnprocessableEntityException,
} from "../common/helpers/exception";

const PASSWORD_MIN_LENGTH = 6;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

export const userService = {
  // Tạo mới user
  create: async function (req) {
    const { email, password, full_name, age, avatar } = req.body;

    // Validation
    if (!email) throw new BadRequestException("Missing required field: email");
    if (!password)
      throw new BadRequestException("Missing required field: password");
    if (!full_name)
      throw new BadRequestException("Missing required field: full_name");
    if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      throw new BadRequestException("Invalid email format.");
    if (
      typeof password !== "string" ||
      password.length < PASSWORD_MIN_LENGTH ||
      !PASSWORD_REGEX.test(password)
    )
      throw new BadRequestException(
        `Invalid password: Must be at least ${PASSWORD_MIN_LENGTH} characters long and contain at least one letter and one number.`
      );
    if (typeof full_name !== "string" || full_name.trim() === "")
      throw new BadRequestException("Invalid full_name: Cannot be empty.");
    if (
      avatar !== undefined &&
      avatar !== null &&
      (typeof avatar !== "string" || avatar.trim() === "")
    )
      throw new BadRequestException(
        "Invalid avatar: Must be null or a non-empty string if provided."
      );
    if (!Number.isInteger(age) || age < 0)
      throw new BadRequestException(
        "Invalid age: Must be a non-negative integer."
      );

    try {
      // Kiểm tra email tồn tại
      const exist = await prisma.users.findUnique({
        where: { email },
        select: { id: true },
      });
      if (exist) throw new ConflictException("Email already exists");

      // Hash password
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(password, salt);

      // Tạo user mới
      const newUser = await prisma.users.create({
        data: {
          email,
          password: hashPassword,
          full_name: full_name.trim(),
          age: age,
          avatar: avatar ? avatar.trim() : null,
        },
        select: {
          id: true,
          email: true,
          full_name: true,
          age: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return newUser;
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      console.error("[UserService - Create] Error:", error);
      throw new UnprocessableEntityException(
        "Could not create user due to a server error."
      );
    }
  },

  // Lấy tất cả user (chưa xoá)
  findAll: async function () {
    try {
      const users = await prisma.users.findMany({
        where: { isDeleted: false },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          email: true,
          full_name: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return users;
    } catch (error) {
      console.error("[UserService - FindAll] Error:", error);
      throw new UnprocessableEntityException(
        "Could not retrieve users due to a server error."
      );
    }
  },

  // Lấy 1 user theo ID
  findOne: async function (req) {
    const userId = Number(req.params.id);
    if (!userId || !Number.isInteger(userId) || userId <= 0) {
      throw new BadRequestException(
        "Invalid user ID: Must be a positive integer."
      );
    }

    try {
      const user = await prisma.users.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          full_name: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
          images: {
            select: {
              id: true,
              image_name: true,
              image_url: true,
              description: true,
              createdAt: true,
            },
            orderBy: { createdAt: "desc" },
          },
        },
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      return user;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      console.error("[UserService - FindOne] Error:", error);
      throw new UnprocessableEntityException(
        "Could not retrieve user due to a server error."
      );
    }
  },

  // Cập nhật user
  update: async function (req) {
    const userIdToUpdate = Number(req.params.id);
    const requesterId = req.user?.id;

    if (
      !userIdToUpdate ||
      !Number.isInteger(userIdToUpdate) ||
      userIdToUpdate <= 0
    ) {
      throw new BadRequestException(
        "Invalid user ID: Must be a positive integer."
      );
    }
    if (requesterId !== userIdToUpdate) {
      throw new ForbiddenException("You are not allowed to update this user");
    }

    const { full_name, avatar, password, age } = req.body;
    if (
      full_name === undefined &&
      avatar === undefined &&
      age === undefined &&
      password === undefined
    ) {
      throw new BadRequestException(
        "No update data provided. Provide at least full_name, avatar, or password."
      );
    }

    // Build data object
    const data = { updatedAt: new Date() };
    if (full_name !== undefined) {
      if (typeof full_name !== "string" || full_name.trim() === "") {
        throw new BadRequestException(
          "Invalid full_name: Cannot be empty if provided."
        );
      }
      data.full_name = full_name.trim();
    }
    if (avatar !== undefined) {
      if (
        avatar !== null &&
        (typeof avatar !== "string" || avatar.trim() === "")
      ) {
        throw new BadRequestException(
          "Invalid avatar: Must be null or a non-empty string if provided."
        );
      }
      data.avatar = avatar ? avatar.trim() : null;
    }
    if (password !== undefined) {
      if (
        typeof password !== "string" ||
        password.length < PASSWORD_MIN_LENGTH ||
        !PASSWORD_REGEX.test(password)
      ) {
        throw new BadRequestException(
          `Invalid password: Must be at least ${PASSWORD_MIN_LENGTH} characters long and contain at least one letter and one number.`
        );
      }
      data.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    }

    if (age !== undefined) {
      // age phải là số nguyên không âm
      if (!Number.isInteger(age) || age < 0) {
        throw new BadRequestException(
          "Invalid age: Must be a non-negative integer."
        );
      }
      data.age = age;
    }

    try {
      // Kiểm tra tồn tại user
      const exist = await prisma.users.findUnique({
        where: { id: userIdToUpdate },
        select: { id: true },
      });
      if (!exist) {
        throw new NotFoundException(`User with ID ${userIdToUpdate} not found`);
      }

      // Thực hiện update
      const updated = await prisma.users.update({
        where: { id: userIdToUpdate },
        data,
        select: {
          id: true,
          email: true,
          full_name: true,
          age: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return updated;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      console.error("[UserService - Update] Error:", error);
      throw new UnprocessableEntityException(
        "Could not update user due to a server error."
      );
    }
  },

  // "Xóa" user (soft delete)
  remove: async function (req) {
    const userIdToDelete = Number(req.params.id);
    const requesterId = req.user?.id;

    if (
      !userIdToDelete ||
      !Number.isInteger(userIdToDelete) ||
      userIdToDelete <= 0
    ) {
      throw new BadRequestException(
        "Invalid user ID: Must be a positive integer."
      );
    }
    if (requesterId !== userIdToDelete) {
      throw new ForbiddenException("You are not allowed to delete this user");
    }

    try {
      const exist = await prisma.users.findUnique({
        where: { id: userIdToDelete },
        select: { id: true },
      });
      if (!exist) {
        throw new NotFoundException(`User with ID ${userIdToDelete} not found`);
      }

      await prisma.users.update({
        where: { id: userIdToDelete },
        data: {
          isDeleted: true,
          deletedBy: requesterId,
          deletedAt: new Date(),
        },
      });
      return { id: userIdToDelete };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      console.error("[UserService - Remove] Error:", error);
      throw new UnprocessableEntityException(
        "Could not delete user due to a server error."
      );
    }
  },

  // Lấy danh sách ảnh đã lưu của user
  saveImage: async function (req) {
    const userId = req.user?.id;
    if (!userId) {
      throw new BadRequestException("Missing user context");
    }

    try {
      // Lấy các bản ghi saved_images kèm thông tin ảnh
      const records = await prisma.saved_images.findMany({
        where: { user_id: userId },
        include: {
          images: {
            select: {
              id: true,
              image_name: true,
              image_url: true,
              description: true,
              user_id: true,
              createdAt: true,
            },
          },
        },
        orderBy: { saved_date: "desc" },
      });

      // Map ra mảng ảnh với trường saved_date bên ngoài
      const savedPhotos = records.map((r) => ({
        id: r.images.id,
        image_name: r.images.image_name,
        image_url: r.images.image_url,
        description: r.images.description,
        postedBy: r.images.user_id,
        createdAt: r.images.createdAt,
        savedDate: r.saved_date,
      }));

      return savedPhotos;
    } catch (error) {
      console.error("[UserService - SaveImage] Error:", error);
      throw new UnprocessableEntityException(
        "Could not retrieve saved images due to a server error."
      );
    }
  },
};

export default userService;

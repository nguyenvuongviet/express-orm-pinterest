/**
 * Các thư viện đã cài:
 *
 * 1. express:
 * 2. nodemon: reload lại server khi có sự thay đổi code (.env phải tắt server và mở lại)
 * 3. extensionless: giúp import không cần khóa .js
 * 4. dotenv: thư viện giúp lấy biến trong file .env đưa vào dự án (process.env)
 * 5. chalk: dùng để tạo màu cho console
 * 6. winston: dùng để ghi log
 * 7. morgan: bắt tất cả các API gọi tới BE, dựa vào winston để có log đẹp
 * 8. cors: fix lỗi CORS (Cross-Origin-Resource-Sharing) cho phép domain FE nào sử dụng
 * 9. bcrypt: mã hoá password
 * 10. jsonwebtoken: tạo token
 * 11. prisma: dùng để tương tác với db bằng ORM (giống sequelize)
 * 12. nodemailer: gửi email
 * 13. google-auth-library: dùng để tương tác với google api (đăng nhập bằng gg)
 * 14. swagger-ui-express: dùng để tạo swagger cho api
 * 15. multer: dùng để upload file
 * 16. cloudinary: dùng để upload file với cloudinary
 */

/**
 *  200: Thành công
 *  400: Thất bại
 *  404: Không tìm thấy (not found)
 *  500: Server bi lỗi
 */

/**
 * Cập nhập lại prisma khi thay đổi db
 * npx prisma db pull: lôi tất cả cấu trúc db (table, cột) đưa vào trong file prisma/schema.prisma
 * npx prisma generate: cập nhập object dùng bên trong code, khi sử dụng prisma.
 */

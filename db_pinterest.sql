-- Database
CREATE DATABASE IF NOT EXISTS `db_pinterest`; -- tạo database
DROP DATABASE `db_pinterest`; -- xoá database
USE `db_pinterest`;

-- Table template
CREATE TABLE `TABLE_TEMPLATE` (
	`id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT, -- mặc định luôn luôn có
	
	
	-- mặc định luôn luôn có
	`deletedBy` INT NOT NULL DEFAULT 0,
	`isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
	`deletedAt` TIMESTAMP NULL DEFAULT NULL,
	`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: users
CREATE TABLE `users` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(255),
    `age` INT,
    `avatar` VARCHAR(255),
    `deletedBy` INT NOT NULL DEFAULT 0,
    `isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
    `deletedAt` TIMESTAMP NULL DEFAULT NULL,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: images
CREATE TABLE `images` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `image_name` VARCHAR(255),
    `image_url` VARCHAR(255),
    `description` VARCHAR(255),
    `user_id` INT NOT NULL,
    `deletedBy` INT NOT NULL DEFAULT 0,
    `isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
    `deletedAt` TIMESTAMP NULL DEFAULT NULL,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
);

-- Table: comments
CREATE TABLE `comments` (
    `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `user_id` INT NOT NULL,
    `image_id` INT NOT NULL,
    `comment_date` DATE NOT NULL,
    `content` VARCHAR(255) NOT NULL,
    `deletedBy` INT NOT NULL DEFAULT 0,
    `isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
    `deletedAt` TIMESTAMP NULL DEFAULT NULL,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
    FOREIGN KEY (`image_id`) REFERENCES `images`(`id`)
);

-- Table: saved_images
CREATE TABLE `saved_images` (
    `user_id` INT NOT NULL,
    `image_id` INT NOT NULL,
    `saved_date` DATE NOT NULL,
    `deletedBy` INT NOT NULL DEFAULT 0,
    `isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
    `deletedAt` TIMESTAMP NULL DEFAULT NULL,
    `createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`user_id`, `image_id`),
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
    FOREIGN KEY (`image_id`) REFERENCES `images`(`id`)
);

-- Thêm người dùng vào bảng users
INSERT INTO users (email, password, full_name, age, avatar) VALUES
('user1@example.com', '$2b$10$XGGBUqazGREbq0cwYQeQXuhiv.mjvxrR0YBEn4RPZaPzErVbmwq9q', 'Nguyễn Văn A', 25, 'avatar1.jpg'),
('user2@example.com', '$2b$10$XGGBUqazGREbq0cwYQeQXuhiv.mjvxrR0YBEn4RPZaPzErVbmwq9q', 'Trần Thị B', 30, 'avatar2.jpg'),
('user3@example.com', '$2b$10$XGGBUqazGREbq0cwYQeQXuhiv.mjvxrR0YBEn4RPZaPzErVbmwq9q', 'Lê Văn C', 28, 'avatar3.jpg');

-- Thêm hình ảnh vào bảng images
INSERT INTO images (image_name, image_url, description, user_id) VALUES
('Sunset', 'sunset.jpg', 'A beautiful sunset', 1),
('Mountain', 'mountain.jpg', 'Snowy mountain peak', 2),
('Ocean', 'ocean.jpg', 'Waves crashing on the shore', 3);

-- Thêm bình luận vào bảng comments
INSERT INTO comments (user_id, image_id, comment_date, content) VALUES
(1, 2, '2025-04-29', 'Tuyệt đẹp!'),
(2, 3, '2025-04-29', 'Thật yên bình'),
(3, 1, '2025-04-29', 'Mình thích bức ảnh này!');
(1, 1, '2025-04-29', 'Bức ảnh này rất đẹp!');

-- Thêm ảnh đã lưu vào bảng saved_images
INSERT INTO saved_images (user_id, image_id, saved_date) VALUES
(1, 3, '2025-04-29'),
(2, 1, '2025-04-29'),
(3, 2, '2025-04-29');
(1, 2, '2025-04-29'),


-- -------------------------------------------------------------
-- TablePlus 6.4.4(604)
--
-- https://tableplus.com/
--
-- Database: db_pinterest
-- Generation Time: 2025-05-10 21:21:47.6180
-- -------------------------------------------------------------


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `image_id` int NOT NULL,
  `comment_date` date NOT NULL,
  `content` varchar(255) NOT NULL,
  `deletedBy` int NOT NULL DEFAULT '0',
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `deletedAt` timestamp NULL DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `image_id` (`image_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`image_id`) REFERENCES `images` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `images`;
CREATE TABLE `images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `image_name` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `user_id` int NOT NULL,
  `deletedBy` int NOT NULL DEFAULT '0',
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `deletedAt` timestamp NULL DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `images_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `saved_images`;
CREATE TABLE `saved_images` (
  `user_id` int NOT NULL,
  `image_id` int NOT NULL,
  `saved_date` date NOT NULL,
  `deletedBy` int NOT NULL DEFAULT '0',
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `deletedAt` timestamp NULL DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`image_id`),
  KEY `image_id` (`image_id`),
  CONSTRAINT `saved_images_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `saved_images_ibfk_2` FOREIGN KEY (`image_id`) REFERENCES `images` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `age` int DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `deletedBy` int NOT NULL DEFAULT '0',
  `isDeleted` tinyint(1) NOT NULL DEFAULT '0',
  `deletedAt` timestamp NULL DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `comments` (`id`, `user_id`, `image_id`, `comment_date`, `content`, `deletedBy`, `isDeleted`, `deletedAt`, `createdAt`, `updatedAt`) VALUES
(1, 1, 2, '2025-04-29', 'Tuyệt đẹp!', 0, 0, NULL, '2025-04-29 11:00:04', '2025-04-29 11:00:04'),
(2, 2, 3, '2025-04-29', 'Thật yên bình', 0, 0, NULL, '2025-04-29 11:00:04', '2025-04-29 11:00:04'),
(3, 3, 1, '2025-04-29', 'Mình thích bức ảnh này!', 0, 0, NULL, '2025-04-29 11:00:04', '2025-04-29 11:00:04'),
(4, 1, 1, '2025-04-29', 'Bức ảnh này rất đẹp!', 0, 0, NULL, '2025-05-02 09:54:44', '2025-05-02 09:54:44'),
(5, 1, 3, '2025-05-02', 'Bạn chụp tấm ảnh này thật đẹp!', 0, 0, NULL, '2025-05-02 15:02:08', '2025-05-02 15:02:08'),
(6, 1, 3, '2025-05-02', 'Tuyệt đẹp luôn', 0, 0, NULL, '2025-05-02 15:24:44', '2025-05-02 15:24:44'),
(7, 2, 3, '2025-05-10', 'Tuyệt đẹp luôn', 0, 0, NULL, '2025-05-10 13:59:09', '2025-05-10 13:59:09'),
(8, 1, 3, '2025-05-10', 'Tuyệt đẹp luôn', 0, 0, NULL, '2025-05-10 14:08:14', '2025-05-10 14:08:14'),
(9, 1, 3, '2025-05-10', 'Tuyệt đẹp luôn', 0, 0, NULL, '2025-05-10 14:12:37', '2025-05-10 14:12:37');

INSERT INTO `images` (`id`, `image_name`, `image_url`, `description`, `user_id`, `deletedBy`, `isDeleted`, `deletedAt`, `createdAt`, `updatedAt`) VALUES
(1, 'Sunset', 'sunset.jpg', 'A beautiful sunset', 1, 0, 0, NULL, '2025-04-29 11:00:04', '2025-05-02 09:21:20'),
(2, 'Mountain', 'mountain.jpg', 'Snowy mountain peak', 2, 0, 0, NULL, '2025-04-29 11:00:04', '2025-05-02 09:38:59'),
(3, 'Ocean', 'ocean.jpg', 'Waves crashing on the shore', 3, 0, 0, NULL, '2025-04-29 11:00:04', '2025-04-29 11:00:04');

INSERT INTO `saved_images` (`user_id`, `image_id`, `saved_date`, `deletedBy`, `isDeleted`, `deletedAt`, `createdAt`, `updatedAt`) VALUES
(1, 1, '2025-04-29', 0, 0, NULL, '2025-05-06 07:41:37', '2025-05-06 07:41:37'),
(1, 2, '2025-04-30', 0, 0, NULL, '2025-05-06 07:41:37', '2025-05-06 07:41:37'),
(1, 3, '2025-04-29', 0, 0, NULL, '2025-04-29 11:00:04', '2025-04-29 11:00:04'),
(2, 1, '2025-04-29', 0, 0, NULL, '2025-04-29 11:00:04', '2025-04-29 11:00:04'),
(3, 2, '2025-04-29', 0, 0, NULL, '2025-04-29 11:00:04', '2025-04-29 11:00:04');

INSERT INTO `users` (`id`, `email`, `password`, `full_name`, `age`, `avatar`, `deletedBy`, `isDeleted`, `deletedAt`, `createdAt`, `updatedAt`) VALUES
(1, 'user1@example.com', '$2b$10$XGGBUqazGREbq0cwYQeQXuhiv.mjvxrR0YBEn4RPZaPzErVbmwq9q', 'Nguyễn Văn A', 25, 'avatar1.jpg', 0, 0, NULL, '2025-04-29 11:00:04', '2025-05-02 14:44:43'),
(2, 'user2@example.com', '$2b$10$XGGBUqazGREbq0cwYQeQXuhiv.mjvxrR0YBEn4RPZaPzErVbmwq9q', 'Trần Thị B', 30, 'avatar2.jpg', 0, 0, NULL, '2025-04-29 11:00:04', '2025-05-02 14:44:43'),
(3, 'user3@example.com', '$2b$10$XGGBUqazGREbq0cwYQeQXuhiv.mjvxrR0YBEn4RPZaPzErVbmwq9q', 'Lê Văn C', 28, 'avatar3.jpg', 0, 0, NULL, '2025-04-29 11:00:04', '2025-05-02 14:44:43'),
(4, 'vieet@gmai.com', '$2b$10$XGGBUqazGREbq0cwYQeQXuhiv.mjvxrR0YBEn4RPZaPzErVbmwq9q', 'vieet', 22, NULL, 0, 0, NULL, '2025-04-29 11:00:39', '2025-04-29 11:00:39'),
(5, 'viet@gmai.com', '$2b$10$oGv31GGyF/MgM3VqPMkTAueomiwMFW.ZG4hFZ..5tWOGly/pRX4vO', 'viet', 21, NULL, 0, 0, NULL, '2025-05-03 18:34:14', '2025-05-03 18:34:14'),
(6, 'vieeet@gmai.com', '$2b$10$zuYLHDU1D2tCFFVUvP.jAu80O87oERUTLIQmR/4/R7b7KZVoGxH9u', 'viet', 21, NULL, 0, 0, NULL, '2025-05-10 14:00:02', '2025-05-10 14:00:02'),
(7, 'viet1@gmai.com', '$2b$10$39nw9JaURytnZ.7GFE77iuFBTIm.U/PQtyp1LI8hECM9DOOP8oeyi', 'viet', 21, NULL, 0, 0, NULL, '2025-05-10 14:07:19', '2025-05-10 14:07:19'),
(8, 'viet2@gmai.com', '$2b$10$Ne01kk0GgccvWy8K8uakoOYiIX6zgFZrudaqFo0QXJtSDLCi3PtXq', 'viet', 21, NULL, 0, 0, NULL, '2025-05-10 14:11:47', '2025-05-10 14:11:47');



/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
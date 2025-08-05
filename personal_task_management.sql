-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: אוגוסט 05, 2025 בזמן 11:15 PM
-- גרסת שרת: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `personal_task_management`
--

-- --------------------------------------------------------

--
-- מבנה טבלה עבור טבלה `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- הוצאת מידע עבור טבלה `categories`
--

INSERT INTO `categories` (`id`, `user_id`, `name`) VALUES
(7, 1, 'קטגוריה חדשה '),
(8, 1, 'AYALA'),
(9, 1, 'AYALA'),
(10, 1, 'תוכנה'),
(11, 4, 'סיום');

-- --------------------------------------------------------

--
-- מבנה טבלה עבור טבלה `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `description` varchar(200) NOT NULL,
  `due_date` date NOT NULL,
  `is_completed` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- הוצאת מידע עבור טבלה `tasks`
--

INSERT INTO `tasks` (`id`, `user_id`, `category_id`, `description`, `due_date`, `is_completed`) VALUES
(1, 1, 10, 'לסיים עם הקבוצות הקבועות ', '2025-08-06', 0),
(2, 1, 8, 'מטלת סוף קורס NODE JS SSR', '2025-08-05', 1),
(3, 1, 8, 'מקה ג\'ה', '2025-08-06', 0),
(4, 1, 8, 'bjhbhkhjkvjdddddddddddddddddd', '2025-08-01', 0),
(5, 1, 9, 'לסיים עם המשימות ', '2025-08-17', 0),
(6, 1, 7, 'לחנחיצמ', '2025-08-08', 0),
(7, 1, 7, 'לחנ2חיהנגצמ/הקגבד', '2025-08-18', 0),
(8, 1, 7, 'ע\\\'כדנגכ', '2025-08-28', 0),
(9, 1, 7, 'א', '2025-08-16', 0),
(10, 1, 7, 'אא', '2025-08-11', 0),
(11, 1, 7, 'טאנרכה', '2025-09-01', 0),
(12, 1, 9, 'ראקכהדג', '2025-08-07', 0),
(13, 4, 11, 'מטלת סוף קורס NODE JS SSR', '2025-08-07', 0);

-- --------------------------------------------------------

--
-- מבנה טבלה עבור טבלה `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `uname` varchar(100) NOT NULL,
  `passwd` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- הוצאת מידע עבור טבלה `users`
--

INSERT INTO `users` (`id`, `name`, `uname`, `passwd`) VALUES
(1, 'איילה ליאל כהן ', 'AYALA', 'c21e60a646cfac97336afad99d56701d'),
(2, 'אליה כהן ', 'ELIYA', 'c21e60a646cfac97336afad99d56701d'),
(4, 'איילה ליאל כהן חלק ', 'AYALALIEL', '79d30dda234c4a21437355e812d7357e');

--
-- Indexes for dumped tables
--

--
-- אינדקסים לטבלה `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- אינדקסים לטבלה `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `category_id` (`category_id`);

--
-- אינדקסים לטבלה `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uname` (`uname`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- הגבלות לטבלאות שהוצאו
--

--
-- הגבלות לטבלה `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- הגבלות לטבלה `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tasks_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

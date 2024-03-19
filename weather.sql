-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 10, 2024 at 10:14 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `weather`
--

-- --------------------------------------------------------

--
-- Table structure for table `weather`
--

CREATE TABLE `weather` (
  `city` varchar(20) DEFAULT NULL,
  `temperature` int(11) DEFAULT NULL,
  `humidity` int(11) DEFAULT NULL,
  `pressure` int(11) DEFAULT NULL,
  `description` varchar(20) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `wind_speed` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `weather`
--

INSERT INTO `weather` (`city`, `temperature`, `humidity`, `pressure`, `description`, `date`, `wind_speed`) VALUES
('Silchar', 22, 48, 1012, 'clear sky', '2024-01-26', 1.6),
('Silchar', 20, 38, 1040, 'sunny', '2024-01-27', 1.3),
('Silchar', 25, 29, 1015, 'clear sky', '2024-01-28', 2.32),
('Silchar', 14, 53, 1018, 'clear sky', '2024-01-29', 0.96),
('Silchar', 24, 33, 1017, 'clear sky', '2024-01-30', 1.55),
('Silchar', 17, 59, 1017, 'overcast clouds', '2024-01-31', 1.59),
('Hehe', 4, 89, 1028, 'light rain', '2024-02-01', 7.84),
('Kathmandu', 10, 81, 1021, 'mist', '2024-02-01', 1.54),
('Japan', 9, 41, 1013, 'broken clouds', '2024-02-01', 10.29),
('Cad', 24, 14, 1015, 'overcast clouds', '2024-02-01', 3.07),
('London', 3, 83, 1032, 'overcast clouds', '2024-02-01', 2.68),
('Seoul', 6, 49, 1025, 'haze', '2024-02-01', 3.6),
('Tokyo', 12, 35, 1012, 'broken clouds', '2024-02-01', 8.75),
('Silchar', 20, 53, 1019, 'clear sky', '2024-02-01', 1.99),
('Silchar', 16, 55, 1016, 'clear sky', '2024-02-03', 1.4),
('Silchar', 18, 51, 1016, 'broken clouds', '2024-02-05', 1.15),
('Silchar', 22, 38, 1020, 'clear sky', '2024-02-10', 1.7);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

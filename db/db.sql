/* This file contains SQL for cleaning_service database */

DROP DATABASE IF EXISTS `cleaning_service`;

CREATE DATABASE `cleaning_service`;

-- Switch to cleaning_service db
USE `cleaning_service`;

-- Create the admin table
CREATE TABLE `admins` (
  `id` INT(3) AUTO_INCREMENT,
  `email_address` VARCHAR(40) NOT NULL,
  `password` VARCHAR(60) NOT NULL,
  `username` VARCHAR(60) NOT NULL,
  `userType` INT(3) DEFAULT 0,

  CONSTRAINT `admin_pk` PRIMARY KEY (`id`),
  CONSTRAINT `admin_email_un` UNIQUE (`email_address`)
) ENGINE=InnoDB AUTO_INCREMENT=1 CHARSET=utf8;

-- Creates the customers table
CREATE TABLE `customers` (
  `id` INT(3) AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email_address` VARCHAR(30) NOT NULL,
  `phone_no` VARCHAR(13),
  `address` VARCHAR(200) NOT NULL,
  `password` VARCHAR(60) NOT NULL,
  `userType` INT(3) DEFAULT 1,

  CONSTRAINT `customer_pk` PRIMARY KEY (`id`)
)ENGINE=InnoDB AUTO_INCREMENT=1 CHARSET=utf8;

-- Creates the services table
CREATE TABLE `services` (
  `id` INT(3) AUTO_INCREMENT,
  `name` VARCHAR(40) NOT NULL UNIQUE,
  `amount` DECIMAL(8,2) NOT NULL,

  CONSTRAINT `services_pk` PRIMARY KEY (`id`)
)ENGINE=InnoDB AUTO_INCREMENT=1 CHARSET=utf8;

-- Creates the bookings table
CREATE TABLE `bookings` (
  `id` INT(3) AUTO_INCREMENT,
  `service_id` INT(3),
  `customer_id` INT(3),

  CONSTRAINT `booking_pk` PRIMARY KEY (`id`),
  CONSTRAINT `bookings_services_fk` FOREIGN KEY (`service_id`) REFERENCES `services`(`id`),
  CONSTRAINT `bookings_customers_fk`FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`)
)ENGINE=InnoDB AUTO_INCREMENT=1 CHARSET=utf8;

-- Creates the transactions table
CREATE TABLE `transactions` (
  `id` INT(3) AUTO_INCREMENT,
  `booking_id` INT(3),
  `stripe_token` VARCHAR(60),
  `created_at` Timestamp,

  CONSTRAINT `transactions_pk` PRIMARY KEY (`id`),
  CONSTRAINT `transactions_booking_fk` FOREIGN KEY(`booking_id`) REFERENCES `bookings` (`id`)
)ENGINE=InnoDB AUTO_INCREMENT=1 CHARSET=utf8;


-- insert data into services
INSERT INTO `services` (`id`, `name`, `amount`) VALUES
(1, 'One-Off Deep Cleaning', '45000.00'),
(2, 'Finished Buildings', '45000.00'),
(3, 'Carpet Cleaning', '21500.00'),
(4, 'Upholstery Cleaning', '15500.00'),
(5, 'End Of Tenancy', '35000.00'),
(6, 'Studio Cleaning', '20000.00'),
(7, 'Pest Control And Fumigation', '67500.00'),
(8, 'Washing And Lundery', '7500.00');
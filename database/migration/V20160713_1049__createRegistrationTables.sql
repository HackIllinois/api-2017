ALTER TABLE `users` ADD (
  `first_name` VARCHAR(255) NOT NULL,
  `last_name` VARCHAR(255) NOT NULL
);

CREATE TABLE `organizations` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `tier` ENUM('Tier1', 'Tier2', 'Tier3', 'Tier4', 'Tier5') NOT NULL,
  `created` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC)
);

CREATE TABLE `teams` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `size` TINYINT UNSIGNED NOT NULL,
  `created` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC)
);

CREATE TABLE `teams_users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `team_id` INT UNSIGNED NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `admins`(
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `tshirt_size` ENUM('XS', 'S', 'M', 'L', 'XL', 'XXL') NOT NULL,
  `created` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `user_id_UNIQUE` (`user_id` ASC),
  FOREIGN KEY (user_id) REFERENCES `users`(id)
);

CREATE TABLE `staff`(
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `tshirt_size` ENUM('XS', 'S', 'M', 'L', 'XL', 'XXL') NOT NULL,
  `created` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `user_id_UNIQUE` (`user_id` ASC),
  FOREIGN KEY (user_id) REFERENCES `users`(id)
);

CREATE TABLE `volunteers`(
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `tshirt_size` ENUM('XS', 'S', 'M', 'L', 'XL', 'XXL') NOT NULL,
  `created` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `user_id_UNIQUE` (`user_id` ASC),
  FOREIGN KEY (user_id) REFERENCES `users`(id)
);

CREATE TABLE `sponsors`(
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `organization_id` INT UNSIGNED NOT NULL,
  `tshirt_size` ENUM('XS', 'S', 'M', 'L', 'XL', 'XXL') NOT NULL,
  `created` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `user_id_UNIQUE` (`user_id` ASC),
  FOREIGN KEY (user_id) REFERENCES `users`(id),
  FOREIGN KEY (organization_id) REFERENCES `organizations`(id)
);

CREATE TABLE `mentors`(
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `organization_id` INT UNSIGNED NOT NULL,
  `tshirt_size` ENUM('XS', 'S', 'M', 'L', 'XL', 'XXL') NOT NULL,
  `created` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `user_id_UNIQUE` (`user_id` ASC),
  FOREIGN KEY (user_id) REFERENCES `users`(id),
  FOREIGN KEY (organization_id) REFERENCES `organizations`(id)
);


CREATE TABLE `hackers`(
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `created` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  `age` TINYINT UNSIGNED,
  `gender` ENUM('NONE', 'MALE', 'FEMALE', 'NON_BINARY', 'OTHER'),
  `school` VARCHAR(255),
  `graduation_year` SMALLINT UNSIGNED,
  `major` VARCHAR(255),
  `diet` ENUM('NONE', 'VEGETARIAN', 'VEGAN', 'GLUTEN_FREE'),
  #`resume` = ndb.BlobKeyProperty(required=True)
  #`resume_filename` = ndb.StringProperty(required=True, indexed=False)
  `professional_interest` ENUM('NONE', 'FULL_TIME', 'INTERNSHIP', 'BOTH'),
  `linkedin_url` VARCHAR(255),
  `github_url` VARCHAR(255),
  `site_url` VARCHAR(255),
  `hackathon_attendance` ENUM('0', '1-5', '5+'),
  `initiatives` SET('SOFTWARE', 'HARDWARE', 'OPEN_SOURCE'),
  `hardware_desired` VARCHAR(255),
  `open_source_interests` VARCHAR(255),
  `extra_information` VARCHAR(255),
  `tshirt_size` ENUM('XS', 'S', 'M', 'L', 'XL', 'XXL') NOT NULL,

  PRIMARY KEY (`id`),
  UNIQUE INDEX `user_id_UNIQUE` (`user_id` ASC),
  FOREIGN KEY (user_id) REFERENCES `users`(id)
);

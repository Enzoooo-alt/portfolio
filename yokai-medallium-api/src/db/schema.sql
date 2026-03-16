CREATE DATABASE IF NOT EXISTS yokai_medallium CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE yokai_medallium;

CREATE TABLE IF NOT EXISTS yokai (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  tribe VARCHAR(120) NULL,
  rank_code VARCHAR(20) NULL,
  medal_number VARCHAR(60) NULL,
  description_text MEDIUMTEXT NULL,
  image_url TEXT NULL,
  medal_image_url TEXT NULL,
  wiki_url TEXT NULL,
  source_name VARCHAR(120) NOT NULL DEFAULT 'Yo-kai Watch Wiki',
  metadata_json JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_yokai_name (name),
  INDEX idx_yokai_tribe (tribe),
  INDEX idx_yokai_rank (rank_code)
);

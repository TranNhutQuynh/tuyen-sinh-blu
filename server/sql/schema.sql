CREATE DATABASE IF NOT EXISTS tuyensinh_baclieu
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE tuyensinh_baclieu;

CREATE TABLE IF NOT EXISTS admins (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  full_name VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS registration_periods (
  id INT PRIMARY KEY AUTO_INCREMENT,
  period_name VARCHAR(255) NOT NULL,
  start_at DATETIME NOT NULL,
  end_at DATETIME NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS candidates (
  id INT PRIMARY KEY AUTO_INCREMENT,
  application_code VARCHAR(50) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  national_id VARCHAR(50) NOT NULL,
  birth_date DATE NULL,
  gender VARCHAR(20) NULL,
  phone VARCHAR(30) NULL,
  email VARCHAR(255) NULL,
  graduation_year VARCHAR(10) NULL,
  exam_number VARCHAR(50) NULL,
  ethnic_code VARCHAR(30) NULL,
  ethnic_name VARCHAR(255) NULL,
  priority_object_code VARCHAR(30) NULL,
  priority_area_code VARCHAR(30) NULL,
  school_code VARCHAR(50) NULL,
  school_name VARCHAR(255) NULL,
  birth_place VARCHAR(255) NULL,
  province_code VARCHAR(50) NULL,
  district_code VARCHAR(50) NULL,
  ward_code VARCHAR(50) NULL,
  personal_info_json JSON NULL,
  thpt_exam_json JSON NULL,
  report_card_json JSON NULL,
  gdnl_json JSON NULL,
  vsat_json JSON NULL,
  registration_period_id INT NULL,
  registration_period_name VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_candidates_registration_period
    FOREIGN KEY (registration_period_id) REFERENCES registration_periods(id)
    ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS candidate_preferences (
  id INT PRIMARY KEY AUTO_INCREMENT,
  candidate_id INT NOT NULL,
  priority_order INT NULL,
  institution_code VARCHAR(50) NULL,
  institution_name VARCHAR(255) NULL,
  major_code VARCHAR(50) NULL,
  major_name VARCHAR(255) NULL,
  admission_method_code VARCHAR(50) NULL,
  admission_method_name VARCHAR(255) NULL,
  method_standard_code VARCHAR(50) NULL,
  method_standard_name VARCHAR(255) NULL,
  admission_type_code VARCHAR(50) NULL,
  subject_combination_code VARCHAR(50) NULL,
  foreign_language_subject_code VARCHAR(50) NULL,
  foreign_language_score VARCHAR(50) NULL,
  extra_subject_code VARCHAR(50) NULL,
  extra_subject_score VARCHAR(50) NULL,
  aspiration_month_rank VARCHAR(50) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_candidate_preferences_candidate
    FOREIGN KEY (candidate_id) REFERENCES candidates(id)
    ON DELETE CASCADE,
  CONSTRAINT uq_candidate_preference_order
    UNIQUE (candidate_id, priority_order)
);

CREATE TABLE IF NOT EXISTS high_schools (
  id INT PRIMARY KEY AUTO_INCREMENT,
  school_code VARCHAR(50) NOT NULL UNIQUE,
  school_name VARCHAR(255) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admission_majors (
  id INT PRIMARY KEY AUTO_INCREMENT,
  major_code VARCHAR(50) NOT NULL UNIQUE,
  major_name VARCHAR(255) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subject_combinations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  combination_code VARCHAR(50) NOT NULL UNIQUE,
  combination_name VARCHAR(255) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admission_methods (
  id INT PRIMARY KEY AUTO_INCREMENT,
  method_code VARCHAR(50) NOT NULL UNIQUE,
  method_name VARCHAR(255) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


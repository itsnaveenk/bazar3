CREATE DATABASE IF NOT EXISTS satta_prod;
USE satta_prod;

CREATE TABLE teams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  announcement_time TIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  team_id INT NOT NULL,
  result_date DATE NOT NULL,
  result VARCHAR(10) NOT NULL,
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
  UNIQUE KEY uniq_team_date (team_id, result_date)
);

CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  access_key CHAR(64) UNIQUE NOT NULL,
  argon2_hash TEXT NOT NULL,
  session_token CHAR(64),
  is_active BOOLEAN DEFAULT TRUE,
  last_access TIMESTAMP
);
-- Employee Management System Database Schema
-- MariaDB 10.11

USE employee_db;

-- Create employee table with hierarchical structure
CREATE TABLE employee (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(64) NOT NULL,
    last_name VARCHAR(64) NOT NULL,
    position VARCHAR(64),
    email VARCHAR(128) UNIQUE NOT NULL,
    home_phone VARCHAR(32),
    notes TEXT,
    manager_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Foreign key constraint
    CONSTRAINT fk_employee_manager 
        FOREIGN KEY (manager_id) 
        REFERENCES employee(id) 
        ON DELETE SET NULL
);

-- Create indexes for performance
CREATE INDEX idx_employee_manager_id ON employee(manager_id);
CREATE INDEX idx_employee_name ON employee(last_name, first_name);
CREATE INDEX idx_employee_email ON employee(email);

-- Additional indexes for search operations
CREATE INDEX idx_employee_first_name ON employee(first_name);
CREATE INDEX idx_employee_last_name ON employee(last_name);
CREATE INDEX idx_employee_position ON employee(position);

-- Composite indexes for common search patterns
CREATE INDEX idx_employee_name_position ON employee(first_name, last_name, position);
CREATE INDEX idx_employee_search_fields ON employee(first_name, last_name, email, position);

-- Full-text search index for better text searching performance
CREATE FULLTEXT INDEX idx_employee_fulltext ON employee(first_name, last_name, position);

-- Create admin user table for JWT authentication
CREATE TABLE admin_user (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(64) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (password: password)
INSERT INTO admin_user (username, password_hash) 
VALUES ('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Create migration table for Yii2
CREATE TABLE migration (
    version VARCHAR(180) PRIMARY KEY,
    apply_time INT
);

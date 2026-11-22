-- ============================================================================
-- CAMPUS SKILL AND SERVICE EXCHANGE SYSTEM (CampusConnect)
-- Course: Advanced Java Programming / Web Technologies
-- Team: CodeMates
-- Database: MySQL Relational Database
-- ============================================================================

-- Create Database if not exists
CREATE DATABASE IF NOT EXISTS campus_connect;
USE campus_connect;

-- Disable foreign key checks during drop for safe recreation if re-running
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS requests;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS students;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- TABLE 1: students
-- Stores profile and authentication information for college students and admins.
-- ============================================================================
CREATE TABLE students (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    college VARCHAR(150) NOT NULL,
    bio TEXT,
    role VARCHAR(20) DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLE 2: skills
-- Stores both offered skills (teaching) and wanted skills (learning).
-- Distinguised by the 'type' column: 'offered' or 'wanted'.
-- ============================================================================
CREATE TABLE skills (
    skill_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    type ENUM('offered', 'wanted') NOT NULL,
    experience_level VARCHAR(50), -- e.g. Beginner, Intermediate, Advanced
    availability VARCHAR(100),   -- e.g. Weekends, Evenings, 5-7 PM
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_skills_student
        FOREIGN KEY (student_id) REFERENCES students(student_id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_skills_student ON skills(student_id);
CREATE INDEX idx_skills_type ON skills(type);
CREATE INDEX idx_skills_name ON skills(skill_name);

-- ============================================================================
-- TABLE 3: services
-- Stores campus services offered by students (e.g., Note Sharing, Tutoring).
-- ============================================================================
CREATE TABLE services (
    service_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    service_name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    availability VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_services_student
        FOREIGN KEY (student_id) REFERENCES students(student_id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_services_student ON services(student_id);

-- ============================================================================
-- TABLE 4: requests
-- Stores exchange requests between students for skills or services.
-- Tracks current request status (pending, accepted, rejected, cancelled, completed).
-- ============================================================================
CREATE TABLE requests (
    request_id INT PRIMARY KEY AUTO_INCREMENT,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    skill_id INT NULL,
    service_id INT NULL,
    request_type ENUM('skill', 'service') NOT NULL,
    description TEXT,
    status ENUM('pending', 'accepted', 'rejected', 'cancelled', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_requests_sender
        FOREIGN KEY (sender_id) REFERENCES students(student_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_requests_receiver
        FOREIGN KEY (receiver_id) REFERENCES students(student_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_requests_skill
        FOREIGN KEY (skill_id) REFERENCES skills(skill_id)
        ON DELETE SET NULL,
    CONSTRAINT fk_requests_service
        FOREIGN KEY (service_id) REFERENCES services(service_id)
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_requests_sender ON requests(sender_id);
CREATE INDEX idx_requests_receiver ON requests(receiver_id);
CREATE INDEX idx_requests_status ON requests(status);


-- ============================================================================
-- SAMPLE DATA (For quick testing and demonstration in College Viva)
-- Default passwords are all: "Password123" (hashed with bcrypt)
-- ============================================================================

-- Insert sample students (including 1 Admin account)
-- bcrypt hash for "Password123": $2a$10$wO08c3qVpBfJ1kO7i1YfMeO4kG0vW2hI3dO7YwUfL4xVpC5eK0/1e
-- For clean portability across machines, these sample records are pre-hashed.
INSERT INTO students (student_id, name, email, password, department, year, college, bio, role) VALUES
(1, 'Admin User', 'admin@campusconnect.edu', '$2a$10$f34g25K1p9M.hLqW0pQ5h.e17a3aX5VfJzYw.fO1Kz6rWbJg6F4b.', 'Computer Science', 4, 'Tech University', 'System Administrator for CampusConnect.', 'admin'),
(2, 'Aarav Sharma', 'aarav@campusconnect.edu', '$2a$10$f34g25K1p9M.hLqW0pQ5h.e17a3aX5VfJzYw.fO1Kz6rWbJg6F4b.', 'Computer Science & Engineering', 2, 'Tech University', 'Passionate about Python programming, data structures, and competitive coding.', 'student'),
(3, 'Priya Patel', 'priya@campusconnect.edu', '$2a$10$f34g25K1p9M.hLqW0pQ5h.e17a3aX5VfJzYw.fO1Kz6rWbJg6F4b.', 'Information Technology', 3, 'Tech University', 'UI/UX designer and frontend web enthusiast. Loves Figma and React.', 'student'),
(4, 'Rohan Verma', 'rohan@campusconnect.edu', '$2a$10$f34g25K1p9M.hLqW0pQ5h.e17a3aX5VfJzYw.fO1Kz6rWbJg6F4b.', 'Electronics & Communication', 2, 'Tech University', 'Java programmer learning backend architecture. Also enjoys campus photography.', 'student'),
(5, 'Sneha Kulkarni', 'sneha@campusconnect.edu', '$2a$10$f34g25K1p9M.hLqW0pQ5h.e17a3aX5VfJzYw.fO1Kz6rWbJg6F4b.', 'Mechanical Engineering', 3, 'Tech University', 'Expert in CAD modeling, mathematics tutoring, and technical report writing.', 'student');

-- Insert sample skills
-- Aarav offers Python & C++, wants Java & UI/UX
INSERT INTO skills (skill_id, student_id, skill_name, category, description, type, experience_level, availability) VALUES
(1, 2, 'Python Programming', 'Programming', 'Can teach Python basics, OOP concepts, automation scripts, and problem solving.', 'offered', 'Advanced', 'Weekdays 5 PM - 7 PM'),
(2, 2, 'C++ Data Structures', 'Programming', 'Can explain linked lists, trees, graphs, and algorithm time complexity.', 'offered', 'Intermediate', 'Saturday afternoons'),
(3, 2, 'Java Programming', 'Programming', 'Looking to learn Core Java, collections framework, and OOP for semester exams.', 'wanted', NULL, NULL),
(4, 2, 'Figma UI/UX Design', 'Designing', 'Want to learn design principles and Figma wireframing for web apps.', 'wanted', NULL, NULL);

-- Priya offers Figma Design & Web Development, wants Python
INSERT INTO skills (skill_id, student_id, skill_name, category, description, type, experience_level, availability) VALUES
(5, 3, 'Figma UI/UX Design', 'Designing', 'Proficient in UI design systems, interactive prototypes, and modern layouts.', 'offered', 'Advanced', 'Weekends anytime'),
(6, 3, 'React & Frontend', 'Web Development', 'Can assist in React component basics, Tailwind CSS styling, and responsive UI.', 'offered', 'Intermediate', 'Tuesday and Thursday evenings'),
(7, 3, 'Python Programming', 'Programming', 'Want to learn Python for data analysis and scripting.', 'wanted', NULL, NULL);

-- Rohan offers Java Programming & Photography, wants Web Development
INSERT INTO skills (skill_id, student_id, skill_name, category, description, type, experience_level, availability) VALUES
(8, 4, 'Java Programming', 'Programming', 'Good grasp of Java OOP, multithreading, and JDBC basics. Happy to teach!', 'offered', 'Intermediate', 'Mon/Wed 4 PM - 6 PM'),
(9, 4, 'Campus Photography', 'Photography', 'Can guide on DSLR manual mode, portrait framing, and Lightroom color grading.', 'offered', 'Advanced', 'Sunday mornings'),
(10, 4, 'React & Frontend', 'Web Development', 'Looking to learn React and modern JavaScript frontend development.', 'wanted', NULL, NULL);

-- Sneha offers CAD Modeling & Math Tutoring
INSERT INTO skills (skill_id, student_id, skill_name, category, description, type, experience_level, availability) VALUES
(11, 5, 'Engineering Mathematics', 'Academics', 'Can help clear doubts in calculus, differential equations, and linear algebra.', 'offered', 'Advanced', 'Daily 6 PM - 8 PM'),
(12, 5, 'AutoCAD 3D Modeling', 'Designing', 'Can teach basic 2D drawings and 3D mechanical part modeling.', 'offered', 'Intermediate', 'Flexible'),
(13, 5, 'C++ Data Structures', 'Programming', 'Eager to learn DSA in C++ to prepare for placements.', 'wanted', NULL, NULL);

-- Insert sample services
INSERT INTO services (service_id, student_id, service_name, category, description, availability) VALUES
(1, 2, 'Python Project Troubleshooting & Debugging', 'Tutoring', 'I can help you debug syntax bugs, virtual environment issues, and logic errors in Python projects.', 'Weekdays after 6 PM'),
(2, 3, 'College Event Poster & Brochure Design', 'Poster Designing', 'High-quality posters for hackathons, club fests, and cultural events made in Figma/Canva.', '2-3 days prior notice'),
(3, 4, 'Fest & Club Event Photography', 'Photography', 'Available to cover departmental workshops, guest talks, and sports fests with DSLR camera.', 'College fest days / Weekends'),
(4, 5, 'Engineering Mathematics Handwritten Notes', 'Notes Sharing', 'Neat, indexed handwritten notes covering Calculus, Matrix Theory, and Transform Calculus.', 'Available on demand as PDF');

-- Insert sample exchange requests
INSERT INTO requests (request_id, sender_id, receiver_id, skill_id, service_id, request_type, description, status) VALUES
(1, 2, 4, 8, NULL, 'skill', 'Hi Rohan, I noticed you offer Java Programming. I want to prepare for my 3rd sem lab. Would love to exchange with Python!', 'accepted'),
(2, 3, 2, 1, NULL, 'skill', 'Hi Aarav, can we schedule a 1-hour session on Python basics? I can help you with Figma in return.', 'pending'),
(3, 4, 3, NULL, 2, 'service', 'Hi Priya, our robotics club needs a tech talk poster. Could you design one for us?', 'pending');


-- ============================================================================
-- DEMONSTRATION SQL QUERIES (For Faculty Viva & Academic Review)
-- ============================================================================

-- 1. INSERT QUERY: Register a new student
-- INSERT INTO students (name, email, password, department, year, college, bio)
-- VALUES ('Kavya Nair', 'kavya@campusconnect.edu', '$2a$10$...hash...', 'Computer Science', 2, 'Tech University', 'Web developer enthusiastic about Next.js.');

-- 2. SELECT QUERY: Retrieve all active students excluding their passwords
-- SELECT student_id, name, email, department, year, college, bio, role, created_at
-- FROM students
-- ORDER BY created_at DESC;

-- 3. UPDATE QUERY: Update a student's profile information
-- UPDATE students
-- SET bio = 'Updated bio: Focused on full-stack web and cloud systems.', year = 3
-- WHERE student_id = 2;

-- 4. DELETE QUERY: Delete a specific skill listing
-- DELETE FROM skills
-- WHERE skill_id = 4 AND student_id = 2;

-- 5. JOIN QUERY: Retrieve students with the skills they offer
-- SELECT 
--     s.student_id,
--     s.name AS student_name,
--     s.department,
--     s.year,
--     k.skill_id,
--     k.skill_name,
--     k.category,
--     k.experience_level,
--     k.availability
-- FROM students s
-- INNER JOIN skills k ON s.student_id = k.student_id
-- WHERE k.type = 'offered'
-- ORDER BY k.created_at DESC;

-- 6. WHERE QUERY: Search for a particular skill by keyword or category
-- SELECT 
--     k.skill_id,
--     k.skill_name,
--     k.category,
--     k.description,
--     k.experience_level,
--     k.availability,
--     s.name AS student_name,
--     s.department,
--     s.college
-- FROM skills k
-- JOIN students s ON k.student_id = s.student_id
-- WHERE k.type = 'offered'
--   AND (k.skill_name LIKE '%Python%' OR k.category = 'Programming');

-- 7. SKILL MATCHING QUERY: Find students offering a skill that a specific student wants
-- Suppose logged-in student has student_id = 2 (Aarav).
-- Aarav has registered wanted skills (e.g. 'Java Programming').
-- This query finds all other students who OFFER skills matching what Aarav WANTS.
-- SELECT 
--     wanted.skill_name AS wanted_skill,
--     offered_by_other.student_id AS teacher_id,
--     teacher.name AS teacher_name,
--     teacher.email AS teacher_email,
--     teacher.department AS teacher_department,
--     offered_by_other.skill_name AS matching_skill_offered,
--     offered_by_other.experience_level,
--     offered_by_other.availability
-- FROM skills wanted
-- JOIN skills offered_by_other 
--     ON LOWER(TRIM(wanted.skill_name)) = LOWER(TRIM(offered_by_other.skill_name))
--     AND offered_by_other.type = 'offered'
--     AND offered_by_other.student_id != wanted.student_id
-- JOIN students teacher 
--     ON offered_by_other.student_id = teacher.student_id
-- WHERE wanted.student_id = 2
--   AND wanted.type = 'wanted';


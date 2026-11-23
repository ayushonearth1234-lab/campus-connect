
# CAMPUS SKILL AND SERVICE EXCHANGE SYSTEM (CampusConnect)
## Academic Project Report & Faculty Viva Preparation Guide

**Project Team:** CodeMates  
**Team Members:** Shubham Yadav, Tanmay, Bhargav Sai  
**Course:** Advanced Java Programming / Web Technologies  
**Target Level:** 2nd Year BTech Computer Science & Engineering  

---

## 1. Core Concept Explanations (Simple English)

### 1. What is this project?
**CampusConnect** is a college-exclusive web platform designed for students to exchange their skills and services with one another. For example, a student proficient in Python can teach someone who wants to learn Python, and in exchange, receive lessons in Java or help with graphic designing, assignment guidance, or handwritten notes.

### 2. What problem does it solve?
In university campuses:
- Students who want to learn practical skills often have to pay for costly online courses.
- Seniors and peers with valuable knowledge have no centralized platform to share their skills.
- Students needing urgent campus help (notes, event photography, slide design, debugging) rely on scattered WhatsApp groups.
- CampusConnect eliminates these barriers by providing an organized, free peer-to-peer exchange community.

### 3. Why did we develop this project?
As 2nd-year BTech CSE students, we developed this project to:
1. Apply relational database concepts (MySQL, tables, primary/foreign keys, joins, normalization).
2. Build a full-stack web application integrating frontend UI, serverless backend APIs, and session authentication.
3. Foster peer-to-peer learning culture within college campuses without financial exchange.

### 4. What is Frontend?
The **frontend** is the client-facing part of the website that users see and interact with in their browser. It includes buttons, input forms, cards, navigation menus, and animations. In our project, the frontend is built using **React**, **Next.js**, and styled with **Tailwind CSS**.

### 5. What is Backend?
The **backend** is the server-side part of the application that handles business logic, database queries, and security. Users cannot see backend code directly. In our project, the backend is built using **Next.js API Routes** running on Node.js, handling tasks like validating logins, hashing passwords, and executing SQL queries.

### 6. What is Next.js?
**Next.js** is a modern React framework that combines frontend React components with server-side backend API routes in a single unified project. It supports fast server-side rendering, routing based on folders (`src/app`), and zero-config deployment on platforms like Vercel.

### 7. What is Node.js?
**Node.js** is an open-source JavaScript runtime environment that allows JavaScript code to run on a computer server rather than only inside a browser. It enables server-side execution of database queries, file operations, and HTTP requests.

### 8. What is MySQL?
**MySQL** is an open-source **Relational Database Management System (RDBMS)**. It organizes data into structured tables consisting of rows and columns. It is ACID-compliant (Atomicity, Consistency, Isolation, Durability) and ideal for storing structured data such as student accounts, skills, and exchange requests.

### 9. What is SQL?
**SQL** stands for **Structured Query Language**. It is the standard programming language used to communicate with relational databases to create tables, insert records, read data, update information, and delete data (CRUD operations).

### 10. What is an API?
An **API (Application Programming Interface)** is a bridge or messenger that allows two different software programs to talk to each other. In our project, REST API routes (e.g., `POST /api/skills`, `GET /api/requests`) allow the frontend React forms to send and receive data from the MySQL database safely.

### 11. How does frontend communicate with backend?
The frontend communicates with backend API routes using HTTP requests (such as `GET`, `POST`, `PUT`, `DELETE`) via the standard JavaScript `fetch()` function:
1. A student clicks a button on the UI (e.g., "Request Exchange").
2. The browser sends a `POST` request with JSON data to `/api/requests`.
3. The backend API validates the data, runs an SQL query against MySQL, and sends back a JSON response.
4. The frontend receives the JSON response and updates the user interface.

### 12. How does database connectivity work?
Our project uses the **`mysql2/promise`** package. It creates a **Connection Pool** (`mysql.createPool(...)`). When an API route needs to query the database:
1. It requests a connection from the pool.
2. It sends parameterized SQL queries using placeholders (`?`) to prevent SQL injection.
3. Once the query executes, the connection returns to the pool for reuse.

### 13. What are Primary Keys?
A **Primary Key (PK)** is a column (or combination of columns) that uniquely identifies each individual row in a database table. In our project:
- `student_id` is the primary key of table `students`.
- No two students can have the same `student_id`.

### 14. What are Foreign Keys?
A **Foreign Key (FK)** is a column in one table that links to the primary key of another table, establishing a relationship between them. In our project:
- In the `skills` table, `student_id` is a foreign key referencing `students(student_id)`.
- If a student is deleted, `ON DELETE CASCADE` automatically removes all skills belonging to that student, preventing orphan records.

### 15. What are SQL JOIN operations?
A **JOIN** query combines rows from two or more tables based on a related column between them:
- An **INNER JOIN** selects records that have matching values in both tables.
- For example, joining `students` and `skills` lets us display the student's name, department, and college alongside the skill they teach.

### 16. How does student authentication work?
1. **Registration:** Student enters email and password. The backend passes the password through **bcrypt** (10 salt rounds) to generate a secure one-way hash before storing it in MySQL.
2. **Login:** Student enters credentials. The backend retrieves the hashed password from MySQL and uses `bcrypt.compare()` to verify.
3. **Session:** Upon successful verification, a signed **JWT (JSON Web Token)** is generated and stored in a secure, **HTTP-only cookie** (`campus_token`). The browser automatically sends this cookie on subsequent requests without exposing it to malicious client-side JavaScript.

### 17. How does skill matching work?
Our matching engine performs a targeted relational comparison:
1. It reads all skills marked `type = 'wanted'` for the logged-in student.
2. It reads all skills marked `type = 'offered'` by other students (`student_id != current_student`).
3. It performs a case-insensitive, normalized comparison between the skill names.
4. If a match is found, it renders a personalized recommendation banner: *"Match Found! [Student Name] can teach you [Skill Name]"*.

### 18. How are requests stored and updated?
Requests are stored in the `requests` table with fields: `sender_id`, `receiver_id`, `skill_id`, `service_id`, `request_type`, and `status`.
- Default status is `pending`.
- Only the **receiver** has permission to update status to `accepted` or `rejected`.
- The **sender** has permission to `cancel` pending requests.
- Duplicate pending requests between the same students for the same item are blocked.

### 19. How is the website deployed on Vercel?
1. Next.js code is pushed to **GitHub**.
2. Vercel imports the GitHub repository and builds the React frontend and serverless API functions.
3. A cloud-hosted MySQL database (such as Aiven MySQL or TiDB Serverless) is connected using environment variables (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`, `DB_SSL=true`).
4. Vercel executes Next.js serverless functions on demand when users browse or submit forms.

---

## 2. Database Design & Tables Breakdown

The MySQL database `campus_connect` includes 4 relational tables:
1. `students`: Stores student authentication and profile records.
2. `skills`: Stores offered and wanted skills with category, level, and availability.
3. `services`: Stores campus support services (notes, tutoring, posters).
4. `requests`: Manages exchange transactions and status lifecycle.

---

## 3. Quick Demonstration Credentials

| Role | Email | Password | What it Tests |
|---|---|---|---|
| **Student (Aarav)** | `aarav@campusconnect.edu` | `Password123` | Offers Python, wants Java (Triggers Skill Match) |
| **Student (Priya)** | `priya@campusconnect.edu` | `Password123` | Offers Figma & Web Dev, wants Python |
| **Student (Rohan)** | `rohan@campusconnect.edu` | `Password123` | Offers Java & Photography |
| **Admin** | `admin@campusconnect.edu` | `Password123` | Full access to Admin Moderation Portal |


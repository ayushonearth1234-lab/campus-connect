# CampusConnect - Campus Skill and Service Exchange System

**Project Team:** CodeMates  
**Course:** Advanced Java Programming / Web Technologies  
**Target Level:** 2nd Year BTech CSE  

---

## 1. Project Overview

**CampusConnect** is a full-stack peer-to-peer web platform where college students can exchange knowledge, learn from fellow peers, and offer or request helpful campus services (e.g. programming tutoring, UI/UX designing, handwritten notes sharing, event photography, presentation preparation, and lab troubleshooting).

The system implements a relational database in **MySQL**, secure session authentication via **HTTP-only cookies** and **bcrypt**, and a smart **Skill Matching Algorithm** that connects students who want to learn a skill with peers who offer it.

---

## 2. Technology Stack

- **Frontend:** Next.js 14 (App Router), React 18, Tailwind CSS, Lucide Icons
- **Backend:** Next.js API Routes (Node.js runtime)
- **Database:** MySQL relational database accessed via `mysql2/promise` connection pooling
- **Security:** `bcryptjs` password hashing, `jsonwebtoken` (JWT) secure cookies
- **Deployment:** Vercel (frontend & serverless APIs) + Hosted MySQL (Aiven, TiDB Serverless, or Railway)

---

## 3. Key Modules & Features

1. **Student Authentication System**
   - Registration with Full Name, College Email, Password (hashed via bcrypt), Department, Year of Study, and College Name.
   - Login with email and password verification.
   - Secure HTTP-only cookie session management (`campus_token`).
   - Role-based authorization (`student` and `admin`).

2. **Personalized Student Dashboard**
   - Welcome banner with student name and department.
   - Real-time MySQL metric cards: Skills Offered, Skills Wanted, Services Offered, Pending Requests, Accepted Exchanges.
   - Recent activity feed.
   - One-click shortcuts for offering skills and services.

3. **Student Profile Module**
   - View and update profile details (name, department, year, college, bio).
   - Tabbed view to manage your offered skills, wanted skills, and services.
   - Deletion and editing directly stored in MySQL.

4. **Skill Exchange & Smart Matching Module**
   - **Offer a Skill:** Submit skill name, category, experience level (Beginner/Intermediate/Advanced), availability, and description.
   - **Add Wanted Skill:** Specify what topic or programming language you want to learn.
   - **Explore Skills:** Search bar, category filter, experience filter, and profile view.
   - **Smart Matching Engine:** Compares student wanted skills against peer offerings in MySQL and highlights recommendations: *"Match Found! [Student] can teach you [Skill]"*.

5. **Campus Services Module**
   - Offer services like Notes Sharing, Tutoring, Poster Design, Photography, Laptop Troubleshooting, and Presentation Prep.
   - Browse services with category filters and keyword search.
   - Manage and delete your own services.

6. **Request Lifecycle Management**
   - Send exchange requests with custom notes to peer students.
   - Duplicate pending request prevention.
   - **Received Requests:** Accept or Reject incoming requests.
   - **Sent Requests:** Monitor real-time status or Cancel pending requests.
   - Status transitions: `pending` &rarr; `accepted` / `rejected` &rarr; `completed`.

7. **Admin Dashboard**
   - Secure administrative portal accessible only to `admin` role.
   - Full student directory with counts of skills and services.
   - Content moderation: Delete inappropriate skills or services.
   - Database integrity protection (`ON DELETE CASCADE`).

---

## 4. Database Design (`database.sql`)

The database consists of 4 relational tables:
1. `students`: `student_id` (PK), `name`, `email` (UNIQUE), `password` (bcrypt hash), `department`, `year`, `college`, `bio`, `role`, `created_at`.
2. `skills`: `skill_id` (PK), `student_id` (FK &rarr; `students.student_id` ON DELETE CASCADE), `skill_name`, `category`, `description`, `type` ('offered'/'wanted'), `experience_level`, `availability`, `created_at`.
3. `services`: `service_id` (PK), `student_id` (FK &rarr; `students.student_id` ON DELETE CASCADE), `service_name`, `category`, `description`, `availability`, `created_at`.
4. `requests`: `request_id` (PK), `sender_id` (FK), `receiver_id` (FK), `skill_id` (FK), `service_id` (FK), `request_type`, `description`, `status` ('pending', 'accepted', 'rejected', 'cancelled', 'completed'), `created_at`.

---

## 5. Quick Viva Demonstration Credentials

For quick evaluation during college viva, use these pre-seeded demo accounts:

| Role | Email | Password | Details |
|---|---|---|---|
| **Student (Aarav)** | `aarav@campusconnect.edu` | `Password123` | Offers Python, wants Java |
| **Student (Priya)** | `priya@campusconnect.edu` | `Password123` | Offers Figma & React, wants Python |
| **Student (Rohan)** | `rohan@campusconnect.edu` | `Password123` | Offers Java & Photography |
| **Admin** | `admin@campusconnect.edu` | `Password123` | Access to Admin Portal |

*(The login page also provides one-click demo fill buttons for faculty review!)*

---

## 6. How to Run Locally

### Prerequisites
- Node.js (v18 or higher)
- MySQL Server (XAMPP, MySQL Workbench, or a cloud MySQL database)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Update your MySQL credentials in `.env.local`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=campus_connect
SESSION_SECRET=your_jwt_secret_key
```

### Step 3: Initialize Database (Tables & Seed Data)
Run the automated initialization script:
```bash
npm run db:init
```
*(Or import `database.sql` directly into MySQL Workbench / phpMyAdmin).*

### Step 4: Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Resilient Demo Mode:** If MySQL is not running on port 3306 on the examiner's laptop, the application automatically activates simulated fallback storage seeded with the exact `database.sql` records, preventing blank screens or unhandled socket errors during viva presentations.

---

## 7. How to Deploy to Vercel

1. Push your repository to **GitHub**.
2. Create a free hosted MySQL database on:
   - **Aiven MySQL** (Free tier available)
   - **TiDB Cloud** (Serverless MySQL compatible)
   - **Railway** / **Clever Cloud**
3. Import `database.sql` into your hosted database.
4. Import the GitHub repository into **Vercel**.
5. In Vercel Project Settings &rarr; **Environment Variables**, set:
   - `DB_HOST`
   - `DB_PORT`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME`
   - `DB_SSL=true` (for cloud SSL connections)
   - `SESSION_SECRET`
6. Click **Deploy**. Vercel will build and launch your application!


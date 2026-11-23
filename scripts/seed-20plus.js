const { connect } = require('@tidbcloud/serverless');

async function seedLargeDataset() {
  const url = 'mysql://29Y5D95c7xnvrXU.root:q6Jj4LFdykHNawCb@gateway01.ap-northeast-1.prod.aws.tidbcloud.com/campus_connect';
  console.log('🚀 Connecting to TiDB Cloud to seed 20+ records for all modules...');
  const conn = connect({ url });

  // Common password hash for Password123
  const hash = '$2a$10$wO08c3qVpBfJ1kO7i1YfMeO4kG0vW2hI3dO7YwUfL4xVpC5eK0/1e';

  // 1. Truncate / clean existing tables safely
  console.log('Cleaning existing tables...');
  await conn.execute('SET FOREIGN_KEY_CHECKS = 0;');
  await conn.execute('TRUNCATE TABLE requests;');
  await conn.execute('TRUNCATE TABLE services;');
  await conn.execute('TRUNCATE TABLE skills;');
  await conn.execute('TRUNCATE TABLE students;');
  await conn.execute('SET FOREIGN_KEY_CHECKS = 1;');

  // 2. Insert 22 Students (including Team CodeMates)
  console.log('Inserting 22 Students...');
  const students = [
    [1, 'Admin User', 'admin@campusconnect.edu', hash, 'Computer Science', 4, 'Tech University', 'System Administrator for CampusConnect.', 'admin'],
    [2, 'Shubham Yadav', 'shubham@campusconnect.edu', hash, 'Computer Science & Engineering', 2, 'Tech University', 'Full Stack & Database Lead at CodeMates. Passionate about Java and MySQL.', 'student'],
    [3, 'Tanmay', 'tanmay@campusconnect.edu', hash, 'Computer Science & Engineering', 2, 'Tech University', 'Frontend & UI/UX Developer at CodeMates. Loves React, Figma and Tailwind.', 'student'],
    [4, 'Bhargav Sai', 'bhargav@campusconnect.edu', hash, 'Computer Science & Engineering', 2, 'Tech University', 'Backend API & System Architect at CodeMates. Enjoys serverless & algorithms.', 'student'],
    [5, 'Aarav Sharma', 'aarav@campusconnect.edu', hash, 'Computer Science & Engineering', 2, 'Tech University', 'Competitive programmer specializing in Python and C++ Data Structures.', 'student'],
    [6, 'Priya Patel', 'priya@campusconnect.edu', hash, 'Information Technology', 3, 'Tech University', 'UI/UX designer and web developer. Experienced with Figma and modern frontend.', 'student'],
    [7, 'Rohan Verma', 'rohan@campusconnect.edu', hash, 'Electronics & Communication', 2, 'Tech University', 'Java programmer learning embedded systems and IoT. Campus photographer.', 'student'],
    [8, 'Sneha Kulkarni', 'sneha@campusconnect.edu', hash, 'Mechanical Engineering', 3, 'Tech University', 'AutoCAD modeler and engineering mathematics tutor with neat notes.', 'student'],
    [9, 'Ananya Iyer', 'ananya@campusconnect.edu', hash, 'Data Science & AI', 2, 'Tech University', 'Data analysis enthusiast using Python, Pandas and Scikit-Learn.', 'student'],
    [10, 'Vikram Malhotra', 'vikram@campusconnect.edu', hash, 'Computer Science & Engineering', 4, 'Tech University', 'Senior student helping juniors with placement mock interviews and OS concepts.', 'student'],
    [11, 'Riya Sen', 'riya@campusconnect.edu', hash, 'Information Technology', 2, 'Tech University', 'Cloud computing learner exploring AWS and Docker containerization.', 'student'],
    [12, 'Aditya Joshi', 'aditya@campusconnect.edu', hash, 'Electronics & Communication', 3, 'Tech University', 'Hardware enthusiast skilled in Arduino, Raspberry Pi and digital circuit design.', 'student'],
    [13, 'Neha Gupta', 'neha@campusconnect.edu', hash, 'Civil Engineering', 2, 'Tech University', 'Structural analysis enthusiast and technical presentation designer.', 'student'],
    [14, 'Harsh Vardhan', 'harsh@campusconnect.edu', hash, 'Computer Science & Engineering', 3, 'Tech University', 'Cybersecurity learner and Linux command line power user.', 'student'],
    [15, 'Divya Nair', 'divya@campusconnect.edu', hash, 'Artificial Intelligence & ML', 2, 'Tech University', 'Deep learning and NLP student keen on sharing maths and stats basics.', 'student'],
    [16, 'Siddharth Rao', 'siddharth@campusconnect.edu', hash, 'Electrical & Electronics', 3, 'Tech University', 'Power systems student and expert in MATLAB circuit simulations.', 'student'],
    [17, 'Pooja Choudhary', 'pooja@campusconnect.edu', hash, 'Information Technology', 4, 'Tech University', 'Full stack developer with MERN stack experience, offering career guidance.', 'student'],
    [18, 'Aman Khan', 'aman@campusconnect.edu', hash, 'Mechanical Engineering', 2, 'Tech University', 'Robotics club lead, skilled in 3D printing and mechanical part assembly.', 'student'],
    [19, 'Shreya Bhatt', 'shreya@campusconnect.edu', hash, 'Computer Science & Engineering', 1, 'Tech University', 'First year student learning C programming and web fundamentals.', 'student'],
    [20, 'Rahul Mehta', 'rahul@campusconnect.edu', hash, 'Data Science & AI', 3, 'Tech University', 'Data visualization lead skilled in Tableau, PowerBI and SQL queries.', 'student'],
    [21, 'Meera Pillai', 'meera@campusconnect.edu', hash, 'Electronics & Communication', 4, 'Tech University', 'VLSI design student and DSP lab mentor.', 'student'],
    [22, 'Varun Tiwari', 'varun@campusconnect.edu', hash, 'Civil Engineering', 3, 'Tech University', 'Surveying and environmental engineering notes creator.', 'student']
  ];

  for (const s of students) {
    await conn.execute(
      'INSERT INTO students (student_id, name, email, password, department, year, college, bio, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      s
    );
  }

  // 3. Insert 26 Skills (both offered and wanted)
  console.log('Inserting 26 Skills...');
  const skills = [
    [1, 2, 'Java Programming', 'Programming', 'Core Java, OOPs, Collections, and JDBC lab guidance.', 'offered', 'Advanced', 'Weekdays 5 PM - 7 PM'],
    [2, 2, 'MySQL Relational Database', 'Web Development', 'SQL queries, table normalization, indexing and joins.', 'offered', 'Advanced', 'Weekends anytime'],
    [3, 2, 'React.js & Next.js', 'Web Development', 'Want to master modern React hooks and Next.js App Router.', 'wanted', null, null],
    [4, 3, 'React & Tailwind CSS', 'Web Development', 'Building clean responsive components with Tailwind and React.', 'offered', 'Advanced', 'Mon/Wed/Fri after 4 PM'],
    [5, 3, 'Figma UI/UX Prototyping', 'Designing', 'Interactive wireframes, design systems, and component auto-layout.', 'offered', 'Intermediate', 'Saturday afternoons'],
    [6, 3, 'Backend Architecture & APIs', 'Programming', 'Looking to learn REST API design and serverless functions.', 'wanted', null, null],
    [7, 4, 'Node.js REST APIs', 'Web Development', 'Express, middleware, JWT auth, and database integration.', 'offered', 'Advanced', 'Tue/Thu 6 PM - 8 PM'],
    [8, 4, 'Algorithm Design & Analysis', 'Programming', 'Time complexity analysis, sorting algorithms, and greedy approach.', 'offered', 'Intermediate', 'Flexible'],
    [9, 4, 'Machine Learning Basics', 'Programming', 'Interested in learning linear regression and data preprocessing.', 'wanted', null, null],
    [10, 5, 'Python Programming', 'Programming', 'Python syntax, scripting, automation, and data structures.', 'offered', 'Advanced', 'Daily 5 PM - 7 PM'],
    [11, 5, 'C++ Data Structures', 'Programming', 'Pointers, linked lists, binary trees, and graph traversals.', 'offered', 'Advanced', 'Weekends'],
    [12, 5, 'Java Programming', 'Programming', 'Looking to learn Java for semester lab practicals.', 'wanted', null, null],
    [13, 6, 'UI/UX Design Systems', 'Designing', 'Color theory, typography, design tokens, and user research.', 'offered', 'Advanced', 'Weekends'],
    [14, 6, 'Python Programming', 'Programming', 'Want to learn Python for data scripting.', 'wanted', null, null],
    [15, 7, 'Campus Photography', 'Photography', 'DSLR manual mode, portrait lighting, and Lightroom presets.', 'offered', 'Advanced', 'Sunday mornings'],
    [16, 8, 'Engineering Mathematics', 'Academics', 'Calculus, differential equations, Laplace transforms and linear algebra.', 'offered', 'Advanced', 'Daily 6 PM - 8 PM'],
    [17, 8, 'AutoCAD 3D Modeling', 'Designing', '2D drafting, 3D solid part modeling, and dimensioning.', 'offered', 'Intermediate', 'Flexible'],
    [18, 9, 'Machine Learning with Python', 'Programming', 'Scikit-learn, classification models, and Pandas data exploration.', 'offered', 'Intermediate', 'Weekdays after 6 PM'],
    [19, 10, 'Operating Systems & Linux CLI', 'Academics', 'Process scheduling, memory management, and bash shell scripting.', 'offered', 'Advanced', 'Weekends'],
    [20, 11, 'Cloud Fundamentals (AWS)', 'Web Development', 'EC2, S3 bucket storage, IAM roles, and cloud concepts.', 'offered', 'Intermediate', 'Evenings'],
    [21, 12, 'Arduino & IoT Prototyping', 'Academics', 'Microcontroller sensor interfacing, GPIO and ESP32 programming.', 'offered', 'Advanced', 'Saturday mornings'],
    [22, 14, 'Cybersecurity Basics', 'Academics', 'Network port scanning, password security, and OWASP top 10.', 'offered', 'Intermediate', 'Flexible'],
    [23, 15, 'Probability & Statistics', 'Academics', 'Probability distributions, hypothesis testing, and Bayes theorem.', 'offered', 'Intermediate', 'Mon/Wed 5 PM'],
    [24, 16, 'MATLAB Circuit Simulation', 'Academics', 'Simulink models, transient circuit analysis, and signal plots.', 'offered', 'Advanced', 'Weekends'],
    [25, 17, 'Full Stack Web Deployment', 'Web Development', 'Deploying on Vercel, Render, environment variables, and Git CI/CD.', 'offered', 'Advanced', 'Daily after 7 PM'],
    [26, 20, 'Data Visualization (PowerBI)', 'Business', 'Creating interactive dashboards, KPI charts, and executive reports.', 'offered', 'Intermediate', 'Flexible']
  ];

  for (const k of skills) {
    await conn.execute(
      'INSERT INTO skills (skill_id, student_id, skill_name, category, description, type, experience_level, availability) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      k
    );
  }

  // 4. Insert 22 Campus Services
  console.log('Inserting 22 Campus Services...');
  const services = [
    [1, 2, 'Java Lab Practical Debugging & Guidance', 'Tutoring', 'Can help identify syntax bugs, null pointers, and OOP hierarchy in Java lab assignments.', 'Weekdays after 5 PM'],
    [2, 3, 'College Event Poster & Banner Design', 'Poster Designing', 'Custom attractive posters for hackathons, club events, and webinars designed in Figma/Canva.', '2-3 days prior notice'],
    [3, 4, 'REST API & Database Schema Consultation', 'Tutoring', 'Guidance on designing normalized SQL tables and organizing backend endpoints.', 'Evenings by appointment'],
    [4, 5, 'Python Project Troubleshooting & Setup', 'Laptop Troubleshooting', 'Help with virtualenv, pip package errors, Anaconda setup, and script errors.', 'Weekdays after 6 PM'],
    [5, 6, 'Hackathon Slide Deck & Presentation Design', 'Presentation Preparation', 'Polished pitch deck templates with clean layout and typography for tech presentations.', '1-2 days turnaround'],
    [6, 7, 'Fest & Club Event DSLR Photography', 'Photography', 'High-res photos covering college workshops, sports meets, and cultural fests with DSLR.', 'Weekends & Fest days'],
    [7, 8, 'Engineering Mathematics Handwritten Notes (PDF)', 'Notes Sharing', 'Clean, step-by-step indexed notes for Calculus, Matrix Theory, and Laplace Transforms.', 'Instant PDF download'],
    [8, 9, 'Data Analysis & Chart Plotting with Python', 'Tutoring', 'Assistance in generating clean Seaborn and Matplotlib graphs for lab reports.', 'Flexible'],
    [9, 10, 'Mock Placement Technical Interview (CSE/IT)', 'Tutoring', '30-minute practice interview covering DSA questions, DBMS concepts, and resume feedback.', 'Saturday / Sunday'],
    [10, 11, 'Ubuntu Linux Dual-Boot & VM Setup Assistance', 'Laptop Troubleshooting', 'Hands-on guidance to install Ubuntu on VirtualBox or alongside Windows safely.', 'Weekends'],
    [11, 12, 'Arduino / Breadboard Hardware Debugging', 'Tutoring', 'Troubleshooting loose jumper connections, resistor values, and sensor code.', 'College lab hours'],
    [12, 13, 'Civil Engineering Surveying Field Notes', 'Notes Sharing', 'Complete handwritten lab manual notes on Leveling, Theodolite and Tachometry.', 'Available on demand'],
    [13, 14, 'Wi-Fi & Network Configuration Troubleshooting', 'Laptop Troubleshooting', 'Assistance setting up campus proxy, SSH keys, and firewall access on student laptops.', 'Daily 4 PM - 6 PM'],
    [14, 15, 'Statistics Formula Cheat Sheet (PDF)', 'Notes Sharing', 'Summarized 4-page reference sheet with all key formulas for probability and stats.', 'Available on demand'],
    [15, 16, 'MATLAB Lab Simulation Assistance', 'Tutoring', 'Step-by-step guidance on writing MATLAB scripts for transfer functions and bode plots.', 'Flexible'],
    [16, 17, 'Full Stack Web App Bug Fixing', 'Tutoring', 'Troubleshooting CORS issues, package conflicts, and layout glitches in student web projects.', 'Evenings'],
    [17, 18, '3D Model Slicing & 3D Print Preparation', 'Assignment Guidance', 'Preparing STL files for 3D printing with optimal infill and support structures.', '2 days notice'],
    [18, 19, 'C Programming First Year Doubts Clearance', 'Tutoring', 'Pointers, loops, arrays, and string handling explained simply for 1st year exams.', 'Daily after 5 PM'],
    [19, 20, 'PowerBI Dashboard Design for Mini-Projects', 'Document Formatting', 'Transforming Excel sheets into interactive visual dashboards for submission.', '2-3 days turnaround'],
    [20, 21, 'Digital Signal Processing Handwritten Notes', 'Notes Sharing', 'Comprehensive notes with solved numericals on FFT, DFT, and Z-Transforms.', 'Available as PDF'],
    [21, 22, 'LaTeX Template Setup for Major Project Reports', 'Document Formatting', 'Formatting your BTech project report according to IEEE university guidelines in LaTeX.', '1-2 days turnaround'],
    [22, 6, 'Social Media Post & Banner Graphics for Clubs', 'Poster Designing', 'Creative Instagram post graphics and story announcements for student committees.', 'Fast delivery']
  ];

  for (const srv of services) {
    await conn.execute(
      'INSERT INTO services (service_id, student_id, service_name, category, description, availability) VALUES (?, ?, ?, ?, ?, ?)',
      srv
    );
  }

  // 5. Insert 8 Realistic Exchange Requests
  console.log('Inserting Exchange Requests...');
  const requests = [
    [1, 5, 2, 1, null, 'skill', 'Hi Shubham, I would love to learn Java Collections from you. In return, I can help you with Python data structures!', 'accepted'],
    [2, 6, 3, 4, null, 'skill', 'Hi Tanmay, can we schedule a 1-hour session on Tailwind CSS layout? I can teach you Figma design systems.', 'accepted'],
    [3, 7, 6, null, 2, 'service', 'Hi Priya, our robotics club needs an event poster. Could you design one for us?', 'pending'],
    [4, 8, 5, 10, null, 'skill', 'Hi Aarav, looking for a tutorial on Python automation scripts for data sorting.', 'pending'],
    [5, 9, 8, null, 7, 'service', 'Hi Sneha, could you share your Engineering Maths handwritten notes PDF for 3rd sem exams?', 'accepted'],
    [6, 10, 4, 7, null, 'skill', 'Hi Bhargav, interested in discussing serverless REST API scaling and best practices.', 'completed'],
    [7, 11, 10, null, 9, 'service', 'Hi Vikram, I would like to schedule a mock technical interview for campus placements.', 'pending'],
    [8, 12, 11, 20, null, 'skill', 'Hi Riya, eager to learn AWS S3 and EC2 basics for my upcoming IoT cloud project.', 'accepted']
  ];

  for (const r of requests) {
    await conn.execute(
      'INSERT INTO requests (request_id, sender_id, receiver_id, skill_id, service_id, request_type, description, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      r
    );
  }

  // Verification queries
  const stuCount = await conn.execute('SELECT COUNT(*) AS total FROM students;');
  const sklCount = await conn.execute('SELECT COUNT(*) AS total FROM skills;');
  const srvCount = await conn.execute('SELECT COUNT(*) AS total FROM services;');
  const reqCount = await conn.execute('SELECT COUNT(*) AS total FROM requests;');

  console.log('\n=========================================');
  console.log('🎉 VERIFICATION SUMMARY ON LIVE DATABASE:');
  console.log('Total Students:        ', stuCount[0].total, '(Target: 20+)');
  console.log('Total Skills Listed:   ', sklCount[0].total, '(Target: 20+)');
  console.log('Total Campus Services: ', srvCount[0].total, '(Target: 20+)');
  console.log('Total Requests Tracked:', reqCount[0].total);
  console.log('=========================================\n');
}

seedLargeDataset();


// ============================================================================
// CampusConnect - Database Connection Module
// Tech: MySQL Relational Database with Multi-Mode Driver Support
// 1. TiDB Cloud MySQL (via @tidbcloud/serverless HTTPS driver - zero SSL socket drops)
// 2. Standard Local/Hosted MySQL (via mysql2/promise connection pooling)
// 3. In-memory fallback simulation (seeded with database.sql data for offline evaluation)
// ============================================================================

import mysql from 'mysql2/promise';

let pool = null;
let tidbClient = null;
let activeMode = null; // 'tidb' | 'mysql2' | 'fallback'

// Fallback in-memory state initialized with database.sql seed data
const fallbackStore = {
  students: [
    {
      student_id: 1,
      name: 'Admin User',
      email: 'admin@campusconnect.edu',
      password: '$2a$10$wO08c3qVpBfJ1kO7i1YfMeO4kG0vW2hI3dO7YwUfL4xVpC5eK0/1e', // Password123
      department: 'Computer Science',
      year: 4,
      college: 'Tech University',
      bio: 'System Administrator for CampusConnect.',
      role: 'admin',
      created_at: new Date('2024-01-01T00:00:00Z')
    },
    {
      student_id: 2,
      name: 'Aarav Sharma',
      email: 'aarav@campusconnect.edu',
      password: '$2a$10$wO08c3qVpBfJ1kO7i1YfMeO4kG0vW2hI3dO7YwUfL4xVpC5eK0/1e', // Password123
      department: 'Computer Science & Engineering',
      year: 2,
      college: 'Tech University',
      bio: 'Passionate about Python programming, data structures, and competitive coding.',
      role: 'student',
      created_at: new Date('2024-01-02T00:00:00Z')
    },
    {
      student_id: 3,
      name: 'Priya Patel',
      email: 'priya@campusconnect.edu',
      password: '$2a$10$wO08c3qVpBfJ1kO7i1YfMeO4kG0vW2hI3dO7YwUfL4xVpC5eK0/1e', // Password123
      department: 'Information Technology',
      year: 3,
      college: 'Tech University',
      bio: 'UI/UX designer and frontend web enthusiast. Loves Figma and React.',
      role: 'student',
      created_at: new Date('2024-01-03T00:00:00Z')
    },
    {
      student_id: 4,
      name: 'Rohan Verma',
      email: 'rohan@campusconnect.edu',
      password: '$2a$10$wO08c3qVpBfJ1kO7i1YfMeO4kG0vW2hI3dO7YwUfL4xVpC5eK0/1e', // Password123
      department: 'Electronics & Communication',
      year: 2,
      college: 'Tech University',
      bio: 'Java programmer learning backend architecture. Also enjoys campus photography.',
      role: 'student',
      created_at: new Date('2024-01-04T00:00:00Z')
    },
    {
      student_id: 5,
      name: 'Sneha Kulkarni',
      email: 'sneha@campusconnect.edu',
      password: '$2a$10$wO08c3qVpBfJ1kO7i1YfMeO4kG0vW2hI3dO7YwUfL4xVpC5eK0/1e', // Password123
      department: 'Mechanical Engineering',
      year: 3,
      college: 'Tech University',
      bio: 'Expert in CAD modeling, mathematics tutoring, and technical report writing.',
      role: 'student',
      created_at: new Date('2024-01-05T00:00:00Z')
    }
  ],
  skills: [
    {
      skill_id: 1,
      student_id: 2,
      skill_name: 'Python Programming',
      category: 'Programming',
      description: 'Can teach Python basics, OOP concepts, automation scripts, and problem solving.',
      type: 'offered',
      experience_level: 'Advanced',
      availability: 'Weekdays 5 PM - 7 PM',
      created_at: new Date('2024-01-10T10:00:00Z')
    },
    {
      skill_id: 2,
      student_id: 2,
      skill_name: 'C++ Data Structures',
      category: 'Programming',
      description: 'Can explain linked lists, trees, graphs, and algorithm time complexity.',
      type: 'offered',
      experience_level: 'Intermediate',
      availability: 'Saturday afternoons',
      created_at: new Date('2024-01-11T11:00:00Z')
    },
    {
      skill_id: 3,
      student_id: 2,
      skill_name: 'Java Programming',
      category: 'Programming',
      description: 'Looking to learn Core Java, collections framework, and OOP for semester exams.',
      type: 'wanted',
      experience_level: null,
      availability: null,
      created_at: new Date('2024-01-12T12:00:00Z')
    },
    {
      skill_id: 4,
      student_id: 2,
      skill_name: 'Figma UI/UX Design',
      category: 'Designing',
      description: 'Want to learn design principles and Figma wireframing for web apps.',
      type: 'wanted',
      experience_level: null,
      availability: null,
      created_at: new Date('2024-01-13T13:00:00Z')
    },
    {
      skill_id: 5,
      student_id: 3,
      skill_name: 'Figma UI/UX Design',
      category: 'Designing',
      description: 'Proficient in UI design systems, interactive prototypes, and modern layouts.',
      type: 'offered',
      experience_level: 'Advanced',
      availability: 'Weekends anytime',
      created_at: new Date('2024-01-14T14:00:00Z')
    },
    {
      skill_id: 6,
      student_id: 3,
      skill_name: 'React & Frontend',
      category: 'Web Development',
      description: 'Can assist in React component basics, Tailwind CSS styling, and responsive UI.',
      type: 'offered',
      experience_level: 'Intermediate',
      availability: 'Tuesday and Thursday evenings',
      created_at: new Date('2024-01-15T15:00:00Z')
    },
    {
      skill_id: 7,
      student_id: 3,
      skill_name: 'Python Programming',
      category: 'Programming',
      description: 'Want to learn Python for data analysis and scripting.',
      type: 'wanted',
      experience_level: null,
      availability: null,
      created_at: new Date('2024-01-16T16:00:00Z')
    },
    {
      skill_id: 8,
      student_id: 4,
      skill_name: 'Java Programming',
      category: 'Programming',
      description: 'Good grasp of Java OOP, multithreading, and JDBC basics. Happy to teach!',
      type: 'offered',
      experience_level: 'Intermediate',
      availability: 'Mon/Wed 4 PM - 6 PM',
      created_at: new Date('2024-01-17T17:00:00Z')
    },
    {
      skill_id: 9,
      student_id: 4,
      skill_name: 'Campus Photography',
      category: 'Photography',
      description: 'Can guide on DSLR manual mode, portrait framing, and Lightroom color grading.',
      type: 'offered',
      experience_level: 'Advanced',
      availability: 'Sunday mornings',
      created_at: new Date('2024-01-18T18:00:00Z')
    },
    {
      skill_id: 10,
      student_id: 4,
      skill_name: 'React & Frontend',
      category: 'Web Development',
      description: 'Looking to learn React and modern JavaScript frontend development.',
      type: 'wanted',
      experience_level: null,
      availability: null,
      created_at: new Date('2024-01-19T19:00:00Z')
    },
    {
      skill_id: 11,
      student_id: 5,
      skill_name: 'Engineering Mathematics',
      category: 'Academics',
      description: 'Can help clear doubts in calculus, differential equations, and linear algebra.',
      type: 'offered',
      experience_level: 'Advanced',
      availability: 'Daily 6 PM - 8 PM',
      created_at: new Date('2024-01-20T20:00:00Z')
    },
    {
      skill_id: 12,
      student_id: 5,
      skill_name: 'AutoCAD 3D Modeling',
      category: 'Designing',
      description: 'Can teach basic 2D drawings and 3D mechanical part modeling.',
      type: 'offered',
      experience_level: 'Intermediate',
      availability: 'Flexible',
      created_at: new Date('2024-01-21T21:00:00Z')
    },
    {
      skill_id: 13,
      student_id: 5,
      skill_name: 'C++ Data Structures',
      category: 'Programming',
      description: 'Eager to learn DSA in C++ to prepare for placements.',
      type: 'wanted',
      experience_level: null,
      availability: null,
      created_at: new Date('2024-01-22T22:00:00Z')
    }
  ],
  services: [
    {
      service_id: 1,
      student_id: 2,
      service_name: 'Python Project Troubleshooting & Debugging',
      category: 'Tutoring',
      description: 'I can help you debug syntax bugs, virtual environment issues, and logic errors in Python projects.',
      availability: 'Weekdays after 6 PM',
      created_at: new Date('2024-01-10T10:00:00Z')
    },
    {
      service_id: 2,
      student_id: 3,
      service_name: 'College Event Poster & Brochure Design',
      category: 'Poster Designing',
      description: 'High-quality posters for hackathons, club fests, and cultural events made in Figma/Canva.',
      availability: '2-3 days prior notice',
      created_at: new Date('2024-01-11T11:00:00Z')
    },
    {
      service_id: 3,
      student_id: 4,
      service_name: 'Fest & Club Event Photography',
      category: 'Photography',
      description: 'Available to cover departmental workshops, guest talks, and sports fests with DSLR camera.',
      availability: 'College fest days / Weekends',
      created_at: new Date('2024-01-12T12:00:00Z')
    },
    {
      service_id: 4,
      student_id: 5,
      service_name: 'Engineering Mathematics Handwritten Notes',
      category: 'Notes Sharing',
      description: 'Neat, indexed handwritten notes covering Calculus, Matrix Theory, and Transform Calculus.',
      availability: 'Available on demand as PDF',
      created_at: new Date('2024-01-13T13:00:00Z')
    }
  ],
  requests: [
    {
      request_id: 1,
      sender_id: 2,
      receiver_id: 4,
      skill_id: 8,
      service_id: null,
      request_type: 'skill',
      description: 'Hi Rohan, I noticed you offer Java Programming. I want to prepare for my 3rd sem lab. Would love to exchange with Python!',
      status: 'accepted',
      created_at: new Date('2024-01-20T10:00:00Z')
    },
    {
      request_id: 2,
      sender_id: 3,
      receiver_id: 2,
      skill_id: 1,
      service_id: null,
      request_type: 'skill',
      description: 'Hi Aarav, can we schedule a 1-hour session on Python basics? I can help you with Figma in return.',
      status: 'pending',
      created_at: new Date('2024-01-21T11:00:00Z')
    },
    {
      request_id: 3,
      sender_id: 4,
      receiver_id: 3,
      skill_id: null,
      service_id: 2,
      request_type: 'service',
      description: 'Hi Priya, our robotics club needs a tech talk poster. Could you design one for us?',
      status: 'pending',
      created_at: new Date('2024-01-22T12:00:00Z')
    }
  ]
};

let nextStudentId = 6;
let nextSkillId = 14;
let nextServiceId = 5;
let nextRequestId = 4;

/**
 * Initializes and detects the best active database connection mode
 */
async function initConnection() {
  if (activeMode) return activeMode;

  const DEFAULT_TIDB_URL = 'mysql://29Y5D95c7xnvrXU.root:q6Jj4LFdykHNawCb@gateway01.ap-northeast-1.prod.aws.tidbcloud.com/campus_connect';
  const databaseUrl = process.env.DATABASE_URL || DEFAULT_TIDB_URL;
  const dbHost = process.env.DB_HOST || 'gateway01.ap-northeast-1.prod.aws.tidbcloud.com';

  // 1. Check for TiDB Cloud Serverless (default and primary cloud mode)
  if (databaseUrl.includes('tidbcloud.com') || dbHost.includes('tidbcloud.com')) {
    try {
      const { connect } = await import('@tidbcloud/serverless');
      const url = databaseUrl || `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME || 'campus_connect'}`;
      tidbClient = connect({ url });
      // Test ping
      await tidbClient.execute('SELECT 1');
      activeMode = 'tidb';
      console.log('✅ [CampusConnect] Connected successfully to TiDB Cloud MySQL via Serverless HTTPS Driver.');
      return activeMode;
    } catch (err) {
      console.warn('⚠️ TiDB Cloud connection attempt failed:', err.message);
    }
  }

  // 2. Check for standard MySQL (localhost or standard cloud host)
  if (dbHost && !dbHost.includes('tidbcloud.com')) {
    try {
      pool = mysql.createPool({
        host: dbHost,
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'campus_connect',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        connectTimeout: 3000
      });
      const conn = await pool.getConnection();
      await conn.ping();
      conn.release();
      activeMode = 'mysql2';
      console.log('✅ [CampusConnect] Connected successfully to MySQL Database via mysql2 connection pool.');
      return activeMode;
    } catch (err) {
      console.warn('⚠️ Standard MySQL connection attempt failed:', err.message);
    }
  }

  // 3. Fallback memory mode
  activeMode = 'fallback';
  console.log('ℹ️ [CampusConnect] Running in simulated memory mode with seed records.');
  return activeMode;
}

/**
 * Executes a parameterized SQL query
 */
export async function executeQuery(sql, params = []) {
  const mode = await initConnection();

  // Mode 1: TiDB Cloud Serverless
  if (mode === 'tidb' && tidbClient) {
    try {
      const trimmed = sql.trim().toUpperCase();

      // If INSERT, execute with fullResult to retrieve accurate lastInsertId directly
      if (trimmed.startsWith('INSERT INTO')) {
        const full = await tidbClient.execute(sql, params, { fullResult: true });
        return {
          insertId: Number(full?.lastInsertId) || 1,
          affectedRows: Number(full?.rowsAffected) || 1
        };
      }

      if (trimmed.startsWith('UPDATE') || trimmed.startsWith('DELETE')) {
        const full = await tidbClient.execute(sql, params, { fullResult: true });
        return { affectedRows: Number(full?.rowsAffected) || 1 };
      }

      const rows = await tidbClient.execute(sql, params);
      return Array.isArray(rows) ? rows : [];
    } catch (err) {
      console.error('TiDB execute error:', err.message, 'Query:', sql);
      throw err;
    }
  }

  // Mode 2: Standard mysql2
  if (mode === 'mysql2' && pool) {
    try {
      const [rows] = await pool.query(sql, params);
      return rows;
    } catch (err) {
      console.error('MySQL query error:', err.message, 'Query:', sql);
      throw err;
    }
  }

  // Mode 3: Fallback Simulation
  return handleFallbackQuery(sql, params);
}

/**
 * Fallback query simulator
 */
function handleFallbackQuery(sql, params) {
  const cleanSql = sql.trim().replace(/\s+/g, ' ');

  if (cleanSql.includes('FROM students') && cleanSql.includes('WHERE email =')) {
    const email = params[0];
    return fallbackStore.students.filter(s => s.email.toLowerCase() === (email || '').toLowerCase());
  }

  if (cleanSql.includes('FROM students') && cleanSql.includes('WHERE student_id =')) {
    const id = Number(params[0]);
    return fallbackStore.students.filter(s => s.student_id === id);
  }

  if (cleanSql.startsWith('INSERT INTO students')) {
    const [name, email, password, department, year, college, bio, role = 'student'] = params;
    const newStudent = {
      student_id: nextStudentId++,
      name,
      email,
      password,
      department,
      year: Number(year),
      college,
      bio: bio || '',
      role: role || 'student',
      created_at: new Date()
    };
    fallbackStore.students.push(newStudent);
    return { insertId: newStudent.student_id, affectedRows: 1 };
  }

  if (cleanSql.startsWith('UPDATE students')) {
    const id = Number(params[params.length - 1]);
    const student = fallbackStore.students.find(s => s.student_id === id);
    if (student) {
      if (params.length === 6) {
        student.name = params[0];
        student.department = params[1];
        student.year = Number(params[2]);
        student.college = params[3];
        student.bio = params[4];
      }
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  if (cleanSql.includes('FROM students') && !cleanSql.includes('WHERE')) {
    return fallbackStore.students.map(({ password, ...rest }) => rest);
  }

  if (cleanSql.includes('FROM skills')) {
    if (cleanSql.includes('WHERE student_id =') || cleanSql.includes('WHERE s.student_id =') || cleanSql.includes('WHERE k.student_id =')) {
      const studentId = Number(params[0]);
      let results = fallbackStore.skills.filter(k => k.student_id === studentId);
      if (params[1]) results = results.filter(k => k.type === params[1]);
      return results;
    }

    if (cleanSql.includes("type = 'offered'") || cleanSql.includes('type = ?')) {
      return fallbackStore.skills
        .filter(k => k.type === 'offered')
        .map(k => {
          const student = fallbackStore.students.find(s => s.student_id === k.student_id) || {};
          return {
            ...k,
            student_name: student.name,
            department: student.department,
            year: student.year,
            college: student.college,
            email: student.email
          };
        });
    }

    return fallbackStore.skills.map(k => {
      const student = fallbackStore.students.find(s => s.student_id === k.student_id) || {};
      return {
        ...k,
        student_name: student.name,
        department: student.department
      };
    });
  }

  if (cleanSql.startsWith('INSERT INTO skills')) {
    const [student_id, skill_name, category, description, type, experience_level, availability] = params;
    const newSkill = {
      skill_id: nextSkillId++,
      student_id: Number(student_id),
      skill_name,
      category,
      description,
      type,
      experience_level: experience_level || null,
      availability: availability || null,
      created_at: new Date()
    };
    fallbackStore.skills.push(newSkill);
    return { insertId: newSkill.skill_id, affectedRows: 1 };
  }

  if (cleanSql.startsWith('DELETE FROM skills')) {
    const skillId = Number(params[0]);
    const initialLen = fallbackStore.skills.length;
    fallbackStore.skills = fallbackStore.skills.filter(k => k.skill_id !== skillId);
    return { affectedRows: initialLen - fallbackStore.skills.length };
  }

  if (cleanSql.includes('FROM services')) {
    if (cleanSql.includes('WHERE student_id =') || cleanSql.includes('WHERE s.student_id =')) {
      const studentId = Number(params[0]);
      return fallbackStore.services.filter(s => s.student_id === studentId);
    }
    return fallbackStore.services.map(srv => {
      const student = fallbackStore.students.find(s => s.student_id === srv.student_id) || {};
      return {
        ...srv,
        provider_name: student.name,
        department: student.department,
        year: student.year,
        college: student.college,
        email: student.email
      };
    });
  }

  if (cleanSql.startsWith('INSERT INTO services')) {
    const [student_id, service_name, category, description, availability] = params;
    const newService = {
      service_id: nextServiceId++,
      student_id: Number(student_id),
      service_name,
      category,
      description,
      availability: availability || null,
      created_at: new Date()
    };
    fallbackStore.services.push(newService);
    return { insertId: newService.service_id, affectedRows: 1 };
  }

  if (cleanSql.startsWith('DELETE FROM services')) {
    const serviceId = Number(params[0]);
    const initialLen = fallbackStore.services.length;
    fallbackStore.services = fallbackStore.services.filter(s => s.service_id !== serviceId);
    return { affectedRows: initialLen - fallbackStore.services.length };
  }

  if (cleanSql.includes('FROM requests')) {
    let list = fallbackStore.requests.map(r => {
      const sender = fallbackStore.students.find(s => s.student_id === r.sender_id) || {};
      const receiver = fallbackStore.students.find(s => s.student_id === r.receiver_id) || {};
      const skill = r.skill_id ? fallbackStore.skills.find(k => k.skill_id === r.skill_id) : null;
      const service = r.service_id ? fallbackStore.services.find(s => s.service_id === r.service_id) : null;

      return {
        ...r,
        sender_name: sender.name,
        sender_email: sender.email,
        sender_department: sender.department,
        receiver_name: receiver.name,
        receiver_email: receiver.email,
        receiver_department: receiver.department,
        target_title: skill ? skill.skill_name : (service ? service.service_name : 'General Request')
      };
    });

    if (cleanSql.includes('WHERE sender_id =')) {
      const sid = Number(params[0]);
      return list.filter(r => r.sender_id === sid);
    }
    if (cleanSql.includes('WHERE receiver_id =')) {
      const rid = Number(params[0]);
      return list.filter(r => r.receiver_id === rid);
    }
    if (cleanSql.includes('WHERE request_id =')) {
      const rid = Number(params[0]);
      return list.filter(r => r.request_id === rid);
    }
    return list;
  }

  if (cleanSql.startsWith('INSERT INTO requests')) {
    const [sender_id, receiver_id, skill_id, service_id, request_type, description, status = 'pending'] = params;
    const newReq = {
      request_id: nextRequestId++,
      sender_id: Number(sender_id),
      receiver_id: Number(receiver_id),
      skill_id: skill_id ? Number(skill_id) : null,
      service_id: service_id ? Number(service_id) : null,
      request_type,
      description,
      status: status || 'pending',
      created_at: new Date()
    };
    fallbackStore.requests.push(newReq);
    return { insertId: newReq.request_id, affectedRows: 1 };
  }

  if (cleanSql.startsWith('UPDATE requests')) {
    const status = params[0];
    const requestId = Number(params[params.length - 1]);
    const req = fallbackStore.requests.find(r => r.request_id === requestId);
    if (req) {
      req.status = status;
      return { affectedRows: 1 };
    }
    return { affectedRows: 0 };
  }

  return [];
}

export function getPool() {
  return pool;
}

export default { executeQuery, getPool };

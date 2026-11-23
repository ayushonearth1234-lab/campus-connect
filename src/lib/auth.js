// ============================================================================
// CampusConnect - Authentication & Session Helper
// Tech: bcryptjs for password hashing, jsonwebtoken for secure HTTP-only cookies
// ============================================================================

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.SESSION_SECRET || 'campus_connect_codemates_super_secret_jwt_key_2024_academics';

/**
 * Hashes a plain-text password using bcrypt (10 salt rounds)
 */
export async function hashPassword(plainPassword) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainPassword, salt);
}

/**
 * Compares plain-text password with hashed password stored in MySQL
 */
export async function comparePassword(plainPassword, hashedPassword) {
  if (!plainPassword || !hashedPassword) return false;
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (err) {
    // If during quick offline testing a plain password was somehow used
    return plainPassword === hashedPassword;
  }
}

/**
 * Generates a signed JWT session token valid for 7 days
 */
export function generateToken(student) {
  const payload = {
    student_id: Number(student.student_id),
    name: student.name,
    email: student.email,
    role: student.role || 'student',
    department: student.department,
    college: student.college
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

/**
 * Verifies a JWT session token and returns the decoded student payload
 */
export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded && decoded.student_id) {
      decoded.student_id = Number(decoded.student_id);
    }
    return decoded;
  } catch (err) {
    return null;
  }
}

/**
 * Extracts and verifies the current authenticated student from Next.js Request cookies or Authorization header
 */
export function getCurrentUser(request) {
  try {
    let token = null;

    // 1. Try reading from Authorization Bearer header (highest priority for APIs)
    if (request && request.headers) {
      const authHeader = request.headers.get('authorization') || '';
      if (authHeader.toLowerCase().startsWith('bearer ')) {
        token = authHeader.substring(7).trim();
      }
    }

    // 2. Try reading from Request cookies
    if (!token && request && request.cookies && typeof request.cookies.get === 'function') {
      const cookieObj = request.cookies.get('campus_token');
      if (cookieObj) {
        token = cookieObj.value;
      }
    }

    // 3. Try reading from cookie header string
    if (!token && request && request.headers) {
      const cookieHeader = request.headers.get('cookie') || '';
      const match = cookieHeader.match(/campus_token=([^;]+)/);
      if (match) {
        token = match[1];
      }
    }

    if (!token) return null;
    token = decodeURIComponent(token.trim().replace(/^["']|["']$/g, ''));
    return verifyToken(token);
  } catch (e) {
    return null;
  }
}


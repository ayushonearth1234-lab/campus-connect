import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, confirmPassword, department, year, college } = body;

    // 1. Basic Validation
    if (!name || !email || !password || !department || !year || !college) {
      return NextResponse.json(
        { error: 'Please provide all required registration fields.' },
        { status: 400 }
      );
    }

    if (confirmPassword && password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Password and Confirm Password do not match.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid student email address.' },
        { status: 400 }
      );
    }

    // 2. Check if student email already exists
    const existing = await executeQuery(
      'SELECT student_id FROM students WHERE email = ?',
      [email.toLowerCase().trim()]
    );

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: 'A student account with this email already exists. Please log in.' },
        { status: 409 }
      );
    }

    // 3. Hash password using bcrypt (Never store plain-text passwords!)
    const hashedPassword = await hashPassword(password);

    // 4. Insert student into MySQL with role 'student' (Cannot register as admin)
    const result = await executeQuery(
      `INSERT INTO students (name, email, password, department, year, college, bio, role)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'student')`,
      [
        name.trim(),
        email.toLowerCase().trim(),
        hashedPassword,
        department.trim(),
        Number(year),
        college.trim(),
        ''
      ]
    );

    const newStudentId = result.insertId;

    const newStudent = {
      student_id: newStudentId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role: 'student',
      department: department.trim(),
      college: college.trim()
    };

    // 5. Generate session token
    const token = generateToken(newStudent);

    // 6. Set HTTP-only cookie
    const response = NextResponse.json(
      { message: 'Registration successful! Welcome to CampusConnect.', user: newStudent },
      { status: 201 }
    );

    response.cookies.set('campus_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;
  } catch (error) {
    console.error('Registration API Error:', error);
    return NextResponse.json(
      { error: 'An error occurred during registration. Please try again.' },
      { status: 500 }
    );
  }
}


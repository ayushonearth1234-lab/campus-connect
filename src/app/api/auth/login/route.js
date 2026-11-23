import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { comparePassword, generateToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 1. Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Please enter both your college email and password.' },
        { status: 400 }
      );
    }

    // 2. Fetch student from MySQL
    const students = await executeQuery(
      'SELECT student_id, name, email, password, department, year, college, bio, role FROM students WHERE email = ?',
      [email.toLowerCase().trim()]
    );

    if (!students || students.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or password. Please check your credentials.' },
        { status: 401 }
      );
    }

    const student = students[0];

    // 3. Verify password hash using bcrypt
    const isMatch = await comparePassword(password, student.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password. Please check your credentials.' },
        { status: 401 }
      );
    }

    // 4. Create user payload without password
    const userPayload = {
      student_id: student.student_id,
      name: student.name,
      email: student.email,
      department: student.department,
      year: student.year,
      college: student.college,
      role: student.role || 'student'
    };

    // 5. Generate JWT token
    const token = generateToken(userPayload);

    // 6. Set HTTP-only Cookie and return token in JSON for client Authorization header
    const response = NextResponse.json(
      { message: 'Login successful!', user: userPayload, token },
      { status: 200 }
    );

    const isHttps = request.headers.get('x-forwarded-proto') === 'https' ||
                    (request.url && request.url.startsWith('https://'));

    response.cookies.set('campus_token', token, {
      httpOnly: true,
      secure: isHttps,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login API Error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login. Please try again.' },
      { status: 500 }
    );
  }
}


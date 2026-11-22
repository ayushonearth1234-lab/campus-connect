import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const studentId = Number(params.id);
    if (!studentId) {
      return NextResponse.json({ error: 'Invalid student ID' }, { status: 400 });
    }

    // 1. Fetch student info
    const students = await executeQuery(
      `SELECT student_id, name, email, department, year, college, bio, role, created_at 
       FROM students 
       WHERE student_id = ?`,
      [studentId]
    );

    if (!students || students.length === 0) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const student = students[0];

    // 2. Fetch skills offered and wanted
    const skills = await executeQuery(
      `SELECT skill_id, skill_name, category, description, type, experience_level, availability, created_at
       FROM skills 
       WHERE student_id = ? 
       ORDER BY created_at DESC`,
      [studentId]
    );

    // 3. Fetch services offered
    const services = await executeQuery(
      `SELECT service_id, service_name, category, description, availability, created_at
       FROM services 
       WHERE student_id = ? 
       ORDER BY created_at DESC`,
      [studentId]
    );

    return NextResponse.json({
      student,
      skillsOffered: skills.filter(k => k.type === 'offered'),
      skillsWanted: skills.filter(k => k.type === 'wanted'),
      services
    });
  } catch (error) {
    console.error('Student profile GET error:', error);
    return NextResponse.json({ error: 'Failed to retrieve student profile' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const studentId = Number(params.id);
    const currentUser = getCurrentUser(request);

    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Verify ownership or admin permission
    if (currentUser.student_id !== studentId && currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized to update this profile' }, { status: 403 });
    }

    const body = await request.json();
    const { name, department, year, college, bio } = body;

    if (!name || !department || !year || !college) {
      return NextResponse.json({ error: 'Name, department, year, and college are required' }, { status: 400 });
    }

    await executeQuery(
      `UPDATE students 
       SET name = ?, department = ?, year = ?, college = ?, bio = ?
       WHERE student_id = ?`,
      [name.trim(), department.trim(), Number(year), college.trim(), bio || '', studentId]
    );

    return NextResponse.json({ message: 'Profile updated successfully!' });
  } catch (error) {
    console.error('Student profile PUT error:', error);
    return NextResponse.json({ error: 'Failed to update student profile' }, { status: 500 });
  }
}


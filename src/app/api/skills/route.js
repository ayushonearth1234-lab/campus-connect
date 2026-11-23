import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'offered'; // 'offered' or 'wanted'
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const level = searchParams.get('experience_level');
    const studentId = searchParams.get('student_id');

    let sql = `
      SELECT 
        k.skill_id,
        k.student_id,
        k.skill_name,
        k.category,
        k.description,
        k.type,
        k.experience_level,
        k.availability,
        k.created_at,
        s.name AS student_name,
        s.email AS student_email,
        s.department,
        s.year,
        s.college
      FROM skills k
      JOIN students s ON k.student_id = s.student_id
      WHERE 1=1
    `;
    const params = [];

    if (type && type !== 'all') {
      sql += ' AND k.type = ?';
      params.push(type);
    }

    if (studentId) {
      sql += ' AND k.student_id = ?';
      params.push(Number(studentId));
    }

    if (category && category !== 'All') {
      sql += ' AND k.category = ?';
      params.push(category);
    }

    if (level && level !== 'All') {
      sql += ' AND k.experience_level = ?';
      params.push(level);
    }

    if (search) {
      sql += ' AND (k.skill_name LIKE ? OR k.description LIKE ? OR s.name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY k.created_at DESC';

    const skills = await executeQuery(sql, params);
    return NextResponse.json({ skills });
  } catch (error) {
    console.error('Skills GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const currentUser = getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: 'Please login to add a skill' }, { status: 401 });
    }

    const body = await request.json();
    const { skill_name, category, description, type = 'offered', experience_level, availability } = body;

    if (!skill_name || !category) {
      return NextResponse.json({ error: 'Skill name and category are required' }, { status: 400 });
    }

    const result = await executeQuery(
      `INSERT INTO skills (student_id, skill_name, category, description, type, experience_level, availability)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        Number(currentUser.student_id),
        skill_name.trim(),
        category.trim(),
        description ? description.trim() : '',
        type === 'wanted' ? 'wanted' : 'offered',
        experience_level || null,
        availability || null
      ]
    );

    return NextResponse.json(
      { message: 'Skill registered successfully!', skill_id: result.insertId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Skills POST error:', error);
    return NextResponse.json({ error: error.message || 'Failed to save skill listing' }, { status: 500 });
  }
}

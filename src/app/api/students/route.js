import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const department = searchParams.get('department');

    let sql = `
      SELECT student_id, name, email, department, year, college, bio, role, created_at 
      FROM students 
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      sql += ' AND (name LIKE ? OR email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (department && department !== 'All') {
      sql += ' AND department = ?';
      params.push(department);
    }

    sql += ' ORDER BY created_at DESC';

    const students = await executeQuery(sql, params);
    return NextResponse.json({ students });
  } catch (error) {
    console.error('Students GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch students list' }, { status: 500 });
  }
}

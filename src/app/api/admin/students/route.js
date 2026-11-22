import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request) {
  try {
    const currentUser = getCurrentUser(request);
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const students = await executeQuery(`
      SELECT 
        s.student_id,
        s.name,
        s.email,
        s.department,
        s.year,
        s.college,
        s.role,
        s.created_at,
        (SELECT COUNT(*) FROM skills WHERE student_id = s.student_id AND type = 'offered') AS skills_offered_count,
        (SELECT COUNT(*) FROM skills WHERE student_id = s.student_id AND type = 'wanted') AS skills_wanted_count,
        (SELECT COUNT(*) FROM services WHERE student_id = s.student_id) AS services_count
      FROM students s
      ORDER BY s.created_at DESC
    `);

    return NextResponse.json({ students });
  } catch (error) {
    console.error('Admin students GET error:', error);
    return NextResponse.json({ error: 'Failed to retrieve admin students' }, { status: 500 });
  }
}


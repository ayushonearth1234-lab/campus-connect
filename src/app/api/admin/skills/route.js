import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request) {
  try {
    const currentUser = getCurrentUser(request);
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const skills = await executeQuery(`
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
        s.department
      FROM skills k
      JOIN students s ON k.student_id = s.student_id
      ORDER BY k.created_at DESC
    `);

    return NextResponse.json({ skills });
  } catch (error) {
    console.error('Admin skills GET error:', error);
    return NextResponse.json({ error: 'Failed to retrieve skills' }, { status: 500 });
  }
}


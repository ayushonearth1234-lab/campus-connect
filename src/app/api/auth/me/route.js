import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { executeQuery } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const userPayload = getCurrentUser(request);
    if (!userPayload) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    // Refresh from MySQL database to get latest profile data
    const rows = await executeQuery(
      'SELECT student_id, name, email, department, year, college, bio, role, created_at FROM students WHERE student_id = ?',
      [userPayload.student_id]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json({ user: null }, { status: 404 });
    }

    return NextResponse.json({ user: rows[0] }, { status: 200 });
  } catch (err) {
    console.error('Me API error:', err);
    return NextResponse.json({ user: null, error: 'Failed to verify session' }, { status: 500 });
  }
}

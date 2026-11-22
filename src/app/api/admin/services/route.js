import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request) {
  try {
    const currentUser = getCurrentUser(request);
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const services = await executeQuery(`
      SELECT 
        srv.service_id,
        srv.student_id,
        srv.service_name,
        srv.category,
        srv.description,
        srv.availability,
        srv.created_at,
        s.name AS provider_name,
        s.email AS provider_email,
        s.department
      FROM services srv
      JOIN students s ON srv.student_id = s.student_id
      ORDER BY srv.created_at DESC
    `);

    return NextResponse.json({ services });
  } catch (error) {
    console.error('Admin services GET error:', error);
    return NextResponse.json({ error: 'Failed to retrieve admin services' }, { status: 500 });
  }
}


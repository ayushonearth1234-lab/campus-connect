import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const studentId = searchParams.get('student_id');

    let sql = `
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
        s.department,
        s.year,
        s.college
      FROM services srv
      JOIN students s ON srv.student_id = s.student_id
      WHERE 1=1
    `;
    const params = [];

    if (studentId) {
      sql += ' AND srv.student_id = ?';
      params.push(Number(studentId));
    }

    if (category && category !== 'All') {
      sql += ' AND srv.category = ?';
      params.push(category);
    }

    if (search) {
      sql += ' AND (srv.service_name LIKE ? OR srv.description LIKE ? OR s.name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY srv.created_at DESC';

    const services = await executeQuery(sql, params);
    return NextResponse.json({ services });
  } catch (error) {
    console.error('Services GET error:', error);
    return NextResponse.json({ error: 'Failed to retrieve services' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const currentUser = getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: 'Please login to offer a service' }, { status: 401 });
    }

    const body = await request.json();
    const { service_name, category, description, availability } = body;

    if (!service_name || !category) {
      return NextResponse.json({ error: 'Service name and category are required' }, { status: 400 });
    }

    const result = await executeQuery(
      `INSERT INTO services (student_id, service_name, category, description, availability)
       VALUES (?, ?, ?, ?, ?)`,
      [
        currentUser.student_id,
        service_name.trim(),
        category.trim(),
        description ? description.trim() : '',
        availability || null
      ]
    );

    return NextResponse.json(
      { message: 'Campus service created successfully!', service_id: result.insertId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Services POST error:', error);
    return NextResponse.json({ error: 'Failed to create service listing' }, { status: 500 });
  }
}

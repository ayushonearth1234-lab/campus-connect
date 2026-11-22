import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function PUT(request, { params }) {
  try {
    const serviceId = Number(params.id);
    const currentUser = getCurrentUser(request);

    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const existing = await executeQuery('SELECT student_id FROM services WHERE service_id = ?', [serviceId]);
    if (!existing || existing.length === 0) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    if (existing[0].student_id !== currentUser.student_id && currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: You do not own this service' }, { status: 403 });
    }

    const body = await request.json();
    const { service_name, category, description, availability } = body;

    await executeQuery(
      `UPDATE services 
       SET service_name = ?, category = ?, description = ?, availability = ?
       WHERE service_id = ?`,
      [
        service_name.trim(),
        category.trim(),
        description || '',
        availability || null,
        serviceId
      ]
    );

    return NextResponse.json({ message: 'Service updated successfully!' });
  } catch (error) {
    console.error('Service PUT error:', error);
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const serviceId = Number(params.id);
    const currentUser = getCurrentUser(request);

    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const existing = await executeQuery('SELECT student_id FROM services WHERE service_id = ?', [serviceId]);
    if (!existing || existing.length === 0) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    if (existing[0].student_id !== currentUser.student_id && currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: You do not own this service' }, { status: 403 });
    }

    await executeQuery('DELETE FROM services WHERE service_id = ?', [serviceId]);

    return NextResponse.json({ message: 'Service deleted successfully.' });
  } catch (error) {
    console.error('Service DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}


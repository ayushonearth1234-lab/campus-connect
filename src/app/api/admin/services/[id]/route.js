import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function DELETE(request, { params }) {
  try {
    const serviceId = Number(params.id);
    const currentUser = getCurrentUser(request);

    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    await executeQuery('DELETE FROM services WHERE service_id = ?', [serviceId]);
    return NextResponse.json({ message: 'Service deleted by administrator.' });
  } catch (error) {
    console.error('Admin delete service error:', error);
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}


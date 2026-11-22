import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function PUT(request, { params }) {
  try {
    const requestId = Number(params.id);
    const currentUser = getCurrentUser(request);

    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const rows = await executeQuery('SELECT * FROM requests WHERE request_id = ?', [requestId]);
    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    const currentReq = rows[0];
    const body = await request.json();
    const { status } = body;

    const validStatuses = ['pending', 'accepted', 'rejected', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    // Role and ownership rules:
    // Receiver can accept or reject
    // Sender can cancel
    // Either (or admin) can mark completed once accepted
    const isReceiver = currentReq.receiver_id === currentUser.student_id;
    const isSender = currentReq.sender_id === currentUser.student_id;
    const isAdmin = currentUser.role === 'admin';

    if (!isReceiver && !isSender && !isAdmin) {
      return NextResponse.json({ error: 'Unauthorized to modify this request' }, { status: 403 });
    }

    if ((status === 'accepted' || status === 'rejected') && !isReceiver && !isAdmin) {
      return NextResponse.json({ error: 'Only the receiver can accept or reject this request' }, { status: 403 });
    }

    if (status === 'cancelled' && !isSender && !isAdmin) {
      return NextResponse.json({ error: 'Only the sender can cancel this request' }, { status: 403 });
    }

    await executeQuery(
      'UPDATE requests SET status = ? WHERE request_id = ?',
      [status, requestId]
    );

    return NextResponse.json({ message: `Request updated to ${status}` });
  } catch (error) {
    console.error('Request PUT error:', error);
    return NextResponse.json({ error: 'Failed to update request' }, { status: 500 });
  }
}


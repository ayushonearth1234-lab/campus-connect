import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const currentUser = getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all'; // 'sent', 'received', or 'all'

    let sql = `
      SELECT 
        r.request_id,
        r.sender_id,
        r.receiver_id,
        r.skill_id,
        r.service_id,
        r.request_type,
        r.description,
        r.status,
        r.created_at,
        sender.name AS sender_name,
        sender.email AS sender_email,
        sender.department AS sender_department,
        receiver.name AS receiver_name,
        receiver.email AS receiver_email,
        receiver.department AS receiver_department,
        COALESCE(k.skill_name, srv.service_name, 'General Exchange') AS target_title
      FROM requests r
      JOIN students sender ON r.sender_id = sender.student_id
      JOIN students receiver ON r.receiver_id = receiver.student_id
      LEFT JOIN skills k ON r.skill_id = k.skill_id
      LEFT JOIN services srv ON r.service_id = srv.service_id
      WHERE (r.sender_id = ? OR r.receiver_id = ?)
      ORDER BY r.created_at DESC
    `;

    const allRequests = await executeQuery(sql, [currentUser.student_id, currentUser.student_id]);

    const sentRequests = allRequests.filter(r => r.sender_id === currentUser.student_id);
    const receivedRequests = allRequests.filter(r => r.receiver_id === currentUser.student_id);

    return NextResponse.json({
      all: allRequests,
      sent: sentRequests,
      received: receivedRequests
    });
  } catch (error) {
    console.error('Requests GET error:', error);
    return NextResponse.json({ error: 'Failed to retrieve requests' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const currentUser = getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: 'Please login to send a request' }, { status: 401 });
    }

    const body = await request.json();
    const { receiver_id, skill_id, service_id, request_type = 'skill', description } = body;

    const receiverId = Number(receiver_id);
    if (!receiverId) {
      return NextResponse.json({ error: 'Receiver ID is required' }, { status: 400 });
    }

    // 1. Prevent self-request
    if (currentUser.student_id === receiverId) {
      return NextResponse.json(
        { error: 'You cannot send an exchange request to yourself.' },
        { status: 400 }
      );
    }

    // 2. Prevent duplicate pending requests for the same skill or service
    let duplicateCheckSql = `
      SELECT request_id FROM requests 
      WHERE sender_id = ? AND receiver_id = ? AND status = 'pending' AND request_type = ?
    `;
    const checkParams = [currentUser.student_id, receiverId, request_type];

    if (skill_id) {
      duplicateCheckSql += ' AND skill_id = ?';
      checkParams.push(Number(skill_id));
    } else if (service_id) {
      duplicateCheckSql += ' AND service_id = ?';
      checkParams.push(Number(service_id));
    }

    const existingPending = await executeQuery(duplicateCheckSql, checkParams);
    if (existingPending && existingPending.length > 0) {
      return NextResponse.json(
        { error: 'You already have an active pending request for this with this student.' },
        { status: 409 }
      );
    }

    // 3. Create request in MySQL
    const result = await executeQuery(
      `INSERT INTO requests (sender_id, receiver_id, skill_id, service_id, request_type, description, status)
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [
        currentUser.student_id,
        receiverId,
        skill_id ? Number(skill_id) : null,
        service_id ? Number(service_id) : null,
        request_type === 'service' ? 'service' : 'skill',
        description ? description.trim() : 'I would like to connect for this exchange.'
      ]
    );

    return NextResponse.json(
      { message: 'Request sent successfully!', request_id: result.insertId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Requests POST error:', error);
    return NextResponse.json({ error: 'Failed to create exchange request' }, { status: 500 });
  }
}

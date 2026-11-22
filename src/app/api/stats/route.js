import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const currentUser = getCurrentUser(request);

    // Global counts (for homepage & admin)
    const allStudents = await executeQuery('SELECT COUNT(*) AS total FROM students');
    const allOfferedSkills = await executeQuery("SELECT COUNT(*) AS total FROM skills WHERE type = 'offered'");
    const allWantedSkills = await executeQuery("SELECT COUNT(*) AS total FROM skills WHERE type = 'wanted'");
    const allServices = await executeQuery('SELECT COUNT(*) AS total FROM services');
    const allRequests = await executeQuery('SELECT COUNT(*) AS total FROM requests');

    const globalStats = {
      totalStudents: allStudents?.[0]?.total || 0,
      totalOfferedSkills: allOfferedSkills?.[0]?.total || 0,
      totalWantedSkills: allWantedSkills?.[0]?.total || 0,
      totalServices: allServices?.[0]?.total || 0,
      totalRequests: allRequests?.[0]?.total || 0,
    };

    if (!currentUser) {
      return NextResponse.json({ global: globalStats, userStats: null });
    }

    const sid = currentUser.student_id;

    // Student personalized stats
    const myOffered = await executeQuery("SELECT COUNT(*) AS total FROM skills WHERE student_id = ? AND type = 'offered'", [sid]);
    const myWanted = await executeQuery("SELECT COUNT(*) AS total FROM skills WHERE student_id = ? AND type = 'wanted'", [sid]);
    const myServices = await executeQuery('SELECT COUNT(*) AS total FROM services WHERE student_id = ?', [sid]);
    const myPending = await executeQuery("SELECT COUNT(*) AS total FROM requests WHERE receiver_id = ? AND status = 'pending'", [sid]);
    const myAccepted = await executeQuery("SELECT COUNT(*) AS total FROM requests WHERE (sender_id = ? OR receiver_id = ?) AND status = 'accepted'", [sid, sid]);

    // Recent activities for current student
    const recentActivities = await executeQuery(`
      SELECT 
        r.request_id,
        r.request_type,
        r.status,
        r.created_at,
        r.sender_id,
        r.receiver_id,
        sender.name AS sender_name,
        receiver.name AS receiver_name,
        COALESCE(k.skill_name, srv.service_name, 'Exchange') AS title
      FROM requests r
      JOIN students sender ON r.sender_id = sender.student_id
      JOIN students receiver ON r.receiver_id = receiver.student_id
      LEFT JOIN skills k ON r.skill_id = k.skill_id
      LEFT JOIN services srv ON r.service_id = srv.service_id
      WHERE r.sender_id = ? OR r.receiver_id = ?
      ORDER BY r.created_at DESC
      LIMIT 5
    `, [sid, sid]);

    const userStats = {
      skillsOffered: myOffered?.[0]?.total || 0,
      skillsWanted: myWanted?.[0]?.total || 0,
      servicesOffered: myServices?.[0]?.total || 0,
      pendingRequests: myPending?.[0]?.total || 0,
      acceptedRequests: myAccepted?.[0]?.total || 0,
      recentActivities: recentActivities || []
    };

    return NextResponse.json({
      global: globalStats,
      userStats
    });
  } catch (error) {
    console.error('Stats GET error:', error);
    return NextResponse.json({ error: 'Failed to retrieve stats' }, { status: 500 });
  }
}

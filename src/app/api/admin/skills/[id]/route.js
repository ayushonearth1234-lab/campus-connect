import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function DELETE(request, { params }) {
  try {
    const skillId = Number(params.id);
    const currentUser = getCurrentUser(request);

    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    await executeQuery('DELETE FROM skills WHERE skill_id = ?', [skillId]);
    return NextResponse.json({ message: 'Skill deleted by administrator.' });
  } catch (error) {
    console.error('Admin delete skill error:', error);
    return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 });
  }
}


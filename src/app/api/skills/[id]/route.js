import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function PUT(request, { params }) {
  try {
    const skillId = Number(params.id);
    const currentUser = getCurrentUser(request);

    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Check ownership
    const existing = await executeQuery('SELECT student_id FROM skills WHERE skill_id = ?', [skillId]);
    if (!existing || existing.length === 0) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    if (existing[0].student_id !== currentUser.student_id && currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: You do not own this skill' }, { status: 403 });
    }

    const body = await request.json();
    const { skill_name, category, description, experience_level, availability } = body;

    await executeQuery(
      `UPDATE skills 
       SET skill_name = ?, category = ?, description = ?, experience_level = ?, availability = ?
       WHERE skill_id = ?`,
      [
        skill_name.trim(),
        category.trim(),
        description || '',
        experience_level || null,
        availability || null,
        skillId
      ]
    );

    return NextResponse.json({ message: 'Skill updated successfully!' });
  } catch (error) {
    console.error('Skill PUT error:', error);
    return NextResponse.json({ error: 'Failed to update skill' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const skillId = Number(params.id);
    const currentUser = getCurrentUser(request);

    if (!currentUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const existing = await executeQuery('SELECT student_id FROM skills WHERE skill_id = ?', [skillId]);
    if (!existing || existing.length === 0) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    if (existing[0].student_id !== currentUser.student_id && currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: You do not own this skill' }, { status: 403 });
    }

    await executeQuery('DELETE FROM skills WHERE skill_id = ?', [skillId]);

    return NextResponse.json({ message: 'Skill deleted successfully.' });
  } catch (error) {
    console.error('Skill DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 });
  }
}


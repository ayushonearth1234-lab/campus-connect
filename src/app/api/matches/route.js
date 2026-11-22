import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { findSkillMatches } from '@/lib/matching';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const currentUser = getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ matches: [], message: 'Login to view personalized skill matches' }, { status: 200 });
    }

    const matches = await findSkillMatches(currentUser.student_id);
    return NextResponse.json({ matches });
  } catch (error) {
    console.error('Skill matching error:', error);
    return NextResponse.json({ error: 'Failed to compute skill matches' }, { status: 500 });
  }
}

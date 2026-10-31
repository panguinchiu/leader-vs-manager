import { NextResponse } from 'next/server';
import { getDb } from '../../../../lib/db';
import { verifyAdminToken } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const user = verifyAdminToken(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = getDb();

    const total = db.prepare('SELECT COUNT(*) as count FROM responses').get().count;

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const todayCount = db.prepare(
      "SELECT COUNT(*) as count FROM responses WHERE date(created_at) = date(?)"
    ).get(todayStr).count;

    const personaRows = db.prepare(
      'SELECT persona_type, COUNT(*) as count FROM responses GROUP BY persona_type'
    ).all();
    const byPersona = {
      strongLeader: 0,
      leanLeader: 0,
      balanced: 0,
      leanManager: 0,
      strongManager: 0,
    };
    for (const row of personaRows) {
      if (row.persona_type in byPersona) {
        byPersona[row.persona_type] = row.count;
      }
    }

    const recentResponses = db.prepare(
      'SELECT id, created_at, name, grade, persona_type, leader_score, manager_score, leader_pct FROM responses ORDER BY created_at DESC LIMIT 10'
    ).all();

    return NextResponse.json({ total, today: todayCount, byPersona, recentResponses });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

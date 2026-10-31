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
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const personaType = searchParams.get('personaType') || '';
    const nameFilter = searchParams.get('name') || '';
    const gradeFilter = searchParams.get('grade') || '';
    const offset = (page - 1) * limit;

    const conditions = [];
    const params = [];
    if (personaType) { conditions.push('persona_type = ?'); params.push(personaType); }
    if (nameFilter)  { conditions.push('name LIKE ?');      params.push(`%${nameFilter}%`); }
    if (gradeFilter) { conditions.push('grade = ?');        params.push(gradeFilter); }
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const totalRow = db.prepare(`SELECT COUNT(*) as count FROM responses ${whereClause}`).get(...params);
    const total = totalRow.count;

    const responses = db.prepare(
      `SELECT id, created_at, name, grade, persona_type, leader_score, manager_score, leader_pct
       FROM responses ${whereClause}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`
    ).all(...params, limit, offset);

    return NextResponse.json({
      responses,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Responses error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

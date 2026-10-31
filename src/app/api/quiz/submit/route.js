import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../../../../lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const { answers, scores, dimScores, personaType, leaderPct, name, grade } = body;

    if (!answers || !scores || !personaType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = getDb();
    const id = uuidv4();

    db.prepare(`
      INSERT INTO responses (id, name, grade, persona_type, leader_score, manager_score, leader_pct, dimension_scores, answers)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      name || '',
      grade || '',
      personaType,
      scores.leader,
      scores.manager,
      leaderPct || 50,
      JSON.stringify(dimScores || {}),
      JSON.stringify(answers || [])
    );

    return NextResponse.json({ id });
  } catch (error) {
    console.error('Submit error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getDb } from '../../../../../lib/db';
import { verifyAdminToken } from '../../../../../lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  const user = verifyAdminToken(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = getDb();
    const response = db.prepare('SELECT * FROM responses WHERE id = ?').get(params.id);

    if (!response) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Response detail error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const user = verifyAdminToken(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = getDb();
    const result = db.prepare('DELETE FROM responses WHERE id = ?').run(params.id);

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

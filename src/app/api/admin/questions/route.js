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
    const questions = db.prepare('SELECT * FROM questions ORDER BY sort_order').all();
    return NextResponse.json({ questions });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  const user = verifyAdminToken(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = getDb();
    const body = await request.json();
    const { sort_order, dimension, dim_key, text, options } = body;

    if (!dimension || !dim_key || !text || !options) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const maxOrder = db.prepare('SELECT MAX(sort_order) as max FROM questions').get();
    const newOrder = sort_order || (maxOrder.max || 0) + 1;

    const result = db.prepare(
      'INSERT INTO questions (sort_order, dimension, dim_key, text, options) VALUES (?, ?, ?, ?, ?)'
    ).run(newOrder, dimension, dim_key, text, JSON.stringify(options));

    const question = db.prepare('SELECT * FROM questions WHERE id = ?').get(result.lastInsertRowid);
    return NextResponse.json({ question }, { status: 201 });
  } catch (error) {
    console.error('Create question error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  const user = verifyAdminToken(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = getDb();
    const body = await request.json();
    const { id, sort_order, dimension, dim_key, text, options, active } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const existing = db.prepare('SELECT id FROM questions WHERE id = ?').get(id);
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    db.prepare(`
      UPDATE questions SET
        sort_order = COALESCE(?, sort_order),
        dimension = COALESCE(?, dimension),
        dim_key = COALESCE(?, dim_key),
        text = COALESCE(?, text),
        options = COALESCE(?, options),
        active = COALESCE(?, active)
      WHERE id = ?
    `).run(
      sort_order ?? null,
      dimension ?? null,
      dim_key ?? null,
      text ?? null,
      options ? JSON.stringify(options) : null,
      active !== undefined ? (active ? 1 : 0) : null,
      id
    );

    const question = db.prepare('SELECT * FROM questions WHERE id = ?').get(id);
    return NextResponse.json({ question });
  } catch (error) {
    console.error('Update question error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const user = verifyAdminToken(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = getDb();
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const result = db.prepare('DELETE FROM questions WHERE id = ?').run(id);
    if (result.changes === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete question error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

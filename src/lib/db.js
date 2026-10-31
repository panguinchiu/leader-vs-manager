import Database from 'better-sqlite3';
import path from 'path';
import { mkdirSync } from 'fs';
import bcrypt from 'bcryptjs';
import { QUESTIONS } from './quiz-data.js';

function initDb() {
  const dataDir = process.env.DATABASE_DIR || path.join(process.cwd(), 'data');
  mkdirSync(dataDir, { recursive: true });
  const dbPath = path.join(dataDir, 'quiz.db');
  const db = new Database(dbPath);

  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS responses (
      id TEXT PRIMARY KEY,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      name TEXT DEFAULT '',
      grade TEXT DEFAULT '',
      persona_type TEXT NOT NULL,
      leader_score INTEGER NOT NULL,
      manager_score INTEGER NOT NULL,
      leader_pct INTEGER NOT NULL,
      dimension_scores TEXT NOT NULL,
      answers TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sort_order INTEGER NOT NULL,
      dimension TEXT NOT NULL,
      dim_key TEXT NOT NULL,
      text TEXT NOT NULL,
      options TEXT NOT NULL,
      active INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    );
  `);

  // Migrate: add name/grade columns if not exists
  const cols = db.pragma('table_info(responses)').map(c => c.name);
  if (!cols.includes('name'))  db.exec("ALTER TABLE responses ADD COLUMN name TEXT DEFAULT ''");
  if (!cols.includes('grade')) db.exec("ALTER TABLE responses ADD COLUMN grade TEXT DEFAULT ''");

  // Seed admin user
  const adminExists = db.prepare('SELECT id FROM admin_users WHERE username = ?').get('admin');
  if (!adminExists) {
    const passwordHash = bcrypt.hashSync(process.env.ADMIN_PASSWORD || require('crypto').randomBytes(16).toString('hex'), 10);
    db.prepare('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)').run('admin', passwordHash);
  }

  // Seed questions
  const questionCount = db.prepare('SELECT COUNT(*) as count FROM questions').get();
  if (questionCount.count === 0) {
    const insertQuestion = db.prepare(
      'INSERT INTO questions (sort_order, dimension, dim_key, text, options) VALUES (?, ?, ?, ?, ?)'
    );
    for (let i = 0; i < QUESTIONS.length; i++) {
      const q = QUESTIONS[i];
      insertQuestion.run(i + 1, q.dimension, q.dimKey, q.text, JSON.stringify(q.options));
    }
  }

  return db;
}

export function getDb() {
  if (process.env.NODE_ENV === 'production') {
    if (!global._dbProd) global._dbProd = initDb();
    return global._dbProd;
  } else {
    if (!global._db) global._db = initDb();
    return global._db;
  }
}

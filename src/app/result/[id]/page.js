import { getDb } from '../../../lib/db';
import { PERSONAS, DIMENSION_LABELS } from '../../../lib/quiz-data';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getResult(id) {
  try {
    const db = getDb();
    const row = db.prepare('SELECT * FROM responses WHERE id = ?').get(id);
    return row || null;
  } catch {
    return null;
  }
}

export default async function ResultPage({ params }) {
  const result = await getResult(params.id);

  if (!result) {
    return (
      <>
        <div className="top-bar">
          <span className="site-label">心理測驗 · Psychology Quiz</span>
        </div>
        <div className="container">
          <div style={{ padding: '80px 0', textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', marginBottom: '16px', color: 'var(--ink)' }}>
              找不到測驗結果
            </h2>
            <p style={{ color: 'var(--muted)', marginBottom: '32px' }}>此結果連結可能已失效或不存在。</p>
            <Link href="/" className="btn-start">重新測驗</Link>
          </div>
        </div>
      </>
    );
  }

  const persona = PERSONAS[result.persona_type];
  const dimScores = JSON.parse(result.dimension_scores || '{}');
  const total = result.leader_score + result.manager_score;
  const leaderPct = total > 0 ? Math.round((result.leader_score / total) * 100) : 50;
  const managerPct = 100 - leaderPct;

  const createdAt = new Date(result.created_at);
  const dateStr = createdAt.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <div className="top-bar">
        <span className="site-label">心理測驗 · Psychology Quiz</span>
        <span>{dateStr}</span>
      </div>
      <div className="container">
        <div className="result-wrapper">
          <div className="result-header">
            <div className={`result-type-badge ${persona?.type || 'leader'}`}>
              {persona?.type === 'leader' ? '領導人型' : '經理人型'}
            </div>
            <h1 className="result-title">{persona?.title || '測驗結果'}</h1>
            <p className="result-label">{persona?.label || ''}</p>
          </div>

          {/* Dimension bars */}
          <div className="dimensions-section">
            <div className="section-heading">各維度分析</div>
            {Object.keys(DIMENSION_LABELS).map((dk) => {
              const d = dimScores[dk] || { leader: 0, manager: 0 };
              const dtotal = d.leader + d.manager;
              const lPct = dtotal > 0 ? Math.round((d.leader / dtotal) * 100) : 50;
              const isLeader = lPct >= 50;
              const pct = isLeader ? lPct : 100 - lPct;
              return (
                <div className="dim-row" key={dk}>
                  <span className="dim-label">{DIMENSION_LABELS[dk]}</span>
                  <div className="dim-bar-container">
                    <div
                      className={`dim-bar-fill ${isLeader ? '' : 'manager'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="dim-pct" style={{ color: isLeader ? 'var(--leader-color)' : 'var(--manager-color)' }}>
                    {pct}%
                  </span>
                </div>
              );
            })}
            <div style={{ display: 'flex', gap: '20px', marginTop: '12px', fontSize: '12px', color: 'var(--muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '12px', height: '12px', background: 'var(--leader-color)', display: 'inline-block' }} />
                領導人傾向
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '12px', height: '12px', background: 'var(--manager-color)', display: 'inline-block' }} />
                經理人傾向
              </span>
            </div>
          </div>

          {/* Overall score */}
          <div className="card-section" style={{ marginBottom: '32px' }}>
            <div className="section-heading">整體比例</div>
            <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: '900', fontFamily: 'var(--font-serif)', color: 'var(--leader-color)' }}>
                  {leaderPct}%
                </div>
                <div style={{ fontSize: '12px', color: 'var(--muted)', letterSpacing: '1px' }}>領導人</div>
              </div>
              <div style={{ flex: 1, height: '12px', background: 'var(--border)', position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: 0, top: 0, bottom: 0,
                  width: `${leaderPct}%`,
                  background: 'var(--leader-color)',
                }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: '900', fontFamily: 'var(--font-serif)', color: 'var(--manager-color)' }}>
                  {managerPct}%
                </div>
                <div style={{ fontSize: '12px', color: 'var(--muted)', letterSpacing: '1px' }}>經理人</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="description-section">
            <div className="section-heading">關於你的類型</div>
            <p className="description-text">{persona?.description || ''}</p>
          </div>

          {/* MBTI */}
          {persona?.mbti && (
            <div className="mbti-section">
              <div className="mbti-label">MBTI 連結</div>
              <p className="mbti-text">{persona.mbti}</p>
            </div>
          )}

          {/* Persona card */}
          {persona && (
            <>
              <div className="section-heading" style={{ marginBottom: '16px' }}>對應人物</div>
              <div className="persona-card">
                <div className="persona-emoji">{persona.personaEmoji}</div>
                <div className="persona-info">
                  <div className="persona-name">{persona.personaName}</div>
                  <div className="persona-role">{persona.personaRole}</div>
                  <p className="persona-quote">{persona.personaQuote}</p>
                </div>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="result-actions">
            <Link href="/" className="btn-retake">重新測驗</Link>
          </div>
        </div>
      </div>
    </>
  );
}

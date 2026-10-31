'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '../../../../components/AdminLayout';
import Link from 'next/link';
import { PERSONAS, DIMENSION_LABELS } from '../../../../lib/quiz-data';

const PERSONA_TYPES = {
  strongLeader: 'leader',
  leanLeader: 'leader',
  balanced: 'leader',
  leanManager: 'manager',
  strongManager: 'manager',
};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ResponseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchResponse(token);
  }, [params.id, router]);

  async function fetchResponse(token) {
    try {
      const res = await fetch(`/api/admin/responses/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      if (res.status === 404) {
        router.push('/admin/responses');
        return;
      }
      const data = await res.json();
      setResponse(data);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm('確定要刪除此筆紀錄嗎？')) return;
    const token = localStorage.getItem('admin_token');
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/responses/${params.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        router.push('/admin/responses');
      }
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return <AdminLayout title="測驗詳情"><div className="loading">載入中...</div></AdminLayout>;
  }

  if (!response) return null;

  const persona = PERSONAS[response.persona_type];
  const dimScores = JSON.parse(response.dimension_scores || '{}');
  const total = response.leader_score + response.manager_score;
  const leaderPct = total > 0 ? Math.round((response.leader_score / total) * 100) : 50;

  return (
    <AdminLayout title="測驗詳情">
      <div style={{ marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Link href="/admin/responses" className="admin-btn outline small">
          ← 返回列表
        </Link>
        <button
          className="admin-btn danger small"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? '刪除中...' : '刪除此紀錄'}
        </button>
      </div>

      <div className="card-section">
        <div className="card-section-title">基本資訊</div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td style={{ padding: '8px 0', fontWeight: '700', fontSize: '13px', color: 'var(--muted)', width: '120px' }}>紀錄 ID</td>
              <td style={{ padding: '8px 0', fontSize: '13px', fontFamily: 'monospace' }}>{response.id}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', fontWeight: '700', fontSize: '13px', color: 'var(--muted)' }}>測驗時間</td>
              <td style={{ padding: '8px 0', fontSize: '13px' }}>{formatDate(response.created_at)}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', fontWeight: '700', fontSize: '13px', color: 'var(--muted)' }}>人格類型</td>
              <td style={{ padding: '8px 0' }}>
                <span className={`badge ${PERSONA_TYPES[response.persona_type] || 'leader'}`}>
                  {persona?.label || response.persona_type}
                </span>
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', fontWeight: '700', fontSize: '13px', color: 'var(--muted)' }}>領導人得分</td>
              <td style={{ padding: '8px 0', fontSize: '13px' }}>{response.leader_score} 分（{leaderPct}%）</td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', fontWeight: '700', fontSize: '13px', color: 'var(--muted)' }}>經理人得分</td>
              <td style={{ padding: '8px 0', fontSize: '13px' }}>{response.manager_score} 分（{100 - leaderPct}%）</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Dimension scores */}
      <div className="card-section">
        <div className="card-section-title">各維度分析</div>
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
      </div>

      {/* Persona card */}
      {persona && (
        <div className="card-section">
          <div className="card-section-title">對應人物</div>
          <div className="persona-card" style={{ border: 'none', padding: '0', margin: '0' }}>
            <div className="persona-emoji">{persona.personaEmoji}</div>
            <div className="persona-info">
              <div className="persona-name">{persona.personaName}</div>
              <div className="persona-role">{persona.personaRole}</div>
              <p className="persona-quote">{persona.personaQuote}</p>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop: '16px' }}>
        <Link href={`/result/${response.id}`} className="admin-btn outline small" target="_blank">
          查看分享頁面 →
        </Link>
      </div>
    </AdminLayout>
  );
}

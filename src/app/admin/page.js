'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../../components/AdminLayout';
import Link from 'next/link';

const PERSONA_LABELS = {
  strongLeader: '願景型領導人',
  leanLeader: '創新型領導人',
  balanced: '雙棲型人才',
  leanManager: '策略型經理人',
  strongManager: '秩序型經理人',
};

const PERSONA_TYPES = {
  strongLeader: 'leader',
  leanLeader: 'leader',
  balanced: 'leader',
  leanManager: 'manager',
  strongManager: 'manager',
};

const PERSONA_COLORS = {
  strongLeader: '#c23b22',
  leanLeader: '#e06b50',
  balanced: '#b8860b',
  leanManager: '#4a7fa0',
  strongManager: '#2c5f7c',
};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function PieChart({ byPersona, total }) {
  if (!total) return <div style={{ color: 'var(--muted)', fontSize: '13px' }}>暫無資料</div>;

  const data = Object.entries(byPersona)
    .filter(([, v]) => v > 0)
    .map(([key, value]) => ({ key, value, label: PERSONA_LABELS[key], color: PERSONA_COLORS[key] }));

  if (data.length === 0) return <div style={{ color: 'var(--muted)', fontSize: '13px' }}>暫無資料</div>;

  const cx = 100, cy = 100, r = 85;
  let angle = -Math.PI / 2;

  const slices = data.map(d => {
    const sweep = (d.value / total) * 2 * Math.PI;
    const start = angle;
    angle += sweep;
    const end = angle;
    const x1 = cx + r * Math.cos(start);
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);
    const large = sweep > Math.PI ? 1 : 0;
    const path = `M ${cx} ${cy} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;
    const pct = Math.round((d.value / total) * 100);
    return { ...d, path, pct };
  });

  return (
    <div style={{ display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap' }}>
      <svg viewBox="0 0 200 200" width="160" height="160" style={{ flexShrink: 0 }}>
        {slices.map((s) => (
          <path key={s.key} d={s.path} fill={s.color} stroke="#fff" strokeWidth="2" />
        ))}
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {slices.map((s) => (
          <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <span style={{ width: '12px', height: '12px', background: s.color, display: 'inline-block', flexShrink: 0 }} />
            <span style={{ color: 'var(--muted)', minWidth: '100px' }}>{s.label}</span>
            <span style={{ fontWeight: '700', color: 'var(--ink)' }}>{s.value} ({s.pct}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchStats(token);
  }, [router]);

  async function fetchStats(token) {
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      const data = await res.json();
      setStats(data);
    } catch {
      setError('無法載入統計資料');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminLayout title="儀表板">
      {loading ? (
        <div className="loading">載入中...</div>
      ) : error ? (
        <div className="error-msg">{error}</div>
      ) : stats ? (
        <>
          {/* Stat cards */}
          <div className="stat-cards">
            <div className="stat-card">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">累計測驗次數</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.today}</div>
              <div className="stat-label">今日測驗次數</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: 'var(--leader-color)' }}>
                {stats.byPersona.strongLeader + stats.byPersona.leanLeader + stats.byPersona.balanced}
              </div>
              <div className="stat-label">領導人型</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: 'var(--manager-color)' }}>
                {stats.byPersona.leanManager + stats.byPersona.strongManager}
              </div>
              <div className="stat-label">經理人型</div>
            </div>
          </div>

          {/* Persona breakdown + pie chart side by side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            {/* Bar chart */}
            <div className="card-section" style={{ marginBottom: 0 }}>
              <div className="card-section-title">人格類型分布</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {Object.entries(stats.byPersona).map(([key, count]) => {
                  const total = stats.total || 1;
                  const pct = Math.round((count / total) * 100);
                  return (
                    <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ width: '100px', fontSize: '12px', color: 'var(--muted)', flexShrink: 0 }}>
                        {PERSONA_LABELS[key]}
                      </span>
                      <div style={{ flex: 1, height: '8px', background: 'var(--border)' }}>
                        <div style={{
                          height: '100%',
                          width: `${pct}%`,
                          background: PERSONA_COLORS[key],
                          transition: 'width 0.5s ease',
                        }} />
                      </div>
                      <span style={{ width: '60px', fontSize: '13px', fontWeight: '700', color: 'var(--ink)', textAlign: 'right' }}>
                        {count} ({pct}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pie chart */}
            <div className="card-section" style={{ marginBottom: 0 }}>
              <div className="card-section-title">佔比圓餅圖</div>
              <PieChart byPersona={stats.byPersona} total={stats.total} />
            </div>
          </div>

          {/* Recent responses */}
          <div className="card-section">
            <div className="card-section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>最近測驗紀錄</span>
              <Link href="/admin/responses" className="admin-btn outline small">
                查看全部
              </Link>
            </div>
            {stats.recentResponses && stats.recentResponses.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>日期</th>
                    <th>姓名</th>
                    <th>年級</th>
                    <th>人格類型</th>
                    <th>領導人%</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentResponses.map((r) => (
                    <tr key={r.id}>
                      <td style={{ fontSize: '13px', color: 'var(--muted)' }}>{formatDate(r.created_at)}</td>
                      <td style={{ fontWeight: '600' }}>{r.name || '—'}</td>
                      <td style={{ fontSize: '13px', color: 'var(--muted)' }}>{r.grade || '—'}</td>
                      <td>
                        <span className={`badge ${PERSONA_TYPES[r.persona_type] || 'leader'}`}>
                          {PERSONA_LABELS[r.persona_type] || r.persona_type}
                        </span>
                      </td>
                      <td style={{ fontWeight: '700' }}>{r.leader_pct}%</td>
                      <td>
                        <Link href={`/admin/responses/${r.id}`} className="admin-btn outline small">
                          詳情
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <p>尚無測驗紀錄</p>
              </div>
            )}
          </div>
        </>
      ) : null}
    </AdminLayout>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../../../components/AdminLayout';
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

const GRADE_OPTIONS = ['111級', '112級', '113級', '其他'];

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ResponsesPage() {
  const router = useRouter();
  const [responses, setResponses] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [personaFilter, setPersonaFilter] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const debounceRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchResponses(token, page, personaFilter, nameFilter, gradeFilter);
  }, [page, personaFilter, gradeFilter, router]);

  // Debounce name filter
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const token = localStorage.getItem('admin_token');
      if (!token) return;
      fetchResponses(token, 1, personaFilter, nameFilter, gradeFilter);
      setPage(1);
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [nameFilter]);

  async function fetchResponses(token, p, persona, name, grade) {
    setLoading(true);
    try {
      let url = `/api/admin/responses?page=${p}&limit=20`;
      if (persona) url += `&personaType=${persona}`;
      if (name)    url += `&name=${encodeURIComponent(name)}`;
      if (grade)   url += `&grade=${encodeURIComponent(grade)}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      const data = await res.json();
      setResponses(data.responses || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } finally {
      setLoading(false);
    }
  }

  function handlePersonaChange(e) {
    setPersonaFilter(e.target.value);
    setPage(1);
  }

  function handleGradeChange(e) {
    setGradeFilter(e.target.value);
    setPage(1);
  }

  const inputStyle = {
    padding: '8px 12px',
    fontSize: '13px',
    border: '1.5px solid var(--border)',
    background: '#fff',
    fontFamily: 'var(--font-sans)',
    color: 'var(--ink)',
    outline: 'none',
  };

  return (
    <AdminLayout title="測驗紀錄">
      {/* Filter bar */}
      <div className="filter-bar" style={{ gap: '10px', marginBottom: '16px' }}>
        <span style={{ fontSize: '13px', color: 'var(--muted)', whiteSpace: 'nowrap' }}>共 {total} 筆</span>

        <input
          type="text"
          placeholder="搜尋姓名…"
          value={nameFilter}
          onChange={e => setNameFilter(e.target.value)}
          style={{ ...inputStyle, width: '140px' }}
        />

        <select value={gradeFilter} onChange={handleGradeChange} style={inputStyle}>
          <option value="">全部年級</option>
          {GRADE_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
        </select>

        <select value={personaFilter} onChange={handlePersonaChange} style={inputStyle}>
          <option value="">全部類型</option>
          {Object.entries(PERSONA_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>

        {(nameFilter || gradeFilter || personaFilter) && (
          <button
            onClick={() => { setNameFilter(''); setGradeFilter(''); setPersonaFilter(''); setPage(1); }}
            style={{ ...inputStyle, cursor: 'pointer', color: 'var(--accent)', borderColor: 'var(--accent)', background: 'transparent' }}
          >
            清除篩選
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading">載入中...</div>
      ) : responses.length === 0 ? (
        <div className="empty-state">
          <p>尚無測驗紀錄</p>
        </div>
      ) : (
        <>
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
              {responses.map((r) => (
                <tr key={r.id}>
                  <td style={{ fontSize: '13px', color: 'var(--muted)' }}>{formatDate(r.created_at)}</td>
                  <td style={{ fontWeight: '600' }}>{r.name || '—'}</td>
                  <td style={{ fontSize: '13px', color: 'var(--muted)' }}>{r.grade || '—'}</td>
                  <td>
                    <span className={`badge ${PERSONA_TYPES[r.persona_type] || 'leader'}`}>
                      {PERSONA_LABELS[r.persona_type] || r.persona_type}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: '700', color: r.leader_pct >= 50 ? 'var(--leader-color)' : 'var(--manager-color)' }}>
                      {r.leader_pct}%
                    </span>
                  </td>
                  <td>
                    <Link href={`/admin/responses/${r.id}`} className="admin-btn outline small">
                      詳情
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                ← 上一頁
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let p;
                if (totalPages <= 7) {
                  p = i + 1;
                } else if (page <= 4) {
                  p = i + 1;
                } else if (page >= totalPages - 3) {
                  p = totalPages - 6 + i;
                } else {
                  p = page - 3 + i;
                }
                return (
                  <button
                    key={p}
                    className={page === p ? 'active' : ''}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                下一頁 →
              </button>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}

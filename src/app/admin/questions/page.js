'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../../../components/AdminLayout';

const DIM_OPTIONS = [
  { key: 'personality', label: '個性面向' },
  { key: 'goals', label: '目標追求' },
  { key: 'work', label: '工作方式' },
  { key: 'relationship', label: '人際關係' },
  { key: 'identity', label: '自我意識' },
];

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

function defaultOptions() {
  return [
    { text: '', score: { leader: 1, manager: 4 } },
    { text: '', score: { leader: 4, manager: 1 } },
    { text: '', score: { leader: 2, manager: 3 } },
    { text: '', score: { leader: 3, manager: 2 } },
  ];
}

export default function QuestionsPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingQ, setEditingQ] = useState(null); // question being edited
  const [showModal, setShowModal] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    id: null,
    sort_order: 1,
    dimension: '個性面向',
    dim_key: 'personality',
    text: '',
    options: defaultOptions(),
    active: 1,
  });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchQuestions(token);
  }, [router]);

  async function fetchQuestions(token) {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/questions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      const data = await res.json();
      setQuestions(data.questions || []);
    } finally {
      setLoading(false);
    }
  }

  function openEdit(q) {
    const opts = typeof q.options === 'string' ? JSON.parse(q.options) : q.options;
    setEditForm({
      id: q.id,
      sort_order: q.sort_order,
      dimension: q.dimension,
      dim_key: q.dim_key,
      text: q.text,
      options: opts,
      active: q.active,
    });
    setIsNew(false);
    setShowModal(true);
  }

  function openNew() {
    const maxOrder = questions.reduce((m, q) => Math.max(m, q.sort_order), 0);
    setEditForm({
      id: null,
      sort_order: maxOrder + 1,
      dimension: '個性面向',
      dim_key: 'personality',
      text: '',
      options: defaultOptions(),
      active: 1,
    });
    setIsNew(true);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingQ(null);
  }

  function handleFormChange(field, value) {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleDimChange(e) {
    const selected = DIM_OPTIONS.find((d) => d.key === e.target.value);
    if (selected) {
      setEditForm((prev) => ({
        ...prev,
        dim_key: selected.key,
        dimension: selected.label,
      }));
    }
  }

  function handleOptionText(idx, text) {
    setEditForm((prev) => {
      const opts = [...prev.options];
      opts[idx] = { ...opts[idx], text };
      return { ...prev, options: opts };
    });
  }

  function handleOptionScore(idx, type, value) {
    setEditForm((prev) => {
      const opts = [...prev.options];
      opts[idx] = { ...opts[idx], score: { ...opts[idx].score, [type]: parseInt(value, 10) || 0 } };
      return { ...prev, options: opts };
    });
  }

  async function handleSave() {
    const token = localStorage.getItem('admin_token');
    setSaving(true);
    try {
      const method = isNew ? 'POST' : 'PUT';
      const body = {
        ...editForm,
        options: editForm.options,
      };
      const res = await fetch('/api/admin/questions', {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        closeModal();
        fetchQuestions(token);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(q) {
    const token = localStorage.getItem('admin_token');
    await fetch('/api/admin/questions', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: q.id, active: q.active ? 0 : 1 }),
    });
    fetchQuestions(token);
  }

  async function handleDelete(q) {
    if (!confirm(`確定要刪除題目「${q.text.slice(0, 20)}...」嗎？`)) return;
    const token = localStorage.getItem('admin_token');
    await fetch('/api/admin/questions', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: q.id }),
    });
    fetchQuestions(token);
  }

  return (
    <AdminLayout title="題目管理">
      <div className="warning-box">
        ⚠️ 題目修改後需重新啟動應用程式，才能在新測驗中生效。
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
        <button className="admin-btn primary" onClick={openNew}>
          + 新增題目
        </button>
      </div>

      {loading ? (
        <div className="loading">載入中...</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '48px' }}>#</th>
              <th style={{ width: '90px' }}>維度</th>
              <th>題目</th>
              <th style={{ width: '70px' }}>狀態</th>
              <th style={{ width: '140px' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => (
              <tr key={q.id}>
                <td style={{ fontWeight: '700', color: 'var(--muted)', fontSize: '13px' }}>
                  {q.sort_order}
                </td>
                <td>
                  <span style={{ fontSize: '12px', color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                    {q.dimension}
                  </span>
                </td>
                <td>
                  <span style={{ fontSize: '14px', color: q.active ? 'var(--ink)' : 'var(--muted)' }}>
                    {q.text.length > 50 ? q.text.slice(0, 50) + '...' : q.text}
                  </span>
                </td>
                <td>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    letterSpacing: '1px',
                    color: q.active ? '#2a7a4b' : 'var(--muted)',
                  }}>
                    {q.active ? '啟用' : '停用'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button className="admin-btn outline small" onClick={() => openEdit(q)}>
                      編輯
                    </button>
                    <button
                      className="admin-btn outline small"
                      onClick={() => handleToggleActive(q)}
                      style={{ fontSize: '11px' }}
                    >
                      {q.active ? '停用' : '啟用'}
                    </button>
                    <button className="admin-btn danger small" onClick={() => handleDelete(q)}>
                      刪除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal-content">
            <div className="modal-title">
              {isNew ? '新增題目' : '編輯題目'}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>排序</label>
                <input
                  type="number"
                  value={editForm.sort_order}
                  onChange={(e) => handleFormChange('sort_order', parseInt(e.target.value, 10))}
                  min={1}
                />
              </div>
              <div className="form-group">
                <label>維度</label>
                <select value={editForm.dim_key} onChange={handleDimChange}>
                  {DIM_OPTIONS.map((d) => (
                    <option key={d.key} value={d.key}>{d.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>題目內容</label>
              <textarea
                value={editForm.text}
                onChange={(e) => handleFormChange('text', e.target.value)}
                placeholder="輸入題目..."
                style={{ minHeight: '80px' }}
              />
            </div>

            <div style={{ marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: 'var(--ink)', letterSpacing: '0.5px' }}>
              選項（每個選項設定文字及領導/經理人分數 1-4）
            </div>
            {editForm.options.map((opt, idx) => (
              <div key={idx} style={{ border: '1px solid var(--border)', padding: '12px', marginBottom: '10px', background: '#faf8f4' }}>
                <div style={{ fontWeight: '700', fontSize: '12px', color: 'var(--accent)', marginBottom: '8px', letterSpacing: '1px' }}>
                  選項 {OPTION_LETTERS[idx]}
                </div>
                <div className="form-group" style={{ marginBottom: '10px' }}>
                  <label>文字</label>
                  <input
                    type="text"
                    value={opt.text}
                    onChange={(e) => handleOptionText(idx, e.target.value)}
                    placeholder={`選項 ${OPTION_LETTERS[idx]} 的描述`}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>領導人分數</label>
                    <input
                      type="number"
                      value={opt.score.leader}
                      onChange={(e) => handleOptionScore(idx, 'leader', e.target.value)}
                      min={1} max={4}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>經理人分數</label>
                    <input
                      type="number"
                      value={opt.score.manager}
                      onChange={(e) => handleOptionScore(idx, 'manager', e.target.value)}
                      min={1} max={4}
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="modal-actions">
              <button className="admin-btn outline" onClick={closeModal}>取消</button>
              <button className="admin-btn primary" onClick={handleSave} disabled={saving}>
                {saving ? '儲存中...' : '儲存'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

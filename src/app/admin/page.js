'use client';
import { useEffect, useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from 'recharts';
import { getSupabase } from '../../lib/supabase';
import { SUPABASE_TABLE } from '../../lib/config';

const DIMS = [
  ['personality', '個性面向'], ['goals', '目標追求'], ['work', '工作方式'],
  ['relationship', '人際關係'], ['identity', '自我意識'],
];
const TYPE_LABEL = {
  strongLeader: '強烈領導人型', leanLeader: '偏領導人型', balanced: '平衡型',
  leanManager: '偏經理人型', strongManager: '強烈經理人型',
};
const TYPE_COLOR = {
  strongLeader: '#c23b22', leanLeader: '#e07a5f', balanced: '#b8860b',
  leanManager: '#5b8fb0', strongManager: '#2c5f7c',
};
const BUCKETS = ['0–19', '20–39', '40–59', '60–79', '80–100'];

export default function AdminPage() {
  const sb = getSupabase();
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [grade, setGrade] = useState('all');

  useEffect(() => {
    if (!sb) return;
    sb.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = sb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const load = async () => {
    setLoading(true); setErr('');
    const { data, error } = await sb.from(SUPABASE_TABLE).select('*').order('created_at', { ascending: false });
    if (error) setErr('讀取失敗：' + error.message); else setRows(data || []);
    setLoading(false);
  };
  useEffect(() => { if (session) load(); }, [session]);

  const login = async (e) => {
    e.preventDefault(); setErr('');
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) setErr('登入失敗：' + error.message);
  };

  const grades = useMemo(() => [...new Set(rows.map(r => r.grade).filter(Boolean))].sort(), [rows]);
  const filtered = useMemo(() => grade === 'all' ? rows : rows.filter(r => r.grade === grade), [rows, grade]);

  const pieData = useMemo(() => {
    const c = {};
    filtered.forEach(r => { c[r.result_type] = (c[r.result_type] || 0) + 1; });
    return Object.entries(c).map(([k, v]) => ({ key: k, name: TYPE_LABEL[k] || k, value: v }));
  }, [filtered]);

  const dimData = useMemo(() => DIMS.map(([k, label]) => {
    const n = filtered.length || 1;
    const sum = filtered.reduce((a, r) => {
      const d = r.dimensions?.[k] || {};
      return { l: a.l + (d.leader || 0), m: a.m + (d.manager || 0) };
    }, { l: 0, m: 0 });
    return { name: label, 領導人: +(sum.l / n).toFixed(2), 經理人: +(sum.m / n).toFixed(2) };
  }), [filtered]);

  const bucketData = useMemo(() => {
    const c = BUCKETS.map(b => ({ name: b, 人數: 0 }));
    filtered.forEach(r => {
      const p = Number(r.leader_pct); if (isNaN(p)) return;
      c[Math.min(4, Math.floor(p / 20))].人數++;
    });
    return c;
  }, [filtered]);

  const exportCsv = () => {
    const head = ['時間', '姓名', '年級', '結果類型', '結果標題', '領導人分數', '經理人分數', '領導人%', '作答'];
    const esc = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const lines = [head, ...filtered.map(r => [
      new Date(r.created_at).toLocaleString('zh-TW'), r.name, r.grade, TYPE_LABEL[r.result_type] || r.result_type,
      r.result_title, r.leader_score, r.manager_score, r.leader_pct, (r.answers || []).join(''),
    ])].map(l => l.map(esc).join(','));
    const blob = new Blob(['\ufeff' + lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = `leader-quiz-${grade}.csv`; a.click();
  };

  if (!sb) return <div className="admin-wrap">尚未設定 Supabase。</div>;

  if (!session) return (
    <div className="admin-wrap" style={{ maxWidth: 420 }}>
      <h1 className="admin-title">講師後台登入</h1>
      <form className="admin-card" onSubmit={login}>
        <input className="admin-input" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input className="admin-input" type="password" placeholder="密碼" value={password} onChange={e => setPassword(e.target.value)} required />
        <button className="admin-btn" type="submit">登入</button>
        {err && <div className="admin-error">{err}</div>}
      </form>
    </div>
  );

  return (
    <div className="admin-wrap">
      <h1 className="admin-title">講師後台 · 領導人 vs 經理人</h1>
      <div className="admin-toolbar">
        <label>年級篩選：
          <select value={grade} onChange={e => setGrade(e.target.value)} className="admin-input" style={{ width: 'auto', marginBottom: 0 }}>
            <option value="all">全部</option>
            {grades.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </label>
        <button className="admin-btn secondary" onClick={load}>{loading ? '載入中…' : '重新整理'}</button>
        <button className="admin-btn secondary" onClick={exportCsv}>匯出 CSV</button>
        <button className="admin-btn secondary" onClick={() => sb.auth.signOut()}>登出</button>
      </div>
      {err && <div className="admin-error">{err}</div>}

      <div className="admin-grid">
        <div className="admin-card"><h3>總填答人數</h3><div className="admin-stat">{filtered.length}</div></div>
        <div className="admin-card">
          <h3>結果類型分布</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={90} label>
                {pieData.map(d => <Cell key={d.key} fill={TYPE_COLOR[d.key] || '#999'} />)}
              </Pie>
              <Tooltip /><Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="admin-grid">
        <div className="admin-card">
          <h3>五大面向平均分數</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={dimData}>
              <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend />
              <Bar dataKey="領導人" fill="#c23b22" /><Bar dataKey="經理人" fill="#2c5f7c" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="admin-card">
          <h3>領導人傾向 % 分布</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={bucketData}>
              <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip />
              <Bar dataKey="人數" fill="#b8860b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="admin-card" style={{ overflowX: 'auto' }}>
        <h3>填答明細</h3>
        <table className="admin-table">
          <thead><tr><th>姓名</th><th>年級</th><th>時間</th><th>結果</th><th>領導人%</th></tr></thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id}>
                <td>{r.name}</td><td>{r.grade}</td>
                <td>{new Date(r.created_at).toLocaleString('zh-TW')}</td>
                <td>{TYPE_LABEL[r.result_type] || r.result_type}｜{r.result_title}</td>
                <td>{r.leader_pct}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

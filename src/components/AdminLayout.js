'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children, title }) {
  const router = useRouter();
  const pathname = usePathname();
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    const stored = localStorage.getItem('admin_username');
    if (stored) setUsername(stored);
  }, [router]);

  function handleLogout() {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_username');
    router.push('/admin/login');
  }

  const navLinks = [
    { href: '/admin', label: '儀表板', exact: true },
    { href: '/admin/responses', label: '測驗紀錄' },
    { href: '/admin/questions', label: '題目管理' },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="logo">
          <h2>管理後台</h2>
          <p>Psychology Quiz</p>
        </div>
        <nav>
          {navLinks.map((link) => {
            const isActive = link.exact
              ? pathname === link.href
              : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={isActive ? 'active' : ''}
              >
                {link.label}
              </Link>
            );
          })}
          <Link href="/" style={{ marginTop: '8px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px' }}>
            ← 回到測驗
          </Link>
        </nav>
      </aside>
      <div className="admin-main">
        <div className="admin-header">
          <h1>{title || '管理後台'}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {username && (
              <span style={{ fontSize: '13px', color: 'var(--muted)' }}>
                {username}
              </span>
            )}
            <button className="admin-btn outline small" onClick={handleLogout}>
              登出
            </button>
          </div>
        </div>
        <div className="admin-content">
          {children}
        </div>
      </div>
    </div>
  );
}

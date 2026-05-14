'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [env, setEnv] = useState<Record<string, string>>({});
  const [users, setUsers] = useState<Array<{ id: number; name: string; email: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [apiResult, setApiResult] = useState('');

  useEffect(() => {
    setEnv({
      APP_ENV: process.env.NEXT_PUBLIC_APP_NAME || 'Dokploy Next.js App',
      VERSION: process.env.NEXT_PUBLIC_VERSION || '1.0.0',
      BUILD_TIME: new Date().toLocaleString('zh-CN')
    });
  }, []);

  const fetchHello = async () => {
    setLoading(true);
    setApiResult('');
    try {
      const res = await fetch('/api/hello');
      const data = await res.json();
      setApiResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setApiResult(`错误: ${error}`);
    }
    setLoading(false);
  };

  const fetchUsers = async () => {
    setLoading(true);
    setApiResult('');
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      setApiResult(`错误: ${error}`);
    }
    setLoading(false);
  };

  return (
    <main className="container">
      <header>
        <h1>🚀 Next.js 全栈应用</h1>
        <p>部署在 Dokploy 平台上的 SSR + API 示例</p>
      </header>

      <div className="card">
        <h2>📦 环境信息</h2>
        <div className="info-grid">
          {Object.entries(env).map(([key, value]) => (
            <div key={key} className="info-item">
              <div className="label">{key}</div>
              <div className="value">{value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2>🔌 API 测试</h2>
        <button onClick={fetchHello} disabled={loading}>
          {loading ? '加载中...' : '调用 /api/hello'}
        </button>
        <button onClick={fetchUsers} disabled={loading}>
          {loading ? '加载中...' : '调用 /api/users'}
        </button>
        <div id="apiResult" className={`api-result ${apiResult ? 'show' : ''}`}>
          {apiResult}
        </div>
      </div>

      {users.length > 0 && (
        <div className="card">
          <h2>👥 用户列表 (来自 API)</h2>
          <ul className="user-list">
            {users.map((user) => (
              <li key={user.id} className="user-item">
                <span>{user.name}</span>
                <span>{user.email}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <footer>
        <p>Next.js 14 App Router + TypeScript + Dokploy</p>
      </footer>
    </main>
  );
}
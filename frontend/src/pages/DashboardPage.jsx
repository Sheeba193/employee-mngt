import { useEffect, useState } from 'react';
import { apiRequest } from '../services/api';

function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await apiRequest('/dashboard');
        if (mounted) setStats(data || null);
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to load');
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {stats ? (
        <div>
          <div>Total employees: {stats.totalEmployees}</div>
          <div>Total departments: {stats.totalDepartments}</div>
        </div>
      ) : (
        <p>Overview of employees, departments, and admin actions.</p>
      )}
    </div>
  );
}

export default DashboardPage;

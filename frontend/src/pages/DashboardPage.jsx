import { useEffect, useState } from 'react';
import { apiRequest } from '../services/api';
import './DashboardPage.css';

function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const [employeesResponse, departmentsResponse] = await Promise.all([
          apiRequest('/employees'),
          apiRequest('/departments'),
        ]);

        const employees = Array.isArray(employeesResponse)
          ? employeesResponse
          : employeesResponse?.data || [];
        const departments = Array.isArray(departmentsResponse)
          ? departmentsResponse
          : departmentsResponse?.data || [];

        const totalEmployees = employees.length;
        const totalDepartments = departments.length;
        const totalPayroll = employees.reduce((sum, emp) => sum + (Number(emp.salary) || 0), 0);
        const averageSalary = totalEmployees > 0 ? totalPayroll / totalEmployees : 0;

        const data = {
          totalEmployees,
          totalDepartments,
          totalPayroll,
          averageSalary,
        };

        if (mounted) {
          setStats(data);
          setError(null);
        }
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to load');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <p className="eyebrow">Overview</p>
        <h1>Dashboard</h1>
      </div>

      {loading && <div className="loading">Loading dashboard...</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {!loading && stats && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#dbeafe' }}>
                👥
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.totalEmployees}</div>
                <div className="stat-label">Employees</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#dcfce7' }}>
                🏢
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.totalDepartments}</div>
                <div className="stat-label">Departments</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#fef3c7' }}>
                💰
              </div>
              <div className="stat-content">
                <div className="stat-value">${(stats.totalPayroll / 1_000_000).toFixed(1)}M</div>
                <div className="stat-label">Total Payroll</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#fecaca' }}>
                📊
              </div>
              <div className="stat-content">
                <div className="stat-value">${(stats.averageSalary / 1000).toFixed(0)}K</div>
                <div className="stat-label">Avg Salary</div>
              </div>
            </div>
          </div>

          <div className="dashboard-section">
            <h2>Quick Actions</h2>
            <div className="action-grid">
              <div className="action-card">
                <h3>👥 Manage Employees</h3>
                <p>Add, edit, or remove employee records</p>
                <a href="/employees" className="action-link">Go to Employees →</a>
              </div>
              <div className="action-card">
                <h3>🏢 Manage Departments</h3>
                <p>Organize and manage departments</p>
                <a href="/departments" className="action-link">Go to Departments →</a>
              </div>
              <div className="action-card">
                <h3>📈 Reports</h3>
                <p>View analytics and reports (coming soon)</p>
                <a href="#" className="action-link disabled">Coming Soon</a>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DashboardPage;

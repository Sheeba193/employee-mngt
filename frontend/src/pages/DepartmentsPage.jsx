import { useEffect, useState } from 'react';
import { apiRequest } from '../services/api';
import './DepartmentsPage.css';

function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await apiRequest('/departments');
        if (mounted) {
          setDepartments(data || []);
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
    <div className="departments-page">
      <div className="page-header">
        <h1>🏢 Departments</h1>
        <button className="btn-primary btn-small">+ Add Department</button>
      </div>

      {loading && <div className="loading">Loading departments...</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {!loading && departments.length === 0 && (
        <div className="alert alert-info">No departments found. Create one to get started.</div>
      )}

      {departments.length > 0 && (
        <div className="departments-grid">
          {departments.map((dept) => (
            <div key={dept.id} className="dept-card">
              <div className="dept-card-header">
                <h3>{dept.name}</h3>
              </div>
              <div className="dept-card-body">
                <div className="dept-stat">
                  <div className="stat-value">{dept.employeeCount || 0}</div>
                  <div className="stat-label">Employees</div>
                </div>
                {dept.manager && (
                  <p><strong>Manager:</strong> {dept.manager}</p>
                )}
                {dept.budget && (
                  <p><strong>Budget:</strong> ${dept.budget.toLocaleString()}</p>
                )}
              </div>
              <div className="dept-card-footer">
                <button className="btn-primary btn-small">Edit</button>
                <button className="btn-danger btn-small">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DepartmentsPage;

import { useEffect, useState } from 'react';
import { apiRequest } from '../services/api';
import './EmployeesPage.css';

function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await apiRequest('/employees');
        if (mounted) {
          setEmployees(data || []);
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
    <div className="employees-page">
      <div className="page-header">
        <h1>👨‍💼 Employees</h1>
        <button className="btn-primary btn-small">+ Add Employee</button>
      </div>

      {loading && <div className="loading">Loading employees...</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {!loading && employees.length === 0 && (
        <div className="alert alert-info">No employees found. Create one to get started.</div>
      )}

      {employees.length > 0 && (
        <div className="employees-grid">
          {employees.map((emp) => (
            <div key={emp.id} className="employee-card">
              <div className="card-header">
                <h3>{emp.firstName} {emp.lastName}</h3>
              </div>
              <div className="card-body">
                <p><strong>Position:</strong> {emp.position}</p>
                <p><strong>Email:</strong> {emp.email}</p>
                <p><strong>Department:</strong> {emp.department || 'N/A'}</p>
                <p><strong>Hire Date:</strong> {emp.hireDate ? new Date(emp.hireDate).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div className="card-footer">
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

export default EmployeesPage;

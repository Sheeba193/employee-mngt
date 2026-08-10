import { useEffect, useState } from 'react';
import { apiRequest } from '../services/api';

function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await apiRequest('/employees');
        if (mounted) setEmployees(data || []);
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to load');
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Employees</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <ul>
        {employees.map((e) => (
          <li key={e.id}>{e.firstName} {e.lastName} — {e.position}</li>
        ))}
      </ul>
    </div>
  );
}

export default EmployeesPage;

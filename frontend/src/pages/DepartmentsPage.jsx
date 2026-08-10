import { useEffect, useState } from 'react';
import { apiRequest } from '../services/api';

function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await apiRequest('/departments');
        if (mounted) setDepartments(data || []);
      } catch (err) {
        if (mounted) setError(err.message || 'Failed to load');
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Departments</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <ul>
        {departments.map((d) => (
          <li key={d.id}>{d.name} ({d.employeeCount || 0})</li>
        ))}
      </ul>
    </div>
  );
}

export default DepartmentsPage;

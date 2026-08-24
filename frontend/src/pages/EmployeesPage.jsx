import { useEffect, useState } from 'react';
import { apiRequest } from '../services/api';
import './EmployeesPage.css';

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  gender: '',
  salary: '',
  position: '',
  hireDate: new Date().toISOString().slice(0, 10),
  departmentId: '',
};

function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [form, setForm] = useState(initialForm);

  async function loadEmployees() {
    const data = await apiRequest('/employees');
    const list = Array.isArray(data) ? data : data?.data || [];
    setEmployees(list);
  }

  async function loadDepartments() {
    const data = await apiRequest('/departments');
    const list = Array.isArray(data) ? data : data?.data || [];
    setDepartments(list);
  }

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setError(null);
        const [employeesResponse, departmentsResponse] = await Promise.all([
          apiRequest('/employees'),
          apiRequest('/departments'),
        ]);

        if (!mounted) return;

        setEmployees(Array.isArray(employeesResponse) ? employeesResponse : employeesResponse?.data || []);
        setDepartments(Array.isArray(departmentsResponse) ? departmentsResponse : departmentsResponse?.data || []);
      } catch (err) {
        if (!mounted) return;
        setError(err.message || 'Failed to load employees');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => (mounted = false);
  }, []);

  function resetForm() {
    setForm(initialForm);
    setEditingEmployee(null);
  }

  function openCreateModal() {
    resetForm();
    setIsModalOpen(true);
  }

  function openEditModal(employee) {
    setEditingEmployee(employee);
    setForm({
      firstName: employee.firstName || '',
      lastName: employee.lastName || '',
      email: employee.email || '',
      phone: employee.phone || '',
      gender: employee.gender || '',
      salary: employee.salary ?? '',
      position: employee.position || '',
      hireDate: employee.hireDate ? new Date(employee.hireDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
      departmentId: employee.departmentId ?? employee.department?.departmentId ?? '',
    });
    setIsModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      const payload = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        gender: form.gender.trim(),
        salary: Number(form.salary),
        position: form.position.trim(),
        hireDate: new Date(form.hireDate).toISOString(),
        departmentId: Number(form.departmentId),
      };

      if (!payload.firstName || !payload.lastName || !payload.email || !payload.departmentId) {
        throw new Error('First name, last name, email, and department are required.');
      }

      if (editingEmployee) {
        await apiRequest(`/employees/${editingEmployee.employeeId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        setSuccess('Employee updated successfully.');
      } else {
        await apiRequest('/employees', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setSuccess('Employee created successfully.');
      }

      const [employeesResponse, departmentsResponse] = await Promise.all([
        apiRequest('/employees'),
        apiRequest('/departments'),
      ]);

      setEmployees(Array.isArray(employeesResponse) ? employeesResponse : employeesResponse?.data || []);
      setDepartments(Array.isArray(departmentsResponse) ? departmentsResponse : departmentsResponse?.data || []);
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      setError(err.message || 'Failed to save employee');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(employee) {
    if (!window.confirm(`Delete ${employee.firstName} ${employee.lastName}?`)) {
      return;
    }

    try {
      setError(null);
      setSuccess(null);
      await apiRequest(`/employees/${employee.employeeId}`, { method: 'DELETE' });
      await loadEmployees();
      setSuccess('Employee deleted successfully.');
    } catch (err) {
      setError(err.message || 'Failed to delete employee');
    }
  }

  return (
    <div className="employees-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">People</p>
          <h1>Employees</h1>
        </div>
        <button className="btn-primary btn-small" type="button" onClick={openCreateModal}>
          + Add Employee
        </button>
      </div>

      {loading && <div className="loading">Loading employees...</div>}
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {!loading && employees.length === 0 && (
        <div className="alert alert-info">No employees found. Create one to get started.</div>
      )}

      {employees.length > 0 && (
        <div className="employees-grid">
          {employees.map((emp) => (
            <div key={emp.employeeId} className="employee-card">
              <div className="card-header">
                <h3>
                  {emp.firstName} {emp.lastName}
                </h3>
              </div>
              <div className="card-body">
                <p><strong>Position:</strong> {emp.position || 'N/A'}</p>
                <p><strong>Email:</strong> {emp.email || 'N/A'}</p>
                <p><strong>Department:</strong> {emp.department?.departmentName || 'N/A'}</p>
                <p><strong>Salary:</strong> {emp.salary != null ? `$${Number(emp.salary).toLocaleString()}` : 'N/A'}</p>
                <p><strong>Hire Date:</strong> {emp.hireDate ? new Date(emp.hireDate).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div className="card-footer">
                <button className="btn-primary btn-small" type="button" onClick={() => openEditModal(emp)}>
                  Edit
                </button>
                <button className="btn-danger btn-small" type="button" onClick={() => handleDelete(emp)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingEmployee ? 'Edit Employee' : 'Add Employee'}</h2>
              <button type="button" className="close-button" onClick={() => setIsModalOpen(false)} aria-label="Close">
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="employee-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First name</label>
                  <input
                    id="firstName"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last name</label>
                  <input
                    id="lastName"
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="gender">Gender</label>
                  <select
                    id="gender"
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="departmentId">Department</label>
                  <select
                    id="departmentId"
                    value={form.departmentId}
                    onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
                  >
                    <option value="">Select department</option>
                    {departments.map((dept) => (
                      <option key={dept.departmentId} value={dept.departmentId}>
                        {dept.departmentName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="position">Position</label>
                  <input
                    id="position"
                    value={form.position}
                    onChange={(e) => setForm({ ...form, position: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="salary">Salary</label>
                  <input
                    id="salary"
                    type="number"
                    min="0"
                    step="1000"
                    value={form.salary}
                    onChange={(e) => setForm({ ...form, salary: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="hireDate">Hire date</label>
                <input
                  id="hireDate"
                  type="date"
                  value={form.hireDate}
                  onChange={(e) => setForm({ ...form, hireDate: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary btn-small" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary btn-small" disabled={saving}>
                  {saving ? 'Saving...' : editingEmployee ? 'Update Employee' : 'Create Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeesPage;

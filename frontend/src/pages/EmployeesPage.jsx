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
  const [fieldErrors, setFieldErrors] = useState({});

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
    setFieldErrors({});
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
    setFieldErrors({});
    setIsModalOpen(true);
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: '' }));
  }

  function validateForm() {
    const errors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.firstName.trim()) errors.firstName = 'First name is required.';
    if (!form.lastName.trim()) errors.lastName = 'Last name is required.';
    if (!form.email.trim()) errors.email = 'Email is required.';
    else if (!emailPattern.test(form.email.trim())) errors.email = 'Enter a valid email address.';
    if (form.salary === '') errors.salary = 'Salary is required.';
    else if (Number(form.salary) < 0) errors.salary = 'Salary cannot be negative.';
    if (!form.hireDate) errors.hireDate = 'Hire date is required.';
    if (!form.departmentId) errors.departmentId = 'Select a department.';

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!validateForm()) return;
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
        <div className="table-shell">
          <table className="data-table">
            <caption className="sr-only">Employee directory</caption>
            <thead>
              <tr>
                <th scope="col">Employee</th>
                <th scope="col">Position</th>
                <th scope="col">Department</th>
                <th scope="col">Email</th>
                <th scope="col">Hire date</th>
                <th scope="col" className="actions-column">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.employeeId}>
                  <td data-label="Employee">
                    <div className="person-cell">
                      <span className="person-avatar" aria-hidden="true">
                        {`${emp.firstName?.[0] || ''}${emp.lastName?.[0] || ''}`.toUpperCase()}
                      </span>
                      <div>
                        <strong>{emp.firstName} {emp.lastName}</strong>
                        <span className="muted-text">#{emp.employeeId}</span>
                      </div>
                    </div>
                  </td>
                  <td data-label="Position">{emp.position || 'N/A'}</td>
                  <td data-label="Department"><span className="table-badge">{emp.department?.departmentName || 'Unassigned'}</span></td>
                  <td data-label="Email">{emp.email || 'N/A'}</td>
                  <td data-label="Hire date">{emp.hireDate ? new Date(emp.hireDate).toLocaleDateString() : 'N/A'}</td>
                  <td data-label="Actions" className="row-actions">
                    <button className="btn-secondary btn-small" type="button" onClick={() => openEditModal(emp)}>
                      Edit
                    </button>
                    <button className="btn-danger btn-small" type="button" onClick={() => handleDelete(emp)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
                    onChange={(e) => updateField('firstName', e.target.value)}
                    required
                  />
                  {fieldErrors.firstName && <span className="field-error">{fieldErrors.firstName}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last name</label>
                  <input
                    id="lastName"
                    value={form.lastName}
                    onChange={(e) => updateField('lastName', e.target.value)}
                    required
                  />
                  {fieldErrors.lastName && <span className="field-error">{fieldErrors.lastName}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    required
                  />
                  {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="gender">Gender</label>
                  <select
                    id="gender"
                    value={form.gender}
                    onChange={(e) => updateField('gender', e.target.value)}
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
                    onChange={(e) => updateField('departmentId', e.target.value)}
                    required
                  >
                    <option value="">Select department</option>
                    {departments.map((dept) => (
                      <option key={dept.departmentId} value={dept.departmentId}>
                        {dept.departmentName}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.departmentId && <span className="field-error">{fieldErrors.departmentId}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="position">Position</label>
                  <input
                    id="position"
                    value={form.position}
                    onChange={(e) => updateField('position', e.target.value)}
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
                    onChange={(e) => updateField('salary', e.target.value)}
                    required
                  />
                  {fieldErrors.salary && <span className="field-error">{fieldErrors.salary}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="hireDate">Hire date</label>
                <input
                  id="hireDate"
                  type="date"
                  value={form.hireDate}
                  onChange={(e) => updateField('hireDate', e.target.value)}
                  required
                />
                {fieldErrors.hireDate && <span className="field-error">{fieldErrors.hireDate}</span>}
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

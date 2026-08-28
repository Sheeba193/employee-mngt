import { useEffect, useState } from 'react';
import { apiRequest } from '../services/api';
import './DepartmentsPage.css';

const initialForm = {
  departmentName: '',
  description: '',
};

function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});

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
        const data = await apiRequest('/departments');
        if (!mounted) return;
        setDepartments(Array.isArray(data) ? data : data?.data || []);
      } catch (err) {
        if (!mounted) return;
        setError(err.message || 'Failed to load departments');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => (mounted = false);
  }, []);

  function resetForm() {
    setForm(initialForm);
    setEditingDepartment(null);
    setFieldErrors({});
  }

  function openCreateModal() {
    resetForm();
    setIsModalOpen(true);
  }

  function openEditModal(department) {
    setEditingDepartment(department);
    setForm({
      departmentName: department.departmentName || '',
      description: department.description || '',
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
    if (!form.departmentName.trim()) errors.departmentName = 'Department name is required.';
    else if (form.departmentName.trim().length < 2) errors.departmentName = 'Use at least 2 characters.';

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
        departmentName: form.departmentName.trim(),
        description: form.description.trim(),
      };

      if (editingDepartment) {
        await apiRequest(`/departments/${editingDepartment.departmentId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        setSuccess('Department updated successfully.');
      } else {
        await apiRequest('/departments', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setSuccess('Department created successfully.');
      }

      const data = await apiRequest('/departments');
      setDepartments(Array.isArray(data) ? data : data?.data || []);
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      setError(err.message || 'Failed to save department');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(department) {
    if (!window.confirm(`Delete ${department.departmentName}?`)) {
      return;
    }

    try {
      setError(null);
      setSuccess(null);
      await apiRequest(`/departments/${department.departmentId}`, { method: 'DELETE' });
      await loadDepartments();
      setSuccess('Department deleted successfully.');
    } catch (err) {
      setError(err.message || 'Failed to delete department');
    }
  }

  return (
    <div className="departments-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Organization</p>
          <h1>Departments</h1>
        </div>
        <button className="btn-primary btn-small" type="button" onClick={openCreateModal}>
          + Add Department
        </button>
      </div>

      {loading && <div className="loading">Loading departments...</div>}
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {!loading && departments.length === 0 && (
        <div className="alert alert-info">No departments found yet.</div>
      )}

      {!loading && departments.length > 0 && (
        <div className="table-shell">
          <table className="data-table">
            <caption className="sr-only">Department directory</caption>
            <thead>
              <tr>
                <th scope="col">Department</th>
                <th scope="col">Description</th>
                <th scope="col">Employees</th>
                <th scope="col" className="actions-column">Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((department) => {
                const employeeCount = department.employees?.length || 0;

                return (
                  <tr key={department.departmentId}>
                    <td data-label="Department">
                      <div className="person-cell">
                        <span className="person-avatar department-avatar" aria-hidden="true">
                          {department.departmentName?.charAt(0)?.toUpperCase() || 'D'}
                        </span>
                        <div>
                          <strong>{department.departmentName}</strong>
                          <span className="muted-text">#{department.departmentId}</span>
                        </div>
                      </div>
                    </td>
                    <td data-label="Description">{department.description || 'No description provided.'}</td>
                    <td data-label="Employees"><span className="table-badge">{employeeCount}</span></td>
                    <td data-label="Actions" className="row-actions">
                      <button type="button" className="btn-secondary btn-small" onClick={() => openEditModal(department)}>
                        Edit
                      </button>
                      <button type="button" className="btn-danger btn-small" onClick={() => handleDelete(department)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingDepartment ? 'Edit Department' : 'Add Department'}</h2>
              <button type="button" className="close-button" onClick={() => setIsModalOpen(false)} aria-label="Close">
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="department-form">
              <div className="form-group">
                <label htmlFor="departmentName">Department name</label>
                <input
                  id="departmentName"
                  value={form.departmentName}
                  onChange={(e) => updateField('departmentName', e.target.value)}
                  required
                />
                {fieldErrors.departmentName && <span className="field-error">{fieldErrors.departmentName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  rows="4"
                  value={form.description}
                  onChange={(e) => updateField('description', e.target.value)}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary btn-small" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary btn-small" disabled={saving}>
                  {saving ? 'Saving...' : editingDepartment ? 'Update Department' : 'Create Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DepartmentsPage;

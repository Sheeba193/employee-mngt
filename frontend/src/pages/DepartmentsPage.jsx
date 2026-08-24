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
    setIsModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      const payload = {
        departmentName: form.departmentName.trim(),
        description: form.description.trim(),
      };

      if (!payload.departmentName) {
        throw new Error('Department name is required.');
      }

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
        <div className="departments-grid">
          {departments.map((department) => {
            const employeeCount = department.employees?.length || 0;

            return (
              <article key={department.departmentId} className="dept-card">
                <div className="dept-card-header">
                  <span className="dept-mark" aria-hidden="true">
                    {department.departmentName?.charAt(0)?.toUpperCase() || 'D'}
                  </span>
                  <div>
                    <h2>{department.departmentName}</h2>
                    <span className="dept-id">Department #{department.departmentId}</span>
                  </div>
                </div>
                <div className="dept-card-body">
                  <p className="dept-description">{department.description || 'No description provided.'}</p>
                  <div className="dept-stat">
                    <span className="stat-value">{employeeCount}</span>
                    <span className="stat-label">{employeeCount === 1 ? 'employee' : 'employees'}</span>
                  </div>
                </div>
                <div className="dept-card-footer">
                  <button type="button" className="btn-primary btn-small" onClick={() => openEditModal(department)}>
                    Edit
                  </button>
                  <button type="button" className="btn-danger btn-small" onClick={() => handleDelete(department)}>
                    Delete
                  </button>
                </div>
              </article>
            );
          })}
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
                  onChange={(e) => setForm({ ...form, departmentName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  rows="4"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
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

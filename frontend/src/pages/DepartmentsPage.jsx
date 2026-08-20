import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../services/api';
import './DepartmentsPage.css';

function DepartmentsPage() {
	const [departments, setDepartments] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let mounted = true;

		async function loadDepartments() {
			try {
				const data = await apiRequest('/departments');
				if (mounted) {
					setDepartments(data || []);
					setError(null);
				}
			} catch (err) {
				if (mounted) setError(err.message || 'Failed to load departments');
			} finally {
				if (mounted) setLoading(false);
			}
		}

		loadDepartments();
		return () => (mounted = false);
	}, []);

	return (
		<div className="departments-page">
			<div className="page-header">
				<div>
					<p className="eyebrow">Organization</p>
					<h1>Departments</h1>
				</div>
				<button className="btn-primary btn-small" type="button" disabled>
					+ Add Department
				</button>
			</div>

			{loading && <div className="loading">Loading departments...</div>}
			{error && <div className="alert alert-error">{error}</div>}

			{!loading && !error && departments.length === 0 && (
				<div className="alert alert-info">No departments found yet.</div>
			)}

			{!loading && !error && departments.length > 0 && (
				<div className="departments-grid">
					{departments.map((department) => {
						const employeeCount = department.employees?.length || 0;

						return (
							<article key={department.departmentId} className="dept-card">
								<div className="dept-card-header">
									<span className="dept-mark" aria-hidden="true">{department.departmentName.charAt(0).toUpperCase()}</span>
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
									<Link to="/employees" className="action-link">View employees <span aria-hidden="true">→</span></Link>
								</div>
							</article>
						);
					})}
				</div>
			)}
		</div>
	);
}

export default DepartmentsPage;

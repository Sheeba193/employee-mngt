import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import EmployeesPage from './pages/EmployeesPage';
import DepartmentsPage from './pages/DepartmentsPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <Layout>
            <DashboardPage />
          </Layout>
        }
      />
      <Route
        path="/employees"
        element={
          <Layout>
            <EmployeesPage />
          </Layout>
        }
      />
      <Route
        path="/departments"
        element={
          <Layout>
            <DepartmentsPage />
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;

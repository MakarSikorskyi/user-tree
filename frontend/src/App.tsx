import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout, message } from 'antd';
import LoginPage from './pages/LoginPage';
import EmployeeTreePage from './pages/EmployeeTreePage';
import { authService } from './services/authService';

const { Content } = Layout;

interface User {
  id: number;
  username: string;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await authService.verifyToken();
        if (response.success && response.data) {
          setIsAuthenticated(true);
          setUser(response.data.user);
        } else {
          localStorage.removeItem('token');
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await authService.login(username, password);
      if (response.success && response.data) {
        localStorage.setItem('token', response.data.token);
        setIsAuthenticated(true);
        setUser(response.data.user);
        message.success('Login successful!');
        return true;
      } else {
        message.error(response.message || 'Login failed');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error('Login failed. Please try again.');
      return false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    message.success('Logged out successfully');
  };

  if (loading) {
    return (
      <Layout className="app-layout">
        <Content style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div>Loading...</div>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout className="app-layout">
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <EmployeeTreePage user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </Layout>
  );
}

export default App;

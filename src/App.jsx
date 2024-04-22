import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';
import HomePage from './pages/HomePage';
import CadastroColaborador from './pages/CadastroColaborador';
import CadastroCliente from './pages/CadastroCliente';
import ModalLogin from './components/layout/ModalLogin';
import ProfilePage from './pages/ProfilePage';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={
            <PrivateRoute allowedTypes={['Gestor']}>
              <Dashboard />
            </PrivateRoute>} />
          <Route path="/cadastro-colaborador" element={
            <PrivateRoute allowedTypes={['Gestor']}>
              <CadastroColaborador />
            </PrivateRoute>} />
          <Route path="/cadastro-cliente" element={<CadastroCliente />} />
          <Route path="/login-modal" element={<ModalLogin />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

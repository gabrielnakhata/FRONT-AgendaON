import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './pages/HomePage';
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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cadastro-cliente" element={<CadastroCliente />} />
          <Route path="/login-modal" element={<ModalLogin />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Router>
    </AuthProvider> 
  );
}

export default App;

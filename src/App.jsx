import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CadastroCliente from './pages/CadastroCliente';
import ModalLogin from './components/layout/ModalLogin';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cadastro-cliente" element={<CadastroCliente />} />
          <Route path="/login-modal" element={<ModalLogin />} />
        </Routes>
      </Router>
  );
}

export default App;

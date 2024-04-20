import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../src/pages/HomePage';
import CadastroCliente from '../src/pages/CadastroCliente';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cadastro-cliente" element={<CadastroCliente />} />
        {/* Defina outras rotas aqui se necessário */}
      </Routes>
    </Router>
  );
}
export default App;


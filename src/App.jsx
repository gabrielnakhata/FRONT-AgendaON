import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';
import HomePage from './pages/HomePage';
import CustomizarDisponibilidadeCalendario from './pages/CustomizarDisponibilidadeCalendario';
import ProgramarDisponibilidadeCalendario from './pages/ProgramarDisponibilidadeCalendario';
import FiltrarDisponibilidadeColaborador from './pages/FiltrarDisponibilidadeColaborador';
import FiltrarDisponibilidade from './pages/FiltrarDisponibilidade';
import CadastroColaborador from './pages/CadastroColaborador';
import AtualizarColaborador from './pages/AtualizarColaborador';
import AtualizarDadosCliente from './pages/AtualizarDadosCliente';
import ListaColaboradores from './pages/ListaColaboradores';
import CadastroServico from './pages/CadastroServico';
import AtualizarServico from './pages/AtualizarServico';
import ListaServicos from './pages/ListaServicos';
import CadastroComissoes from './pages/CadastroComissoes';
import ListaComissoes from './pages/ListaComissoes';
import AtualizarComissoes from './pages/AtualizarComissoes';
import CadastroCliente from './pages/CadastroCliente';
import ListaCliente from './pages/ListaCliente';
import ModalLogin from './components/common/ModalLogin';
import ProfilePage from './pages/ProfilePage';
import LocalizacaoMaps from './pages/LocalizacaoMaps';
import Dashboard from './pages/Dashboard';
import DashboardColaborador from './pages/DashboardColaborador';
import DashboardCliente from './pages/DashboardCliente';
import NovoAgendamento from './pages/NovoAgendamento';
import ListaAgendamentos from './pages/ListaAgendamentos';
import ListaAgendamentosColaborador from './pages/ListaAgendamentosColaborador';
import ListaAgendamentosGestor from './pages/ListaAgendamentosGestor';
import EsqueciMinhaSenha from './pages/EsqueciMinhaSenha';

function App() {

  return (
    <AuthProvider>
      <Router basename={import.meta.env.VITE_BASE_URL}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/agendamento" element={
            <PrivateRoute allowedTypes={['Cliente']}>
              <NovoAgendamento />
            </PrivateRoute>} />
          <Route path="/lista-agendamento" element={
            <PrivateRoute allowedTypes={['Cliente']}>
              <ListaAgendamentos />
            </PrivateRoute>} />
          <Route path="/lista-agendamento-colaborador" element={
            <PrivateRoute allowedTypes={['Colaborador']}>
              <ListaAgendamentosColaborador />
            </PrivateRoute>} />
          <Route path="/lista-agendamento-gestor" element={
            <PrivateRoute allowedTypes={['Gestor']}>
              <ListaAgendamentosGestor />
            </PrivateRoute>} />         
          <Route path="/dashboard" element={
            <PrivateRoute allowedTypes={['Gestor']}>
              <Dashboard />
            </PrivateRoute>} />
          <Route path="/dashboard-colaborador" element={
            <PrivateRoute allowedTypes={['Colaborador']}>
              <DashboardColaborador />
            </PrivateRoute>} />
          <Route path="/dashboard-cliente" element={
            <PrivateRoute allowedTypes={['Cliente']}>
              <DashboardCliente />
            </PrivateRoute>} />      
          <Route path="/customizar-disponibilidade-calendario" element={
            <PrivateRoute allowedTypes={['Gestor', 'Colaborador']}>
              <CustomizarDisponibilidadeCalendario />
            </PrivateRoute>} />
          <Route path="/programar-disponibilidade-calendario" element={
            <PrivateRoute allowedTypes={['Gestor', 'Colaborador']}>
              <ProgramarDisponibilidadeCalendario />
            </PrivateRoute>} />
          <Route path="/disponibilidade-filtro-calendario" element={
            <PrivateRoute allowedTypes={['Gestor', 'Cliente']}>
              <FiltrarDisponibilidadeColaborador />
            </PrivateRoute>} />
          <Route path="/disponibilidade-filtro-calendario-colaborador" element={
            <PrivateRoute allowedTypes={['Colaborador']}>
              <FiltrarDisponibilidade />
            </PrivateRoute>} />
          <Route path="/cadastro-colaborador" element={
            <PrivateRoute allowedTypes={['Gestor']}>
              <CadastroColaborador />
            </PrivateRoute>} />
          <Route path="/atualizar-colaborador/:id" element={
            <PrivateRoute allowedTypes={['Gestor', 'Colaborador']}>
              <AtualizarColaborador />
            </PrivateRoute>} />
          <Route path="/atualizar-cliente/:id" element={
            <PrivateRoute allowedTypes={['Cliente']}>
              <AtualizarDadosCliente />
            </PrivateRoute>} />
          <Route path="/lista-colaborador" element={
            <PrivateRoute allowedTypes={['Gestor', 'Colaborador']}>
              <ListaColaboradores />
            </PrivateRoute>} />
          <Route path="/cadastro-servico" element={
            <PrivateRoute allowedTypes={['Gestor']}>
              <CadastroServico />
            </PrivateRoute>} />
          <Route path="/lista-servico" element={
            <PrivateRoute allowedTypes={['Gestor', 'Colaborador', 'Cliente']}>
              <ListaServicos />
            </PrivateRoute>} />
          <Route path="/atualizar-servico/:id" element={
            <PrivateRoute allowedTypes={['Gestor']}>
              <AtualizarServico />
            </PrivateRoute>} />
          <Route path="/cadastro-comissao" element={
            <PrivateRoute allowedTypes={['Gestor']}>
              <CadastroComissoes />
            </PrivateRoute>} />
          <Route path="/lista-comissao" element={
            <PrivateRoute allowedTypes={['Gestor', 'Colaborador']}>
              <ListaComissoes />
            </PrivateRoute>} />
          <Route path="/atualizar-comissao/:id" element={
            <PrivateRoute allowedTypes={['Gestor']}>
              <AtualizarComissoes />
            </PrivateRoute>} />
          <Route path="/lista-cliente" element={
            <PrivateRoute allowedTypes={['Gestor']}>
              <ListaCliente />
            </PrivateRoute>} />
          <Route path="/profile" element={
            <PrivateRoute allowedTypes={['Cliente']}>
              <ProfilePage />
            </PrivateRoute>} />
          <Route path="/localizacao" element={
            <PrivateRoute allowedTypes={['Cliente', 'Gestor', 'Colaborador']}>
              <LocalizacaoMaps />
            </PrivateRoute>} />
          <Route path="/cadastro-cliente" element={<CadastroCliente />} />
          <Route path="/esqueci-minha-senha" element={<EsqueciMinhaSenha/>} />
          <Route path="/login-modal" element={<ModalLogin />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
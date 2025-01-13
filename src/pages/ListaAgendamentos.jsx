import { useEffect, useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { ChakraProvider, Flex, Box, useToast, VStack, Checkbox } from '@chakra-ui/react';
import usePrimeReactLocale from '../hooks/usePrimeReactLocale';
import { ScrollTop } from 'primereact/scrolltop';
import DataGridScheduling from '../components/common/DataGridScheduling';
import TitleSection from '../components/common/TitleSection';
import { getAgendaInDayClient, getAgendaAllDayClient } from '../services/schedulingService';
import { useAuth } from '../contexts/AuthContext';
import AgendamentoModal from '../components/common/AgendamentoModal';
import MenuCliente from '../components/common/MenuCliente';
import Footer from '../components/common/Footer';

const ListaAgendamentos = () => {
  usePrimeReactLocale();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [data, setData] = useState([]);
  const [allAgendamentos, setAllAgendamentos] = useState(true);
  const [allowPastDates, setAllowPastDates] = useState(false);
  const toast = useToast();
  const [containerHeight] = useState('400px');
  const { user, token } = useAuth();
  const [selectedAgendamento, setSelectedAgendamento] = useState(null);

  const reloadData = async () => {
    setData([]);
    if (user.id) {
      try {
        if (allAgendamentos) {
          const agendaData = await getAgendaAllDayClient(user.id, token);
          setData(agendaData);
        } else if (selectedDate) {
          const formattedDate = `${selectedDate.getFullYear()}-${selectedDate.getDate().toString().padStart(2, '0')}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}`;
          const agendaData = await getAgendaInDayClient(user.id, formattedDate, token);
          setData(agendaData);
        }
      } catch (error) {
        toast({
          title: "Erro ao carregar agendamentos",
          description: error.message || "Não foi possível carregar os agendamentos.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  useEffect(() => {
    reloadData();
  }, [user.id, selectedDate, allAgendamentos, token]);

  const handleRowClick = (item) => {
    setSelectedAgendamento(item);
  };

  const handleModalClose = () => {
    setSelectedAgendamento(null);
    reloadData();
  };

  return (
    <Flex direction="column" minH="100vh" bg="#fff" w="100vw" m="0" p="0" overflow="hidden">
      <MenuCliente />
      <Flex direction="column" align="center" justify="center" bgGradient="linear(180deg, #3C3885, #3CCB95)" w="100vw" m="0" p="0" flex="1" overflow="hidden">
        <TitleSection title="Meus Agendamentos" subtitle="Para ver os detalhes clique no agendamento" />
        <Box bg="#fff" p={5} shadow="md" borderWidth="1px" borderRadius="md" w={['100%', '100%', '50%']} maxWidth="960px" mx="auto" my="2rem">
          <VStack spacing={7}>
            <Checkbox
              isChecked={allAgendamentos}
              onChange={(e) => setAllAgendamentos(e.target.checked)}
              colorScheme="blue"
              alignSelf="center"
            >
              Todos os agendamentos
            </Checkbox>

            {!allAgendamentos && (
              <>
                <div className="card flex flex-wrap gap-3 p-fluid">
                  <div className="flex-auto">
                    <Calendar
                      id="buttondisplay"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.value)}
                      showIcon
                      style={{ fontSize: '20px' }}
                      dateFormat="dd/mm/yy"
                      icon={() => <i className="pi pi-calendar" style={{ fontSize: '20px' }} />}
                      minDate={allowPastDates ? null : new Date()}
                    />
                  </div>
                </div>
                <Checkbox
                  isChecked={allowPastDates}
                  onChange={(e) => setAllowPastDates(e.target.checked)}
                  colorScheme="green"
                  alignSelf="center"
                >
                  Filtrar datas passadas
                </Checkbox>
              </>
            )}
            <ChakraProvider>
              <Box w="100%" height={containerHeight} overflowY="auto" position="relative">
                <DataGridScheduling data={data} onRowClick={handleRowClick} onUpdate={null} onDelete={null} />
                <ScrollTop target="parent" threshold={100} className="w-2rem h-2rem border-round bg-primary" icon="pi pi-arrow-up text-base" />
              </Box>
            </ChakraProvider>
          </VStack>
        </Box>
        {selectedAgendamento && (
          <AgendamentoModal
            isOpen={Boolean(selectedAgendamento)}
            onClose={handleModalClose}
            data={selectedAgendamento}
            onCancel={handleModalClose}
          />
        )}
      </Flex>
      <Footer />
    </Flex>
  );
};

export default ListaAgendamentos;

// import { useState, useEffect } from "react";
// import { Calendar } from 'primereact/calendar';
// import usePrimeReactLocale from '../hooks/usePrimeReactLocale';
// import { ScrollTop } from 'primereact/scrolltop';
// import { ChakraProvider, Flex, Box, VStack, useToast, Select } from '@chakra-ui/react';
// import TitleSection from '../components/layout/TitleSection';
// import DataGridScheduling from '../components/common/DataGridScheduling';
// import { useAuth } from '../contexts/AuthContext';
// import { getCollaborators } from '../services/collaboratorService';
// import AgendamentoModal from '../components/layout/AgendamentoModal';
// import MenuColaborador from '../components/common/MenuColaborador';
// import Footer from '../components/common/Footer';
// import { getAgendaInDay } from "../services/schedulingService";

// const ListaAgendamentosColaborador = () => {
//   usePrimeReactLocale();
//   const [collaborators, setCollaborators] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [selectedCollaboratorId, setSelectedCollaboratorId] = useState('');
//   const [data, setData] = useState([]);
//   const toast = useToast();
//   const [containerHeight] = useState('400px');
//   const { token } = useAuth();
//   const [selectedAgendamento, setSelectedAgendamento] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const collabData = await getCollaborators(token);
//         setCollaborators(collabData);
//       } catch (error) {
//         toast({
//           title: "Erro ao carregar dados",
//           description: "Não foi possível carregar dados necessários.",
//           status: "error",
//           duration: 3000,
//           isClosable: true,
//         });
//       }
//     };
//     fetchData();
//   }, [token, toast]);

//   useEffect(() => {
//     const fetchAgenda = async () => {
//       if (selectedCollaboratorId && selectedDate) {
//         const formattedDate = `${selectedDate.getFullYear()}-${selectedDate.getDate().toString().padStart(2, '0')}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}`;
//         try {
//           const agendaData = await getAgendaInDay(selectedCollaboratorId, formattedDate, token);
//           setData(agendaData);
//         } catch (error) {
//           toast({
//             title: "Consulta",
//             description: error.message || "Não há horários disponíveis para esta data.",
//             status: "info",
//             duration: 3000,
//             isClosable: true,
//           });
//         }
//       }
//     };

//     fetchAgenda();
//   }, [selectedCollaboratorId, selectedDate, token, toast]);

//   const handleRowClick = (item) => {
//     setSelectedAgendamento(item);
//   };

//   const handleModalClose = () => {
//     setSelectedAgendamento(null);
//     // fetchAgenda(); // Re-fetch data after closing the modal if needed
//   };

//   return (
//     <Flex direction="column" minH="100vh" bg="#fff" w="100vw" m="0" p="0" overflow="hidden">
//       <MenuColaborador />
//       <Flex direction="column" align="center" justify="center" bgGradient="linear(180deg, #3C3885, #3CCB95)" w="100vw" m="0" p="0" flex="1" overflow="hidden">
//         <TitleSection title="Minha Agenda" subtitle="Para ver os detalhes clique no agendamento" />
//         <Box bg="#fff" p={5} shadow="md" borderWidth="1px" borderRadius="md" w={['100%', '100%', '50%']} maxWidth="960px" mx="auto" my="2rem">
//           <VStack spacing={7}>
//             <div className="card flex flex-wrap gap-3 p-fluid">
//               <Select placeholder="Selecione o Colaborador" name="colaboradorId" fontSize="18px" color="#3D5A73" fontWeight="bold" onChange={(e) => setSelectedCollaboratorId(parseInt(e.target.value, 10))}>
//                 {collaborators.map(col => (
//                   <option key={col.colaboradorId} value={col.colaboradorId}>{col.nome}</option>
//                 ))}
//               </Select>
//               <div className="flex-auto">
//                 <Calendar
//                   id="buttondisplay"
//                   value={selectedDate}
//                   onChange={(e) => setSelectedDate(e.value)}
//                   showIcon style={{ fontSize: '20px' }}
//                   dateFormat="dd/mm/yy"
//                   icon={() => <i className="pi pi-calendar" style={{ fontSize: '20px' }} />}
//                   minDate={new Date()} />
//               </div>
//             </div>
//             <ChakraProvider>
//             <Box w={{ base: '100%', md: '80%' }} height={containerHeight} overflowY="auto" position="relative">
//                 <DataGridScheduling data={data} onRowClick={handleRowClick} onUpdate={null} onDelete={null} />
//                 <ScrollTop target="parent" threshold={100} className="w-2rem h-2rem border-round bg-primary" icon="pi pi-arrow-up text-base" />
//               </Box>
//             </ChakraProvider>
//           </VStack>
//         </Box>
//         {selectedAgendamento && (
//           <AgendamentoModal
//             isOpen={Boolean(selectedAgendamento)}
//             onClose={handleModalClose}
//             data={selectedAgendamento}
//             onCancel={handleModalClose}
//           />
//         )}
//       </Flex>
//       <Footer />
//     </Flex>
//   );
// };

// export default ListaAgendamentosColaborador;
import { useState, useEffect } from "react";
import { Calendar } from 'primereact/calendar';
import usePrimeReactLocale from '../hooks/usePrimeReactLocale';
import { ScrollTop } from 'primereact/scrolltop';
import { ChakraProvider, Flex, Box, VStack, useToast } from '@chakra-ui/react';
import TitleSection from '../components/layout/TitleSection';
import DataGridScheduling from '../components/common/DataGridScheduling';
import { useAuth } from '../contexts/AuthContext';
import AgendamentoModal from '../components/layout/AgendamentoModal';
import MenuColaborador from '../components/common/MenuColaborador';
import Footer from '../components/common/Footer';
import { getAgendaInDay } from "../services/schedulingService";

const ListaAgendamentosColaborador = () => {
  usePrimeReactLocale();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [data, setData] = useState([]);
  const toast = useToast();
  const [containerHeight] = useState('400px');
  const { token, user } = useAuth(); // Include user from the context
  const [selectedAgendamento, setSelectedAgendamento] = useState(null);

  
   
    const reloadData = async () => {
      setData([]);
      if (user.id && selectedDate) {
        const formattedDate = `${selectedDate.getFullYear()}-${selectedDate.getDate().toString().padStart(2, '0')}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}`;
        try {
          const agendaData = await getAgendaInDay(user.id, formattedDate, token);
          setData(agendaData);
        } catch (error) {
          toast({
            title: "Consulta",
            description: error.message || "Não há horários disponíveis para esta data.",
            status: "info",
            duration: 3000,
            isClosable: true,
          });
        }
      }
    };
    useEffect(() => {
    reloadData();
  }, [user.id, selectedDate, token, toast]);

  const handleRowClick = (item) => {
    setSelectedAgendamento(item);
  };

  const handleModalClose = () => {
    setSelectedAgendamento(null);
    reloadData();
  };

  return (
    <Flex direction="column" minH="100vh" bg="#fff" w="100vw" m="0" p="0" overflow="hidden">
      <MenuColaborador />
      <Flex direction="column" align="center" justify="center" bgGradient="linear(180deg, #3C3885, #3CCB95)" w="100vw" m="0" p="0" flex="1" overflow="hidden">
        <TitleSection title="Minha Agenda" subtitle="Filtre a agenda e veja os detalhes clicando no agendamento desejado" />
        <Box bg="#fff" p={5} shadow="md" borderWidth="1px" borderRadius="md" w={['100%', '100%', '50%']} maxWidth="960px" mx="auto" my="2rem">
          <VStack spacing={7}>
            <div className="card flex flex-wrap gap-3 p-fluid">
              <div className="flex-auto">
                <Calendar
                  id="buttondisplay"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.value)}
                  showIcon style={{ fontSize: '20px' }}
                  dateFormat="dd/mm/yy"
                  icon={() => <i className="pi pi-calendar" style={{ fontSize: '20px' }} />}
                  minDate={new Date()} />
              </div>
            </div>
            <ChakraProvider>
              <Box w={{ base: '100%', md: '80%' }} height={containerHeight} overflowY="auto" position="relative">
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

export default ListaAgendamentosColaborador;
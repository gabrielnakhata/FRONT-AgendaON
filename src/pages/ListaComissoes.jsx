import { useEffect, useState } from 'react';
import { VStack, ChakraProvider, Flex, Box, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import DataGridCommission from '../components/common/DataGridCommission';
import TitleSection from '../components/common/TitleSection';
import { getCommission, deleteCommission } from '../services/commissionService';
import { useAuth } from '../contexts/AuthContext';
import ActionButtons from '../components/common/ActionButtons';
import { useUserRedirect } from "../hooks/UseUserRedirect";
import { ScrollTop } from 'primereact/scrolltop';

const ListaComissoes = () => {
  const { token } = useAuth();
  const [data, setData] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();
  const { redirectToDashboard } = useUserRedirect();
  const [containerHeight] = useState('500px');
  const { user } = useAuth();

  const handleUpdate = (commission) => {
    navigate(`/atualizar-comissao/${commission.comissaoId}`, { state: { commission } });
  };

  const handleClose = () => {
    redirectToDashboard();
  };

  useEffect(() => {
    getCommission(user?.email, token)
      .then(setData)
      .catch(error => {
        console.error("Erro ao carregar dados:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados das comissões. Por favor, tente novamente.",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      });
  }, [token, toast]);

  const handleDelete = async (id) => {
    try {
      await deleteCommission(id, token);
      toast({
        title: "Comissão deletada",
        description: `A Comissão com ID ${id} foi removida.`,
        status: "success",
        duration: 2500,
        isClosable: true,
      });
      setData(prevData => prevData.filter(item => item.comissaoId !== id));
    } catch (error) {
      toast({
        title: "Erro ao deletar",
        description: "Não foi possível remover a comissão.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (

    <Flex direction="column" minH="100vh" align="center" justify="center" bgGradient="linear(180deg, #455559, #182625)" w="100vw" m="0" p="0" overflowX="hidden">
      <TitleSection title="Comissões" subtitle={null} />
      <Box bg="#fff" p={5} shadow="md" borderWidth="1px" borderRadius="md" w={['100%', '100%', '50%']} maxWidth="960px" marginX="auto" marginTop="2rem" marginBottom="2rem" mt="1rem">
      <VStack spacing={4}>
        <ChakraProvider>
          <Box w={{ base: '100%', md: '80%' }} height={containerHeight} overflow="auto" position="relative">
            <DataGridCommission data={data} onUpdate={handleUpdate} onDelete={handleDelete} />
            <ScrollTop target="parent" threshold={100} className="w-2rem h-2rem border-round bg-primary" icon="pi pi-arrow-up text-base" />
          </Box>
        </ChakraProvider>
        <ActionButtons onBack={handleClose} onSave={null} isSaveDisabled={null} />
        </VStack>
      </Box>
    </Flex>
  );
};

export default ListaComissoes;
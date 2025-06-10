import { useEffect, useState } from 'react';
import { VStack, Card, HStack, Text, ChakraProvider, Flex, Box, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Button } from '@chakra-ui/react';
import { ScrollTop } from 'primereact/scrolltop';
import { useNavigate } from 'react-router-dom';
import DataGridPerfil from '../components/common/DataGridPerfil';
import TitleSection from '../components/common/TitleSection';
import { getClientId } from '../services/clientService';
import { useAuth } from '../contexts/AuthContext';
import { useUserRedirect } from "../hooks/UseUserRedirect";
import ActionButtons from '../components/common/ActionButtons';

const ProfilePage = () => {
    const { token, user } = useAuth();
    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();
    const { redirectToDashboard } = useUserRedirect();
    const [containerHeight] = useState('400px');

    const handleUpdate = (client) => {
        navigate(`/atualizar-cliente/${client.clienteId}`, { state: { client } });
    };

    const handleClose = () => {
        redirectToDashboard();
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        setIsModalOpen(true);

        getClientId(token, user.id)
            .then(setData)
            .catch(error => {
                console.error("Erro ao carregar dados:", error);
                toast({
                    title: "Erro ao carregar dados",
                    description: "Não foi possível carregar os dados do perfil do cliente. Por favor, tente novamente.",
                    status: "error",
                    duration: 4000,
                    isClosable: true,
                });
            });
    }, [token, user.id, toast]);

    return (
        <Flex direction="column" minH="100vh" align="center" justify="center" bgGradient="linear(180deg, #455559, #182625)" w="100vw" m="0" p="0" overflowX="hidden">
            <TitleSection title="Meu Perfil" subtitle="Olá, veja seus dados, é possível alterar a senha" />
            <Box bg="#fff" p={5} shadow="md" borderWidth="1px" borderRadius="md" w={['100%', '100%', '50%']} maxWidth="960px" marginX="auto" marginTop="2rem" marginBottom="2rem" mt="1rem">
                <VStack spacing={4}>
                    <ChakraProvider>
                        <Box w={{ base: '100%', md: '100%' }} height={containerHeight} overflow="auto" position="relative">
                            <DataGridPerfil data={data} onUpdate={handleUpdate} />
                            <ScrollTop target="parent" threshold={100} className="w-2rem h-2rem border-round bg-primary" icon="pi pi-arrow-up text-base" />
                        </Box>
                    </ChakraProvider>
                    <ActionButtons onBack={handleClose} onSave={null} isSaveDisabled={null} />
                </VStack>
            </Box>

            <Modal isOpen={isModalOpen} onClose={closeModal} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Atenção!</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4}>
                            <Card bg='#FEFF92' p={5}>
                                <HStack align="center" paddingBottom={2}>
                                    <i className="pi pi-exclamation-triangle" style={{ fontSize: '27px', verticalAlign: 'middle', color: '#172237' }} />
                                    <Text paddingLeft={4} fontSize="14px" color="#172237">
                                    Nosso sistema está em conformidade com a Lei Geral de Proteção de Dados (LGPD), assegurando a proteção e privacidade dos seus dados pessoais. Todas as informações coletadas são tratadas com segurança e utilizadas somente para os fins autorizados. Você tem o direito de acessar, corrigir ou solicitar a exclusão dos seus dados a qualquer momento. Estamos comprometidos em proteger sua privacidade e manter a sua confiança.
                                    </Text>
                                </HStack>
                            </Card>
                            <Card bg='#59FFA7' p={5}>
                                <HStack align="center" paddingBottom={2}>
                                    <i className="pi pi-info-circle" style={{ fontSize: '27px', verticalAlign: 'middle', color: '#38a169' }} />
                                    <Text paddingLeft={4} fontSize="14px" fontWeight="bold" color="#38a169">
                                    Você pode atualizar suas informações e alterar a senha acessando pelo botão Editar (lápis).
                                    </Text>
                                </HStack>
                            </Card>
                        </VStack>
                        <br></br>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Flex>
    );
};

export default ProfilePage;
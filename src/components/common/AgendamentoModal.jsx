import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Text,
    Badge,
    VStack,
    HStack,
    Avatar,
    Card,
    Box,
    ChakraProvider,
    useToast
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { ScrollTop } from 'primereact/scrolltop';
import DataGridService from './DataGridService';
import { getServicesFromAgendamento } from '../../services/serviceService';
import { statusSchedulingForClient } from '../../services/schedulingService';

const AgendamentoModal = ({ isOpen, onClose, data }) => {
    const { user, token } = useAuth();
    const [containerHeight] = useState('200px');
    const [dataService, setData] = useState([]);
    const toast = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const agendamentoId = data?.agendamentoId;
    const statusCancelado = 2;
    const statusReativado = 1;
    const statusConcluido = 4;

    useEffect(() => {
        if (!token || !agendamentoId) return;

        getServicesFromAgendamento(token, agendamentoId)
            .then(setData)
            .catch(error => {
                console.error("Erro ao carregar dados:", error);
                toast({
                    title: "Erro ao carregar dados",
                    description: "Não foi possível carregar os dados dos serviços. Por favor, tente novamente.",
                    status: "error",
                    duration: 4000,
                    isClosable: true,
                });
            });
    }, [token, agendamentoId, user.id, toast]);

    const handleStatusChange = async (status) => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            await statusSchedulingForClient(agendamentoId, status, token);
            toast({
                title: status === statusCancelado ? "Cancelado!" : status === statusReativado ? "Reagendado!" : "Concluído!",
                description: status === statusCancelado ? "O Agendamento foi cancelado!" : status === statusReativado ? "O Agendamento foi reagendado!" : "O Agendamento foi concluído!",
                status: "success",
                duration: 2000,
                isClosable: true,
                onCloseComplete: () => {
                    setIsSubmitting(false);
                    onClose();
                }
            });

        } catch (error) {
            toast({
                title: "Erro ao alterar status",
                description: error.message || "Não foi possível alterar o status do agendamento.",
                status: "error",
                duration: 4000,
                isClosable: true,
            });
            setIsSubmitting(false);
        }
    };

    if (!data) return null;

    const formatDate = (dateTimeStr) => {
        const date = new Date(dateTimeStr);
        return [
            date.getDate().toString().padStart(2, '0'),
            (date.getMonth() + 1).toString().padStart(2, '0'),
            date.getFullYear().toString()
        ].join('/');
    };

    const formatTime = (dateTimeStr) => {
        const time = new Date(dateTimeStr);
        return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl" motionPreset="scale">
            <ModalOverlay />
            <ModalContent w={{ base: '90%', md: '70%', lg: '50%' }}>
                <ModalHeader fontWeight="bold" color="#172237" mb={2}>
                    <HStack>
                        <Avatar name={user?.nome || 'No Name'} src={user?.image || 'https://fallback-url.com/default-avatar.png'} mr={2} />
                        <VStack align="flex-start" spacing={0}>
                            <Text fontSize="md" color="#172237" fontWeight="bold">{"Olá,"}&nbsp;&nbsp;{user?.nome || 'No Name'}</Text>
                            <Text fontSize="sm" color="#172237">{user?.email || 'noemail@example.com'}</Text>
                        </VStack>
                    </HStack>
                    <HStack paddingTop={5} paddingBottom={1} align="center">
                        <Text fontSize="16px" color="#504E42" fontWeight="bold" alignItems="left">
                            Status:&nbsp;&nbsp;&nbsp;
                        </Text>
                        <Badge
                            colorScheme={data.statusDescricao === "CANCELADO" ? "red" : data.statusDescricao === "CONCLUÍDO" ? "purple" : "green"}
                            mb={0}
                            borderRadius="full"
                            px={2}
                            py={1}
                            fontSize="0.8em"
                        >
                            {data.statusDescricao}
                        </Badge>
                    </HStack>
                    <Text paddingTop={5} fontSize="18px" textTransform="uppercase" color="#172237" fontWeight="bold">
                        Veja os detalhes de seu agendamento:
                    </Text>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack align="start" spacing={4} w="100%">
                            <Card w="99%" bg='#DEDDB9' p={5}>
                                <Card w="100%" bg='#6E7980' p={5}>
                                    <Text fontSize="14px" color="#DEDDB9" fontWeight="bold" >
                                        Os agendamentos poderão ser cancelados apenas uma vez. Esta medida visa garantir a disponibilidade e organização dos nossos serviços.
                                    </Text>
                                </Card>
                                <Card w="100%" bg='#960402' p={5}>
                                    <Text fontSize="14px" color="#DEDDB9">
                                        Atenção!
                                        Informamos que o tempo máximo de tolerância para atrasos é de 10 minutos. Caso o cliente não compareça dentro deste período, não poderemos garantir a realização do atendimento, pois a agenda pode não permitir remanejamentos.
                                    </Text>
                                </Card>
                                <Card w="100%" bg='#3D4073' p={5}>
                                    <HStack align="center" paddingBottom={2}>
                                        <i className="pi pi-calendar-clock" style={{ fontSize: '20px', verticalAlign: 'middle', color: '#DEDDB9' }} />
                                        <Text fontSize="15px" color="#DEDDB9" fontWeight="bold">{formatDate(data.dataHoraAgendamento)}</Text>
                                    </HStack>
                                    <HStack align="center" paddingBottom={2}>
                                        <i className="pi pi-clock" style={{ fontSize: '20px', verticalAlign: 'middle', color: '#DEDDB9' }} />
                                        <Text fontSize="15px" color="#DEDDB9" fontWeight="bold">{formatTime(data.dataHoraAgendamento)}</Text>
                                    </HStack>
                                    <HStack align="center" paddingBottom={2}>
                                        <i className="pi pi-user" style={{ fontSize: '20px', verticalAlign: 'middle', color: '#DEDDB9' }} />
                                        <Text fontSize="15px" color="#DEDDB9" fontWeight="bold">{data.colaboradorNome}</Text>
                                    </HStack>
                                    <HStack align="center">
                                        <i className="pi pi-tag" style={{ fontSize: '20px', verticalAlign: 'middle', color: '#DEDDB9' }} />
                                        <Text fontSize="15px" color="#DEDDB9" fontWeight="bold">{data.clienteNome}</Text>
                                    </HStack>
                                </Card>
                                <Card w="100%" bg='#4B5257'>
                                    <HStack align="center">
                                        <Text paddingTop={5} paddingLeft={5} paddingBottom={4} fontSize="14px" color="#DEDDB9" fontWeight="bold" alignItems="left">
                                            O atendimento é p/ meu FILHO(a): &nbsp;
                                        </Text>
                                        <Text color="#DEDDB9" fontWeight="bold" fontSize="18px"> {data.observacoes}</Text>
                                    </HStack>
                                </Card>
                            </Card>

                        <VStack spacing={4} w="100%">
                            <ChakraProvider>
                                <Box w="100%" height={containerHeight} overflow="auto" position="relative">
                                    <DataGridService data={dataService} onUpdate={null} onDelete={null} />
                                    <ScrollTop target="parent" threshold={100} className="w-2rem h-2rem border-round bg-primary" icon="pi pi-arrow-up text-base" />
                                </Box>
                            </ChakraProvider>
                        </VStack>
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    {(user?.tipoUsuario === 'Gestor' || user?.tipoUsuario === 'Colaborador' && data.statusDescricao === "CANCELADO") ? (
                        <HStack spacing={4} paddingTop={5}>
                            <Button color="white" onClick={() => handleStatusChange(statusReativado)} bg="green" _hover={{ bg: "#2A542B" }} w="full" py={6} rightIcon={<ArrowBackIcon />} justifyContent="space-between">Agendar</Button>
                        </HStack>
                    ) : (
                        user.tipoUsuario !== 'Cliente' || data.statusDescricao === "AGENDADO" ? (
                            <HStack spacing={4} paddingTop={5}>
                                <Button color="white" onClick={() => handleStatusChange(statusCancelado)} bg="#A70D00" _hover={{ bg: "#460B06" }} w="full" py={6} justifyContent="space-between">Cancelar</Button>
                            </HStack>
                        ) : null
                    )}
                    {(user?.tipoUsuario === 'Gestor' || user?.tipoUsuario === 'Colaborador') && (
                        <HStack spacing={4} paddingLeft={5} paddingTop={5}>
                            <Button color="white" onClick={() => handleStatusChange(statusConcluido)} bg="#8965E2" _hover={{ bg: "#493678" }} w="full" py={6} justifyContent="space-between">Concluído</Button>
                        </HStack>
                    )}
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

AgendamentoModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    data: PropTypes.shape({
        agendamentoId: PropTypes.number.isRequired,
        colaboradorNome: PropTypes.string.isRequired,
        colaboradorId: PropTypes.number.isRequired,
        clienteNome: PropTypes.string.isRequired,
        clienteId: PropTypes.number.isRequired,
        calendarioId: PropTypes.number.isRequired,
        statusDescricao: PropTypes.string.isRequired,
        observacoes: PropTypes.string,
        dataHoraAgendamento: PropTypes.string.isRequired
    }).isRequired,
};

export default AgendamentoModal;

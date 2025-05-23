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
import { ScrollTop } from 'primereact/scrolltop';
import DataGridServicesAgendamento from './DataGridServicesAgendamento';
import { getServicesFromAgendamento } from '../../services/serviceService';
import { statusSchedulingForClient } from '../../services/schedulingService';
import { getClientPhoneByScheduling } from '../../services/schedulingService';
import { FaWhatsapp } from 'react-icons/fa';

const AgendamentoModal = ({ isOpen, onClose, data }) => {
    const { user, token } = useAuth();
    const [containerHeight] = useState('100%');
    const [dataService, setData] = useState([]);
    const toast = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPauseInfoOpen, setIsPauseInfoOpen] = useState(false);
    const [statusAtual, setStatusAtual] = useState(data.statusDescricao);
    const [clienteTelefone, setClienteTelefone] = useState('');
    const [whatsappLink, setWhatsappLink] = useState('');
    const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);


    const agendamentoId = data?.agendamentoId;
    const statusCancelado = 2;
    const statusReativado = 1;
    const statusConcluido = 4;
    const statusPausado = 7;

    const openPauseInfoModal = () => setIsPauseInfoOpen(true);
    const closePauseInfoModal = () => setIsPauseInfoOpen(false);

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

    useEffect(() => {
        if (isPauseInfoOpen && token) {
            const changeStatusToPausado = async () => {
                try {
                    // Altera o status para Pausado
                    await statusSchedulingForClient(agendamentoId, statusPausado, token);
                    setStatusAtual("PAUSADO");

                    // Busca o telefone do cliente
                    const phone = await getClientPhoneByScheduling(agendamentoId, token);
                    setClienteTelefone(phone);

                } catch (error) {
                    console.error("Erro ao buscar telefone do cliente:", error);
                    toast({
                        title: "Erro ao carregar telefone do cliente",
                        description: "Não foi possível carregar o telefone do cliente. Por favor, tente novamente.",
                        status: "error",
                        duration: 4000,
                        isClosable: true,
                    });
                } finally {
                    setIsSubmitting(false);
                }
            };

            setIsSubmitting(true);
            changeStatusToPausado();
        }
    }, [isPauseInfoOpen, token, agendamentoId, toast]);

    // UseEffect para determinar o link do WhatsApp baseado no dispositivo
    useEffect(() => {
        if (clienteTelefone) {
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            const link = isMobile
                ? `whatsapp://send?phone=55${clienteTelefone}`
                : `https://web.whatsapp.com/send?phone=55${clienteTelefone}`;
            setWhatsappLink(link);
        }
    }, [clienteTelefone]);

    const getStatusColor = (statusDescricao) => {
        switch (statusDescricao) {
            case 'CANCELADO':
                return 'red';
            case 'CONCLUÍDO':
                return 'purple';
            case 'PAUSADO':
                return 'yellow';
            case 'AGENDADO':
                return 'green';
            default:
                return 'gray';
        }
    };

    const handleStatusChange = async (status) => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            if (status === statusPausado) {
                await statusSchedulingForClient(agendamentoId, statusPausado, token);
                setStatusAtual("PAUSADO");
                openPauseInfoModal();
            } else {
                await statusSchedulingForClient(agendamentoId, status, token);
            }

            let title, description;

            if (status === statusCancelado) {
                title = "Cancelado!";
                description = "O Agendamento foi cancelado!";
            } else if (status === statusReativado) {
                title = "Reagendado!";
                description = "O Agendamento foi reagendado!";
            } else if (status === statusPausado) {
                title = "Pausado!";
                description = "O Agendamento foi pausado!";
            } else {
                title = "Concluído!";
                description = "O Agendamento foi concluído!";
            }

            toast({
                title: title,
                description: description,
                status: "success",
                duration: 2000,
                isClosable: true,
                onCloseComplete: () => {
                    setIsSubmitting(false);
                    if (status !== statusPausado) {
                        onClose();
                    }
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
        <>
            <Modal isOpen={isOpen} onClose={onClose} isCentered motionPreset="scale">
                <ModalOverlay />
                <ModalContent w="370px">
                    <ModalHeader fontWeight="bold" color="#172237" mb={2}>
                        <HStack>
                            <Avatar name={user?.nome || 'No Name'} src={user?.image || 'https://fallback-url.com/default-avatar.png'} mr={2} />
                            <VStack align="flex-start" spacing={0}>
                                <Text fontSize="md" color="#172237" fontWeight="bold">{"Olá,"}&nbsp;&nbsp;{user?.nome || 'No Name'}</Text>
                                <Text fontSize="sm" color="#172237">{user?.email || 'noemail@example.com'}</Text>
                            </VStack>
                        </HStack>
                        <Text paddingTop={5} fontSize="16px" textTransform="uppercase" color="#172237">
                            Detalhes do agendamento:
                        </Text>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack align="start" spacing={2} w="100%">
                            <Card w="100%" bg='#CECECECE' p={3}>
                                <Card w="300px" bg='#FFFF' p={5} position="relative" >
                                    <Badge
                                        colorScheme={getStatusColor(statusAtual)}
                                        mb={0}
                                        borderRadius="full"
                                        px={2}
                                        py={1}
                                        fontSize="13px"
                                        position="absolute"
                                        top="10px"
                                        right="10px"
                                    >
                                        {statusAtual}
                                    </Badge>
                                    <HStack align="center" paddingBottom={1}>
                                        <i className="pi pi-calendar-clock" style={{ fontSize: '20px', verticalAlign: 'middle', color: 'green' }} />
                                        <Text fontSize="18px" color="#172237" fontWeight="bold">{formatDate(data.dataHoraAgendamento)}</Text>
                                    </HStack>
                                    <HStack align="center" paddingBottom={1}>
                                        <i className="pi pi-clock" style={{ fontSize: '20px', verticalAlign: 'middle', color: 'green' }} />
                                        <Text fontSize="18px" color="#172237" fontWeight="bold">{formatTime(data.dataHoraAgendamento)}</Text>
                                    </HStack>
                                    <HStack align="center">
                                        <i className="pi pi-user" style={{ fontSize: '20px', verticalAlign: 'middle', color: 'green' }} />
                                        <Text fontSize="18px" color="#172237" fontWeight="bold">{data.colaboradorNome}</Text>
                                    </HStack>

                                </Card>
                            </Card>
                            <Card w="100%" bg='#CECECECE' p={3}>
                                <Card w="300px" bg='#FFFF'>
                                    <HStack align="center">
                                        <Text paddingTop={2} paddingLeft={5} paddingBottom={2} fontSize="12px" color="#172237" fontWeight="bold" alignItems="left">
                                            O atendimento é<br></br>p/ meu FILHO(a): &nbsp;
                                        </Text>
                                        <Text color="#172237" fontWeight="bold" fontSize="18px"> {data.observacoes}</Text>
                                    </HStack>
                                </Card>
                            </Card>

                            <VStack spacing={4} w="100%">
                                <ChakraProvider>
                                    <Box w="100%" height={containerHeight} overflow="auto" position="relative">
                                        <DataGridServicesAgendamento data={dataService} onUpdate={null} onDelete={null} />
                                        <ScrollTop target="parent" threshold={100} className="w-2rem h-2rem border-round bg-primary" icon="pi pi-arrow-up text-base" />
                                    </Box>
                                </ChakraProvider>
                            </VStack>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        {(user?.tipoUsuario !== 'Cliente' && statusAtual === "CANCELADO") ? (
                            <HStack spacing={4} paddingTop={5}>
                                <Button color="white" onClick={() => handleStatusChange(statusReativado)} bg="green" _hover={{ bg: "#2A542B" }} w="full" py={6} justifyContent="space-between">Reagendar</Button>
                            </HStack>
                        ) : (
                            user.tipoUsuario !== 'Cliente' || statusAtual === "AGENDADO" || statusAtual === "PAUSADO" ? (
                                <HStack spacing={4} paddingTop={5}>
                                    <Button color="white" onClick={() => setIsModalConfirmOpen(true)} bg="#A70D00" _hover={{ bg: "#460B06" }} w="full" py={6} justifyContent="space-between">Cancelar</Button>
                                </HStack>
                            ) : null
                        )}
                        {/* Na segunda linha repeti gestor para por hora o colaborador não poder pausar..  */}
                        {(user?.tipoUsuario === 'Gestor' || user?.tipoUsuario === 'Gestor') && statusAtual !== "CANCELADO" && (
                            <>
                                <HStack spacing={4} paddingLeft={2} paddingTop={5}>
                                    <Button color="white" onClick={() => handleStatusChange(statusConcluido)} bg="#8965E2" _hover={{ bg: "#493678" }} w="full" py={6} justifyContent="space-between">Concluído</Button>
                                </HStack>
                                <HStack spacing={4} paddingLeft={2} paddingTop={5}>
                                    <Button color="white" onClick={openPauseInfoModal} bg="#EBC01B" _hover={{ bg: "#EA9F1B" }} w="full" py={6} justifyContent="space-between">Pausado</Button>
                                </HStack>
                            </>
                        )}
                    </ModalFooter>

                </ModalContent>
            </Modal>

            <Modal isOpen={isModalConfirmOpen} onClose={() => setIsModalConfirmOpen(false)} isCentered
            motionPreset="slideInBottom">
                <ModalOverlay />
                <ModalContent
                maxW="500px"
                w="90%"
                maxH="90vh"
                overflowY="auto"
                >
                    <ModalHeader>Atenção!</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4}>
                            <Card w="100%" bg='#FEFF92' p={5}>
                                <HStack align="center" paddingBottom={2}>
                                    <i className="pi pi-info-circle" style={{ fontSize: '20px', verticalAlign: 'middle' }} />
                                    <Text paddingLeft={4} fontSize="10px" color="#172237">
                                        Os agendamentos poderão ser cancelados apenas uma vez. Esta medida visa garantir a disponibilidade e organização dos nossos serviços.
                                    </Text>
                                </HStack>
                            </Card>
                            <Card w="100%" bg='#F25E5E' p={5}>
                                <HStack align="center" paddingBottom={2}>
                                    <i className="pi pi-exclamation-triangle" style={{ fontSize: '20px', verticalAlign: 'middle', color: 'white' }} />
                                    <Text paddingLeft={4} fontSize="10px" color="white">
                                        <strong>Atenção!</strong><br></br>
                                        Informamos que o tempo máximo de tolerância para atrasos é de 10 minutos. Caso o cliente não compareça dentro deste período, não poderemos garantir a realização do atendimento, pois a agenda pode não permitir remanejamentos.
                                    </Text>
                                </HStack>
                            </Card>
                            <Card bg='#59FFA7' p={5}>
                                <HStack align="center" paddingBottom={2}>
                                    <i className="pi pi-info-circle" style={{ fontSize: '20px', verticalAlign: 'middle', color: '#38a169' }} />
                                    <Text paddingLeft={4} fontSize="10px" fontWeight="bold" color="#38a169">
                                        Após realizar o cancelamento, você receberá uma confirmação por e-mail.
                                    </Text>
                                </HStack>
                            </Card>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="red" mr={3} onClick={() => { setIsModalConfirmOpen(false); handleStatusChange(statusCancelado); }}>
                            Sim, Cancelar
                        </Button>
                        <Button colorScheme="blue" onClick={() => setIsModalConfirmOpen(false)}>
                            Não, Voltar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal isOpen={isPauseInfoOpen} onClose={closePauseInfoModal} isCentered size="xl" motionPreset="scale">
                <ModalOverlay />
                <ModalContent w={{ base: '90%', md: '70%', lg: '50%' }}>
                    <ModalHeader>
                        <HStack>
                            <Avatar name={user?.nome || 'No Name'} src={user?.image || 'https://fallback-url.com/default-avatar.png'} mr={2} />
                            <VStack align="flex-start" spacing={0}>
                                <Text fontSize="md" color="#172237" fontWeight="bold">{"Olá,"}&nbsp;&nbsp;{user?.nome || 'No Name'}</Text>
                                <Text fontSize="sm" color="#172237">{user?.email || 'noemail@example.com'}</Text>
                            </VStack>
                        </HStack>
                        <HStack paddingTop={5} paddingBottom={1} align="center">
                            <Text fontSize="16px" color="#504E42" fontWeight="bold" alignItems="left">
                                Status:&nbsp;&nbsp;
                            </Text>
                            <Badge
                                colorScheme={getStatusColor(statusAtual)}
                                mb={0}
                                borderRadius="full"
                                px={2}
                                py={1}
                                fontSize="0.8em"
                            >
                                {statusAtual}
                            </Badge>
                        </HStack>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack align="start" spacing={4} w="100%">
                            <Card w="100%" bg='#FEFF92' p={5}>
                                <HStack align="center">
                                    <i className="pi pi-info-circle" style={{ fontSize: '20px', verticalAlign: 'middle' }} />
                                    <Text paddingLeft={4} mb={4} fontSize={12}>
                                        O status <strong>Pausado</strong> é utilizado para entrar em contato com o cliente.
                                        Após comunicar-se com ele pelo WhatsApp, você poderá efetuar o cancelamento, clicando no botão <strong>Cancelar</strong>.
                                    </Text>
                                </HStack>
                            </Card>
                            <Card w="100%" bg='#F25E5E' p={5}>
                                <HStack align="center">
                                    <i className="pi pi-exclamation-triangle" style={{ fontSize: '20px', verticalAlign: 'middle', color: 'white' }} />
                                    <Text paddingLeft={4} mb={2} fontSize={12} color='white'>
                                        Obs.: Ao Cancelar o cliente receberá um e-mail formalizando o cancelamento do agendamento.
                                    </Text>
                                </HStack>
                            </Card>
                            <Text>
                                Chamar cliente pelo WhatsApp abaixo:
                            </Text>
                            <Button
                                as="a"
                                href={whatsappLink}
                                target="_blank"
                                colorScheme="green"
                                leftIcon={<FaWhatsapp />}
                                _hover={{
                                    bg: "green.300",
                                    color: "white"
                                }}
                            >
                                Comunicar via WhatsApp
                            </Button>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={closePauseInfoModal}>
                            Fechar
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
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
        dataHoraAgendamento: PropTypes.string.isRequired,
    }).isRequired,
};

export default AgendamentoModal;

import { useState, useEffect } from "react";
import { Calendar } from 'primereact/calendar';
import { ScrollTop } from 'primereact/scrolltop';
import usePrimeReactLocale from '../hooks/usePrimeReactLocale';
import { ChakraProvider, Button, Flex, Box, VStack, useToast, Select, Switch, Text, HStack, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Image, Card } from '@chakra-ui/react';
import TitleSection from '../components/common/TitleSection';
import DataGridHour from '../components/common/DataGridHour';
import DataGridHourService from '../components/common/DataGridHourService';
import { getCollaborators } from '../services/collaboratorService';
import { getServicesForCollaborator } from "../services/serviceService";
import { registerScheduling } from '../services/schedulingService';
import { getCalendarInDisponibility } from '../services/calendarService';
import ActionButtons from '../components/common/ActionButtons';
import { useUserRedirect } from '../hooks/UseUserRedirect';
import { useAuth } from '../contexts/AuthContext';
import kezukaIMGperfil from '../assets/kezuka.png';
import lucasIMGperfil from '../assets/lucas.png';
import henriqueIMGperfil from '../assets/henrique.png';
import { Spinner } from '@chakra-ui/react';
import { FaWhatsapp } from 'react-icons/fa';

const CadastroAgendamento = () => {
    usePrimeReactLocale();
    const { user, token } = useAuth();
    const toast = useToast();
    const [collaborators, setCollaborators] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedCollaboratorId, setSelectedCollaboratorId] = useState('');
    const [data, setData] = useState([]);
    const [dataService, setDataService] = useState([]);
    const { redirectToDashboard } = useUserRedirect();
    const [selectedItem, setSelectedItem] = useState(null);
    const agendado = 1;
    const [selectedItemService, setSelectedItemsService] = useState([]);
    const [isServiceSwitchOn, setIsServiceSwitchOn] = useState(false);
    const [isCalendarSelectOn, setIsCalendarSelectOn] = useState(false);
    const [containerHeight, setContainerHeight] = useState('200px');
    const [containerHeight2, setContainerHeight2] = useState('200px');
    const [showSelectedServices, setShowSelectedServices] = useState(false);
    const [showInputObs, setShowInputObs] = useState(true);
    const [isServiceSwitchOnObs, setIsServiceSwitchOnObs] = useState(false);
    const [isServiceSwitchOnObsInput, setIsServiceSwitchOnObsInput] = useState(false);
    const [observacoes, setObservacoes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalInfoOpen, setIsModalInfoOpen] = useState(false);
    const [isInfoAgendamentoOn, setInfoAgendamento] = useState(false);
    const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);
    const [collaboratorName, setCollaboratorName] = useState('');
    const [collaboratorPhoto, setCollaboratorPhoto] = useState('');
    const [collaboratorDescription, setCollaboratorDescription] = useState('');
    const [whatsappLink, setWhatsappLink] = useState('');
    const clienteTelefone = 31994875143;

    useEffect(() => {
        if (clienteTelefone) {
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            const link = isMobile
                ? `whatsapp://send?phone=55${clienteTelefone}`
                : `https://web.whatsapp.com/send?phone=55${clienteTelefone}`;
            setWhatsappLink(link);
        }
    }, [clienteTelefone]);

    useEffect(() => {
        if (!showInputObs) {
            setObservacoes('');
        }
    }, [showInputObs]);
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const collabData = await getCollaborators(token);
                setCollaborators(collabData);
            } catch (error) {
                toast({
                    title: "Erro ao carregar dados",
                    description: "Não foi possível carregar dados necessários.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        };
        fetchData();
    }, [token, toast]);

    useEffect(() => {
        setData([]);
        setIsCalendarSelectOn(false);
        setInfoAgendamento(false)
        setDataService([]);

        if (selectedCollaboratorId && selectedDate) {
            const formattedDate = `${selectedDate.getFullYear()}-${selectedDate.getDate().toString().padStart(2, '0')}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}`;
            getCalendarInDisponibility(selectedCollaboratorId, formattedDate, token)
                .then(response => {
                    setData(response);
                    setIsCalendarSelectOn(true);
                    setInfoAgendamento(true);
                    toast({
                        title: "Consulta",
                        description: "Escolha um horário para atendimento...",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                    });
                })
                .catch(error => {
                    setInfoAgendamento(true);
                    toast({
                        title: "Consulta",
                        description: error.message || "Não há horários disponíveis para esta data.",
                        status: "info",
                        duration: 3000,
                        isClosable: true,
                    });
                });
        }
    }, [selectedCollaboratorId, selectedDate, token, toast]);

    const handleCollaboratorSelect = (collaboratorId) => {
        setSelectedCollaboratorId(collaboratorId);

        let name = '';
        let photo = '';
        let description = '';

        if (collaboratorId === 23) {
            name = 'Matheus Kezuka';
            photo = kezukaIMGperfil;
            description = 'Matheus Kezuka é visagista e especialista em cortes infantis. Ele oferece uma variedade de serviços de estética masculina, além de atender a serviços de barbearia tradicional.';
        } else if (collaboratorId === 24) {
            name = 'Henrique Lucas';
            photo = henriqueIMGperfil;
            description = 'Henrique Lucas é barbeiro especializado em cortes contemporâneos e utiliza técnicas de "freestyle" para criar desenhos e cortes diferenciados, além de atender a serviços de barbearia tradicional.';
        } else if (collaboratorId === 25) {
            name = 'Lucas Vinícius';
            photo = lucasIMGperfil;
            description = 'Lucas Vinícius é visagista e especialista em cortes infantis. Ele oferece uma variedade de serviços de estética masculina, além de atender a serviços de barbearia tradicional.';
        }

        setCollaboratorName(name);
        setCollaboratorPhoto(photo);
        setCollaboratorDescription(description);
        setIsModalOpen(true);
    };

    const handleClose = () => {
        redirectToDashboard();
    };

    const handleCheckboxHourClick = (calendarioId, dataHoraConfigurada) => {
        setSelectedItem(prevSelected => {
            const newSelection = prevSelected && prevSelected.calendarioId === calendarioId ? null : { calendarioId, dataHoraConfigurada };
            setContainerHeight(newSelection ? '100px' : '200px');
            setIsModalInfoOpen(true);
            return newSelection;
        });
    };

    const handleCheckboxServiceClick = (serviceId) => {
        setSelectedItemsService(prevSelected => {
            const alreadySelected = Array.isArray(prevSelected) ? prevSelected.includes(serviceId) : false;
            if (alreadySelected) {
                return prevSelected.filter(id => id !== serviceId);

            } else {
                return [...(prevSelected || []), serviceId];
            }
        });
    };

    const handleShowSelectedServices = () => {
        setShowSelectedServices(prevState => {
            setContainerHeight2(prevState ? '200px' : '100px');
            setIsServiceSwitchOnObs(!prevState);
            setIsServiceSwitchOnObsInput(!prevState);
            return !prevState;
        });
    };

    const handleShowObs = () => {
        setShowInputObs(prevState => {
            setIsServiceSwitchOnObsInput(!prevState);
            return !prevState;
        });
    };

    const filteredDataService = showSelectedServices ? dataService.filter(item => selectedItemService.includes(item.servicoId)) : dataService;

    const handleServiceSwitchChange = async () => {
        const newSwitchState = !isServiceSwitchOn;
        setIsServiceSwitchOn(newSwitchState);
        if (newSwitchState) {
            try {
                const servicesData = await getServicesForCollaborator(selectedCollaboratorId, token);
                setDataService(servicesData);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
                toast({
                    title: "Erro ao carregar dados",
                    description: "Não foi possível carregar os dados dos serviços. Por favor, tente novamente.",
                    status: "error",
                    duration: 4000,
                    isClosable: true,
                });
            }
        } else {
            setDataService([]);
            setShowSelectedServices(false);
            setShowInputObs(false);
            setIsServiceSwitchOnObs(false);
            setIsServiceSwitchOnObsInput(false);
        }
    };

    const handleSave = async () => {
        if (isAdding || isSubmitting) return;

        setIsSubmitting(true);

        if (!isCalendarSelectOn || data.length === 0) {
            setIsAdding(true);
            toast({
                title: "Atenção!",
                description: "Nenhum horário disponível para este profissional!",
                status: "info",
                duration: 3000,
                isClosable: true,
                onCloseComplete: () => { setIsAdding(false); setIsSubmitting(false); }
            });
            return;
        }

        if (!selectedItem) {
            setIsAdding(true);
            toast({
                title: "Atenção!",
                description: "Selecione uma data e hora para o agendamento.",
                status: "info",
                duration: 3000,
                isClosable: true,
                onCloseComplete: () => { setIsAdding(false); setIsSubmitting(false); }
            });
            return;
        }

        if (!showSelectedServices && !isServiceSwitchOnObs) {
            setIsAdding(true);
            toast({
                title: "Selecione pelo menos um serviço para agendar.",
                description: "Ao selecionar os serviços, não se esqueça de adicioná-los.",
                status: "info",
                duration: 3000,
                isClosable: true,
                onCloseComplete: () => { setIsAdding(false); setIsSubmitting(false); }
            });
            return;
        }

        if (isServiceSwitchOnObsInput && !observacoes.trim()) {
            setIsAdding(true);
            toast({
                title: "O Atendimento é infantil?",
                description: "Desmarque caso o atendimento seja para você!",
                status: "info",
                duration: 2000,
                isClosable: true,
                onCloseComplete: () => { setIsAdding(false); setIsSubmitting(false); }
            });
            return;
        }

        setIsAdding(true);

        const payload = {
            colaboradorId: selectedCollaboratorId,
            clienteId: user.id,
            calendarioId: selectedItem.calendarioId,
            statusId: agendado,
            observacoes,
            dataHoraAgendamento: selectedItem.dataHoraConfigurada,
            servicos: selectedItemService.map(serviceId => ({
                servicoId: serviceId,
                quantidade: 1
            }))
        };

        try {
            await registerScheduling(payload, token);
            toast({
                title: "Agendamento de Horário",
                description: "Agendamento realizado com sucesso.",
                status: "success",
                duration: 3000,
                isClosable: true,
                onCloseComplete: () => { redirectToDashboard(); setIsAdding(false); setIsSubmitting(false); }
            });
        } catch (error) {
            toast({
                title: "Atenção!",
                description: error.message || "Não foi possível registrar o agendamento, verifique o tempo por serviço pode haver conflito de horários ou falta disponibilidade!",
                status: "error",
                duration: 3000,
                isClosable: true,
                onCloseComplete: () => { setIsAdding(false); setIsSubmitting(false); }
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Flex direction="column" minH="100vh" align="center" justify="center" bgGradient="linear(180deg, #3D5A73, #182625)" w="100vw" m="0" p="0" overflowX="hidden">
            <TitleSection title="Agendamento" subtitle="Preencha os campos para realizar o agendamento" />
            <Box bg="#fff" p={5} shadow="md" borderWidth="1px" borderRadius="md" w={['100%', '100%', '50%']} maxWidth="960px" marginX="auto" marginTop="2rem" mt="1rem">
                <VStack spacing={4}>
                    <Box p={3} shadow="md" borderWidth="1px" borderRadius="md" w={['100%', '100%', '100%']}>
                        <Card bg='#59FFA7' p={5}>
                            <HStack align="center" paddingBottom={2}>
                                <i className="pi pi-info-circle" style={{ fontSize: '27px', verticalAlign: 'middle', color: '#38a169' }} />
                                <Text paddingLeft={4} fontSize="14px" fontWeight="bold" color="#38a169">
                                    Se precisar de um horário que não esteja disponível, entre em contato com nosso suporte pelo WhatsApp.
                                </Text>
                            </HStack>
                            <Button
                                as="a"
                                href={whatsappLink}
                                target="_blank"
                                colorScheme="green"
                                leftIcon={<FaWhatsapp />}
                                mt={4}
                                _hover={{
                                    bg: "green.300",
                                    color: "white"
                                }}
                            >
                                Verificar
                            </Button>
                        </Card>
                    </Box>
                </VStack>
            </Box>

            <Box bg="#fff" p={5} shadow="md" borderWidth="1px" borderRadius="md" w={['100%', '100%', '50%']} maxWidth="960px" marginX="auto" marginTop="2rem" marginBottom="2rem" mt="1rem">
                <VStack spacing={4}>

                    <Box className="card flex flex-wrap gap-3 p-fluid">
                        <Select placeholder="Selecione o Colaborador" name="colaboradorId" fontSize="18px" color="#3D5A73" fontWeight="bold" onChange={(e) => handleCollaboratorSelect(parseInt(e.target.value, 10))}>
                            {collaborators.map(col => (
                                <option key={col.colaboradorId} value={col.colaboradorId}>{col.nome}</option>
                            ))}
                        </Select>
                        <Box className="flex-auto">
                            <Calendar
                                id="buttondisplay"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.value)}
                                showIcon style={{ fontSize: '20px' }}
                                dateFormat="dd/mm/yy"
                                icon={() => <i className="pi pi-calendar" style={{ fontSize: '20px' }} />}
                                minDate={new Date()}
                            />
                        </Box>
                    </Box>
                    {isCalendarSelectOn && (
                        <ChakraProvider>
                            <Box w={{ base: '100%', md: '70%' }} height={containerHeight} overflow="auto" position="relative">
                                <DataGridHour data={data} onCheckboxClick={handleCheckboxHourClick} selectedItem={selectedItem} />
                                <ScrollTop target="parent" threshold={100} className="w-2rem h-2rem border-round bg-primary" icon="pi pi-arrow-up text-base" />
                            </Box>
                        </ChakraProvider>
                    )}
                    <Modal isOpen={isModalInfoOpen} onClose={() => setIsModalInfoOpen(false)} isCentered>
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
                                                Informamos que o tempo máximo de tolerância para atrasos é de 10 minutos. Caso o cliente não compareça dentro deste período, não poderemos garantir a realização do atendimento, pois a agenda pode não permitir remanejamentos.
                                            </Text>
                                        </HStack>
                                    </Card>
                                    <Card bg='#59FFA7' p={5}>
                                        <HStack align="center" paddingBottom={2}>
                                            <i className="pi pi-info-circle" style={{ fontSize: '27px', verticalAlign: 'middle', color: '#38a169' }} />
                                            <Text paddingLeft={4} fontSize="14px" fontWeight="bold" color="#38a169">
                                                Após realizar o agendamento, você receberá o comprovante por e-mail.
                                            </Text>
                                        </HStack>
                                    </Card>
                                </VStack>
                                <br></br>
                            </ModalBody>
                        </ModalContent>
                    </Modal>
                    <Modal isOpen={isModalOpen} onClose={() => {
                        setIsModalOpen(false);
                        if (selectedCollaboratorId === 24) {
                            setIsModalConfirmOpen(true);
                        }
                    }} isCentered>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Perfil do Profissional</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <VStack spacing={4} paddingBottom={8} align="center">
                                    <Text fontSize="30px" fontWeight="bold">{collaboratorName}</Text>
                                    <Image
                                        src={collaboratorPhoto}
                                        alt={collaboratorName}
                                        w="40%"
                                    />
                                    <Text w="80%" fontSize="16px">{collaboratorDescription}</Text>
                                </VStack>
                            </ModalBody>
                        </ModalContent>
                    </Modal>

                    <HStack py={4} align="left">
                        <Switch colorScheme="green" size='lg' isChecked={isServiceSwitchOn} onChange={handleServiceSwitchChange} />
                        <Text fontSize="18px" color="#3D5A73" fontWeight="bold" paddingLeft={4} alignItems="left">Confirmar Horário</Text>
                    </HStack>
                    {isServiceSwitchOn && (
                        <ChakraProvider>
                            <Box w={{ base: '100%', md: '80%' }} height={containerHeight2} overflow="auto" position="relative">
                                <DataGridHourService data={filteredDataService} onCheckboxClick={handleCheckboxServiceClick} selectedItemService={selectedItemService} />
                                <ScrollTop target="parent" threshold={100} className="w-2rem h-2rem border-round bg-primary" icon="pi pi-arrow-up text-base" />
                            </Box>
                            <HStack py={4} align="left">
                                <Switch colorScheme="green" size="lg" isChecked={showSelectedServices} onChange={handleShowSelectedServices} />
                                <Text fontSize="18px" color="#3D5A73" paddingLeft={4} alignItems="left" fontWeight="bold">Confirmar Serviços</Text>
                                {isServiceSwitchOnObs && (
                                    <HStack align="left">
                                        <Switch paddingLeft={4} colorScheme="green" size="lg" isChecked={showInputObs} onChange={handleShowObs} />
                                        <Text fontSize="18px" color="#3D5A73" paddingLeft={4} alignItems="left" fontWeight="bold">O atendimento é p/ meu FILHO(a):</Text>
                                    </HStack>
                                )}
                            </HStack>
                            {isServiceSwitchOnObsInput && showInputObs && (
                                <Box w={{ base: '100%', md: '70%' }} overflow="auto" position="relative">
                                    <Input placeholder='Digite o nome da Criança' size='lg' fontSize="18px" color="#3D5A73" fontWeight="bold" value={observacoes} onChange={(e) => setObservacoes(e.target.value)} />
                                </Box>
                            )}
                        </ChakraProvider>
                    )}

                    <Modal isOpen={isModalConfirmOpen} onClose={() => setIsModalConfirmOpen(false)} isCentered>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Lembrete!</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <VStack spacing={4}>
                                    <Card w="100%" bg='#FEFF92' p={5}>
                                        <HStack align="center">
                                            <i className="pi pi-info-circle" style={{ fontSize: '27px', verticalAlign: 'middle' }} />
                                            <Text paddingLeft={4} fontSize="16px" color="#172237">
                                                Os atendimentos infantis são realizados apenas por Matheus Kezuka & Lucas Vinícius.
                                            </Text>
                                        </HStack>
                                    </Card>
                                </VStack>
                                <br></br>
                            </ModalBody>
                        </ModalContent>
                    </Modal>

                    <ActionButtons onBack={handleClose} onSave={handleSave} isSaveDisabled={isAdding || isSubmitting} saveLabel="Agendar" />
                    {isSubmitting && (
                        <Spinner
                            thickness="4px"
                            speed="0.65s"
                            emptyColor="gray.200"
                            color="blue.500"
                            size="xl"
                            mt={4}
                        />
                    )}
                </VStack>
            </Box>
        </Flex>
    );
};

export default CadastroAgendamento;


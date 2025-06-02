import { useState, useEffect } from "react";
import { Calendar } from 'primereact/calendar';
import usePrimeReactLocale from '../hooks/usePrimeReactLocale';
import { ChakraProvider, Checkbox, Badge, Tag, HStack, Box, VStack, useToast, Text, Image, Card, Button, Flex, Spinner, Input, Stepper, Step, StepIndicator, StepStatus, StepIcon, StepNumber, StepSeparator, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@chakra-ui/react';
import { FaWhatsapp } from 'react-icons/fa';
import TitleSection from '../components/common/TitleSection';
import DataGridHour from '../components/common/DataGridHour';
import DataGridHourService from '../components/common/DataGridHourService';
import ActionButtons from '../components/common/ActionButtons';
import { getCollaborators } from '../services/collaboratorService';
import { getServicesForCollaborator } from "../services/serviceService";
import { registerScheduling } from '../services/schedulingService';
import { getCalendarInDisponibility } from '../services/calendarService';
import { useUserRedirect } from '../hooks/UseUserRedirect';
import { useAuth } from '../contexts/AuthContext';
import kezukaIMGperfil from '../assets/matheus_kezuka.png';
import danielIMGperfil from '../assets/daniel_sena.png';
import henriqueIMGperfil from '../assets/henrique_lucas.png';

const NovoAgendamento = () => {
    const { user, token } = useAuth();
    const toast = useToast();
    const { redirectToDashboard } = useUserRedirect();
    usePrimeReactLocale();
    const { getNextAvailableDate } = usePrimeReactLocale();
    const [step, setStep] = useState(0);
    const [collaborators, setCollaborators] = useState([]);
    const [selectedCollaboratorId, setSelectedCollaboratorId] = useState('');
    const [selectedDate, setSelectedDate] = useState(getNextAvailableDate());
    const [data, setData] = useState([]);
    const [dataService, setDataService] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedItemService, setSelectedItemsService] = useState([]);
    const [isForChild, setIsForChild] = useState(true);
    const [observacoes, setObservacoes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const clienteTelefone = 31994875143;
    const [whatsappLink, setWhatsappLink] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const agendado = 1;

    const steps = [
        { title: 'Atendimento', description: 'Profissional' },
        { title: 'Agendamento', description: 'Data e Hora' },
        { title: 'Serviços', description: 'Serviços' },
        { title: 'Confirmação', description: 'Agendar' }
    ];

    const handleNextStep = () => {
        if (step === 0 && !selectedCollaboratorId) {
            toast({
                title: "Atenção!",
                description: "Por favor, selecione um profissional antes de avançar.",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        if (step === 1) {
            if (data.length === 0) {
                toast({
                    title: "Não há horários para hoje",
                    description: "Verifique outra data, ou selecione outro profissional!",
                    status: "warning",
                    duration: 3000,
                    isClosable: true,
                });
                return;
            }
        
            if (!selectedItem) {
                toast({
                    title: "Atenção",
                    description: "Por favor, selecione um horário antes de avançar.",
                    status: "warning",
                    duration: 3000,
                    isClosable: true,
                });
                return;
            }
        }        

        if (step === 2 && selectedItemService.length === 0) {
            toast({
                title: "Atenção!",
                description: "Por favor, selecione pelo menos um serviço antes de avançar.",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setStep(prevStep => prevStep + 1);
    };

    const handleDateChange = (e) => {
        const newDate = e.value;
        const day = newDate.getDay();

        if (day === 0 || day === 1) {
            setSelectedDate(getNextAvailableDate());
            toast({
                title: "Data Inválida",
                description: "Datas de domingo e segunda são indisponíveis. Selecione as próxima datas disponíveis.",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
        } else {
            setSelectedDate(newDate);
        }
    };

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

    const collaboratorImages = {
        23: kezukaIMGperfil,
        24: henriqueIMGperfil,
        25: danielIMGperfil
    };

    const collaboratorDescriptions = {
        23: (
            <>
                <Tag colorScheme="purple" mt={1} fontSize={8}>Infantil</Tag>
                <Tag colorScheme="green" mt={1} fontSize={8}>Adulto</Tag>
            </>
        ),
        24: (
            <>
                <Tag colorScheme="purple" mt={1} fontSize={8}>Infantil</Tag>
                <Tag colorScheme="green" mt={1} fontSize={8}>Adulto</Tag>
            </>
        ),
        25: (
            <>
                <Tag colorScheme="green" mt={1} fontSize={8}>Adulto</Tag>
            </>
        )
    };

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
        const fetchServices = async () => {
            if (selectedCollaboratorId) {
                try {
                    const servicesData = await getServicesForCollaborator(selectedCollaboratorId, token);
                    setDataService(servicesData);
                } catch (error) {
                    toast({
                        title: "Erro ao carregar serviços",
                        description: "Não foi possível carregar os serviços.",
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                    });
                }
            }
        };
        fetchServices();
    }, [selectedCollaboratorId, token, toast]);

    useEffect(() => {
        setData([]);
        if (selectedCollaboratorId && selectedDate) {
            const formattedDate = `${selectedDate.getFullYear()}-${selectedDate.getDate().toString().padStart(2, '0')}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}`;
            getCalendarInDisponibility(selectedCollaboratorId, formattedDate, token)
                .then(response => {

                    const filteredData = response.filter(item => {
                        const timeStr = item.dataHoraConfigurada.split('T')[1].substring(0, 5);
                        return !isTimeInThePast(selectedDate, timeStr);
                    });

                    if (filteredData.length === 0 && step == 0) {
                        // toast({
                        //     title: "Não há horários para hoje",
                        //     description: "Verifique outra data em seguida, ou selecione outro profissional!",
                        //     status: "warning",
                        //     duration: 4000,
                        //     isClosable: true,
                        // });
                        setData([]);
                    } else {
                        setData(filteredData);
                        if (step == 1) {
                            toast({
                                title: "Consulta",
                                description: "Escolha um horário para atendimento...",
                                status: "success",
                                duration: 2000,
                                isClosable: true,
                            });
                        }
                    }
                })
                .catch(error => {
                    console.error("Erro ao carregar horários:", error.message || "Não há horários disponíveis para esta data.");
                });
        }
    }, [selectedCollaboratorId, selectedDate, token, toast]);

    const isTimeInThePast = (date, timeStr) => {
        const now = new Date();
        const dateSelected = new Date(date);

        const [hours, minutes] = timeStr.split(":").map(Number);
        dateSelected.setHours(hours, minutes, 0, 0);

        return dateSelected < now;
    };

    const handleCollaboratorSelect = (collaboratorId) => {

        setSelectedCollaboratorId(collaboratorId);
        setSelectedItem(null);
        setSelectedDate(getNextAvailableDate());
        setData([]);
    };


    const handleCheckboxHourClick = (calendarioId, dataHoraConfigurada) => {
        setSelectedItem(prevSelected => {
            const newSelection = prevSelected && prevSelected.calendarioId === calendarioId ? null : { calendarioId, dataHoraConfigurada };
            return newSelection;
        });
    };

    const handleCheckboxServiceClick = (serviceId) => {
        setSelectedItemsService(prevSelected => {
            const alreadySelected = prevSelected.includes(serviceId);
            return alreadySelected ? prevSelected.filter(id => id !== serviceId) : [...prevSelected, serviceId];
        });
    };

    const handleClose = () => {
        redirectToDashboard();
    };


    const handlePreviousStep = () => {
        if (step === 0) {
            handleClose();
        } else if (step === 1) {
            setSelectedCollaboratorId('');
            setSelectedItem(null);
            setSelectedDate(getNextAvailableDate());
        } else if (step === 2) {
            setSelectedItem(null);
        } else if (step === 3) {
            setSelectedItemsService([]);
        }
        setStep(prevStep => prevStep - 1);
    };

    const handleSave = async () => {
        if (isSubmitting) return;

        if (isForChild && observacoes.trim() === '') {
            toast({
                title: "Atenção!",
                description: "Por favor, preencha o nome da criança antes de agendar.",
                status: "warning",
                duration: 1500,
                isClosable: true,
            });
            return;
        }

        setIsSubmitting(true);

        if (!selectedItem || !selectedItemService.length) {
            toast({
                title: "Erro",
                description: "Selecione um horário e serviço para agendar.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            setIsSubmitting(false);
            return;
        }

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

        console.log('Payload:', payload);

        try {
            await registerScheduling(payload, token);
            toast({
                title: "Sucesso",
                description: "Agendamento realizado com sucesso.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
            
            redirectToDashboard(); 
            // setStep(0);
            setSelectedCollaboratorId('');
            setSelectedItem(null);
            setSelectedItemsService([]);
            setSelectedDate(getNextAvailableDate());
            setData([]);
            setDataService([]);

        } catch (error) {
            toast({
                title: "Verifique o tempo por serviço!",
                description: error.message || "Não foi possível registrar o agendamento, verifique o tempo por serviço pode haver conflito de horários ou falta disponibilidade!",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Flex direction="column" minH="100vh" align="center" justify="center" bgGradient="linear(180deg, #3D5A73, #182625)" w="100vw" m="0" p="0" overflowX="hidden">
            <TitleSection title="Agendamento" subtitle="Realize seu agendamento em 4 passos">
                <VStack spacing={4}>
                    <Stepper size='sm' colorScheme='green' index={step} gap="0" w="full">
                        {steps.map((stepItem, index) => (
                            <Step key={index}>
                                <StepIndicator
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                >
                                    <StepStatus
                                        complete={<StepIcon />}
                                        incomplete={<StepNumber color="gray.500" />}
                                        active={<StepNumber color="green.500" />}
                                    />
                                </StepIndicator>
                                <Box textAlign="center" mt={2}>
                                    <Text fontSize="9px" fontWeight="bold">{stepItem.title}</Text>
                                    <Text fontSize="8px" color="gray.500">{stepItem.description}</Text>
                                </Box>
                                {index < steps.length - 1 && (
                                    <StepSeparator borderColor="green" _horizontal={{ ml: '0' }} />
                                )}
                            </Step>
                        ))}
                    </Stepper>
                </VStack>
            </TitleSection>

            <Box bg="#fff" p={5} shadow="md" borderWidth="1px" borderRadius="md" w={['100%', '100%', '50%']} maxWidth="960px" marginX="auto" marginTop="2rem" mt="1rem">

                <VStack spacing={4}>
                    {step === 0 && (
                        <Box className="card flex flex-wrap gap-3 p-fluid"
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            w="100%">
                            <Flex wrap="wrap" justifyContent="center">
                                {collaborators.map(col => (
                                    <Card
                                        key={col.colaboradorId}
                                        w="160px"
                                        p={3}
                                        m={1}
                                        textAlign="center"
                                        borderWidth={selectedCollaboratorId === col.colaboradorId ? "2px" : "1px"}
                                        borderColor={selectedCollaboratorId === col.colaboradorId ? "green.500" : "gray.200"}
                                        cursor="pointer"
                                        onClick={() => handleCollaboratorSelect(col.colaboradorId)}
                                        _hover={{ boxShadow: 'md' }}
                                    >
                                        <Image
                                            src={collaboratorImages[col.colaboradorId]}
                                            alt={col.nome}
                                            w="100px"
                                            h="100px"
                                            objectFit="contain"
                                            mx="auto"
                                        />
                                        <Text fontSize="sm" fontWeight="bold" mt={1}>{col.nome}</Text>
                                        <Text mt={2} fontSize="sm">{collaboratorDescriptions[col.colaboradorId]}</Text>
                                    </Card>
                                ))}
                            </Flex>
                            <Box w="100%" mt={4}>
                                <ActionButtons w="full" onSave={handleNextStep} onBack={handlePreviousStep} backLabel="Menu" saveLabel="Avançar" isSaveDisabled={!selectedCollaboratorId} />
                            </Box>
                        </Box>
                    )}

                    {step === 1 && (
                        <Box className="card flex flex-wrap gap-3 p-fluid"
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center">
                            <Calendar
                                id="buttondisplay"
                                value={selectedDate}
                                onChange={handleDateChange}
                                showIcon
                                style={{ fontSize: '20px' }}
                                dateFormat="dd/mm/yy"
                                minDate={new Date()}
                                disabledDays={[0, 1]}
                            />

                            <ChakraProvider>
                                <Box w={{ base: '100%', md: '85%' }} overflow="auto" position="relative">
                                    <DataGridHour data={data} onCheckboxClick={handleCheckboxHourClick} selectedItem={selectedItem} />
                                </Box>
                            </ChakraProvider>
                            <ActionButtons onBack={handlePreviousStep} onSave={handleNextStep} backLabel="Voltar" saveLabel="Avançar" isSaveDisabled={!selectedItem} />
                        </Box>
                    )}

                    {step === 2 && (
                        <Box className="card flex flex-wrap gap-3 p-fluid"
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center">
                            <ChakraProvider>
                                <Box w={{ base: '100%', md: '85%' }} overflow="auto" position="relative">
                                    <DataGridHourService data={dataService} onCheckboxClick={handleCheckboxServiceClick} selectedItemService={selectedItemService} />
                                </Box>
                            </ChakraProvider>
                            <ActionButtons onBack={handlePreviousStep} onSave={handleNextStep} backLabel="Voltar" saveLabel="Avançar" isSaveDisabled={selectedItemService.length === 0} />
                        </Box>
                    )}

                    {step === 3 && (
                        <Box w="100%">
                            <VStack align="start" spacing={4} w="100%">
                                <Box
                                    className="card flex flex-wrap gap-3 p-fluid"
                                    display="flex"
                                    flexDirection="column"
                                    justifyContent="center"
                                    alignItems="center"
                                    w="100%"
                                >
                                    <Text fontSize="lg" fontWeight="bold" color="#172237" textTransform="uppercase" textAlign="center">
                                        Confirmação do Agendamento
                                    </Text>

                                    <Card bg='#CECECECE' p={3}>
                                        <Flex justifyContent="center" w="100%">
                                            <Card w={{ base: '100%', md: '300px' }} minW="300px" bg='#FFFF' p={5} position="relative">
                                                <Badge
                                                    colorScheme="yellow"
                                                    mb={0}
                                                    borderRadius="full"
                                                    px={2}
                                                    py={1}
                                                    fontSize="13px"
                                                    position="absolute"
                                                    top="10px"
                                                    right="10px"
                                                >
                                                    Agendar
                                                </Badge>
                                                <HStack align="center" paddingBottom={1}>
                                                    <i className="pi pi-calendar-clock" style={{ fontSize: '20px', verticalAlign: 'middle', color: 'green' }} />
                                                    <Text fontSize="18px" color="#172237" fontWeight="bold">
                                                        {formatDate(selectedItem?.dataHoraConfigurada)}
                                                    </Text>
                                                </HStack>
                                                <HStack align="center" paddingBottom={1}>
                                                    <i className="pi pi-clock" style={{ fontSize: '20px', verticalAlign: 'middle', color: 'green' }} />
                                                    <Text fontSize="18px" color="#172237" fontWeight="bold">
                                                        {formatTime(selectedItem?.dataHoraConfigurada)}
                                                    </Text>
                                                </HStack>
                                                <HStack align="center">
                                                    <i className="pi pi-user" style={{ fontSize: '20px', verticalAlign: 'middle', color: 'green' }} />
                                                    <Text fontSize="18px" color="#172237" fontWeight="bold">
                                                        {collaborators.find(c => c.colaboradorId === selectedCollaboratorId)?.nome}
                                                    </Text>
                                                </HStack>
                                            </Card>
                                        </Flex>
                                    </Card>

                                    <Card bg='#CECECECE' p={3}>
                                        <Flex justifyContent="center" w="100%">
                                            <Card w={{ base: '100%', md: '300px' }} minW="300px" bg='#FFFF' p={5}>
                                                {selectedItemService.map((serviceId) => {
                                                    const service = dataService.find(s => s.servicoId === serviceId);
                                                    return (
                                                        service && (
                                                            <HStack align="center" key={serviceId} marginBottom={2}>
                                                                <i className="pi pi-tag" style={{ fontSize: '18px', verticalAlign: 'middle', color: 'green' }} />
                                                                <Text fontSize="18px" color="#172237" fontWeight="bold">
                                                                    {service.nome}
                                                                </Text>
                                                            </HStack>
                                                        )
                                                    );
                                                })}
                                            </Card>
                                        </Flex>
                                    </Card>

                                </Box>

                                <VStack spacing={4} w="100%" mt={4}>
                                    <HStack align="center">
                                        <Checkbox
                                            isChecked={isForChild}
                                            onChange={() => setIsForChild(!isForChild)}
                                            colorScheme="green"
                                        >
                                            <Text fontSize="18px" color="#3D5A73" paddingLeft={2} fontWeight="bold">
                                                O atendimento é p/ meu FILHO(a)?
                                            </Text>
                                        </Checkbox>
                                    </HStack>

                                    {isForChild && (
                                        <Box w={{ base: '100%', md: '70%' }} overflow="auto" position="relative">
                                            <Input
                                                placeholder='Digite o nome da Criança'
                                                size='lg'
                                                fontSize="18px"
                                                color="#3D5A73"
                                                fontWeight="bold"
                                                errorBorderColor="red.300"
                                                value={observacoes}
                                                onChange={(e) => setObservacoes(e.target.value)}
                                            />
                                        </Box>
                                    )}
                                </VStack>

                                <Box w="100%" mt={4}>
                                    <ActionButtons
                                        onBack={handlePreviousStep}
                                        onSave={handleSave}
                                        backLabel="Voltar"
                                        saveLabel="Agendar"
                                        isSaveDisabled={isSubmitting}
                                        w="full"
                                    />
                                </Box>
                            </VStack>
                        </Box>
                    )}

                    {isSubmitting && <Spinner mt={4} />}
                </VStack>
            </Box>

            <Box position="fixed" bottom="2rem" right="2rem">
                <Button
                    onClick={onOpen}
                    colorScheme="green"
                    borderRadius="full"
                    p={4}
                    width="56px"
                    height="56px"
                >
                    <FaWhatsapp size={24} />
                </Button>
            </Box>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Redirecionar para o WhatsApp</ModalHeader>
                    <ModalBody>
                        <Card bg='#59FFA7' p={5}>
                            <HStack align="center" paddingBottom={2}>
                                <i className="pi pi-info-circle" style={{ fontSize: '27px', verticalAlign: 'middle', color: '#38a169' }} />
                                <Text paddingLeft={4} fontSize="14px" fontWeight="bold" color="#38a169">
                                    Se precisar de um horário que não esteja disponível, entre em contato com nosso suporte pelo WhatsApp.
                                </Text>
                            </HStack>
                        </Card>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="green" mr={3} onClick={() => window.open(whatsappLink, '_blank')}>
                            Sim
                        </Button>
                        <Button colorScheme="red" onClick={onClose}>Cancelar</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Flex>
    );
};

export default NovoAgendamento;

import { useState, useEffect } from "react";
import { Calendar } from 'primereact/calendar';
import usePrimeReactLocale from '../hooks/usePrimeReactLocale';
import { ScrollTop } from 'primereact/scrolltop';
import { ChakraProvider, Box, VStack, useToast, Text, Image, Card, Button, Flex, Spinner, Input, Stepper, Step, StepIndicator, StepTitle, StepDescription, StepStatus, StepIcon, StepNumber, StepSeparator, useBreakpointValue } from '@chakra-ui/react';
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
import kezukaIMGperfil from '../assets/kezuka.png';
import lucasIMGperfil from '../assets/lucas.png';
import henriqueIMGperfil from '../assets/henrique.png';

const NovoAgendamento = () => {
    const { user, token } = useAuth();
    const toast = useToast();
    const { redirectToDashboard } = useUserRedirect();
    usePrimeReactLocale();

    const [step, setStep] = useState(0);
    const [collaborators, setCollaborators] = useState([]);
    const [selectedCollaboratorId, setSelectedCollaboratorId] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [data, setData] = useState([]);
    const [dataService, setDataService] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedItemService, setSelectedItemsService] = useState([]);
    const [observacoes, setObservacoes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const clienteTelefone = 31994875143;
    const [whatsappLink, setWhatsappLink] = useState('');
    const agendado = 1;

    const steps = [
        { title: 'Atendimento', description: 'Profissional' },
        { title: 'Agendamento', description: 'Data e Hora' },
        { title: 'Serviços', description: 'Serviços' },
        { title: 'Confirmação', description: 'Agendar' }
    ];

    const collaboratorImages = {
        23: kezukaIMGperfil,
        24: henriqueIMGperfil,
        25: lucasIMGperfil
    };

    const collaboratorDescriptions = {
        23: 'Matheus Kezuka é visagista e especialista em cortes infantis. Ele oferece uma variedade de serviços de estética masculina, além de atender a serviços de barbearia tradicional.',
        24: 'Henrique Lucas é barbeiro visagista especializado em cortes contemporâneos e utiliza técnicas de "freestyle" para criar desenhos e cortes diferenciados, além de atender a serviços de barbearia tradicional.',
        25: 'Lucas Vinícius é visagista e especialista em cortes infantis. Ele oferece uma variedade de serviços de estética masculina, além de atender a serviços de barbearia tradicional.'
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
                    setData(response);
                    toast({
                        title: "Há horários para o profissional selecionado",
                        description: response.message || "Caso queira outra data e horário, selecione-o na etapa 2",
                        status: "success",
                        duration: 4000,
                        isClosable: true,
                    });
                })
                .catch(error => {
                    toast({
                        title: "Atenção!",
                        description: error.message || "Não há horários disponíveis para a Data de Hoje para o profissional selecionado, você pode trocar o profissional ou veja na próxima etapa outra data!",
                        status: "info",
                        duration: 4000,
                        isClosable: true,
                    });
                });
        }
    }, [selectedCollaboratorId, selectedDate, token, toast]);

    const handleCollaboratorSelect = (collaboratorId) => {
        setSelectedCollaboratorId(collaboratorId);
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

    const handleNextStep = () => setStep(prevStep => prevStep + 1);

    const handleClose = () => {
        redirectToDashboard();
    };

    const handlePreviousStep = () => {
        if (step === 0) {
            handleClose();
        } else {
            setStep(prevStep => prevStep - 1);
        }
    };

    const stepperDirection = useBreakpointValue({ base: 'vertical', md: 'horizontal' });

    const handleSave = async () => {
        if (isSubmitting) return;

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
        } catch (error) {
            toast({
                title: "Erro ao agendar",
                description: error.message || "Falha ao registrar o agendamento.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Flex direction="column" minH="100vh" align="center" justify="center" bgGradient="linear(180deg, #3D5A73, #182625)" w="100vw" m="0" p="0" overflowX="hidden">
            <TitleSection title="Agendamento" subtitle="Preencha os campos para realizar o agendamento">
                <VStack spacing={4}>
                    <Stepper index={step} orientation={stepperDirection} gap="0" w="full">
                        {steps.map((stepItem, index) => (
                            <Step key={index}>
                                <StepIndicator>
                                    <StepStatus
                                        complete={<StepIcon />}
                                        incomplete={<StepNumber />}
                                        active={<StepNumber />}
                                    />
                                </StepIndicator>
                                <Box textAlign="center" mt={2}>
                                    <StepTitle>{stepItem.title}</StepTitle>
                                    <StepDescription fontSize="sm" color="gray.500">{stepItem.description}</StepDescription>
                                </Box>
                                {index < steps.length - 1 && (
                                    <StepSeparator
                                        borderColor="gray.300"
                                        mt={4} // Move separator to align with the indicator
                                    />
                                )}
                            </Step>
                        ))}
                    </Stepper>
                </VStack>
            </TitleSection>

            <Box bg="#fff" p={5} shadow="md" borderWidth="1px" borderRadius="md" w={['100%', '50%']} maxWidth="960px" marginX="auto" mt="1rem">

                <VStack spacing={4}>
                    {/* Step 1: Seleção do Colaborador */}
                    {step === 0 && (
                        <Box className="card flex flex-wrap gap-3 p-fluid">
                            <Flex wrap="wrap" justifyContent="center">
                                {collaborators.map(col => (
                                    <Card
                                        key={col.colaboradorId}
                                        w="200px"
                                        h="350px"
                                        p={4}
                                        m={2}
                                        textAlign="center"
                                        borderWidth={selectedCollaboratorId === col.colaboradorId ? "2px" : "1px"}
                                        borderColor={selectedCollaboratorId === col.colaboradorId ? "blue.500" : "gray.200"}
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
                                        <Text fontWeight="bold" mt={2}>{col.nome}</Text>
                                        <Text mt={2} fontSize="sm">{collaboratorDescriptions[col.colaboradorId]}</Text>
                                    </Card>
                                ))}
                            </Flex>
                            <ActionButtons onSave={handleNextStep} onBack={handlePreviousStep} backLabel="Menu" saveLabel="Avançar" isSaveDisabled={!selectedCollaboratorId} />
                        </Box>
                    )}

                    {/* Step 2: Seleção de Data e Horário */}
                    {step === 1 && (
                        <Box w="100%">
                            <Calendar id="buttondisplay" value={selectedDate} onChange={(e) => setSelectedDate(e.value)} showIcon style={{ fontSize: '20px' }} dateFormat="dd/mm/yy" minDate={new Date()} />
                            <ChakraProvider>
                                <Box w={{ base: '100%', md: '85%' }} height="200px" overflow="auto" position="relative">
                                    <DataGridHour data={data} onCheckboxClick={handleCheckboxHourClick} selectedItem={selectedItem} />
                                    <ScrollTop target="parent" threshold={100} className="w-2rem h-2rem border-round bg-primary" icon="pi pi-arrow-up text-base" />
                                </Box>
                            </ChakraProvider>
                            <ActionButtons onBack={handlePreviousStep} onSave={handleNextStep} backLabel="Voltar" saveLabel="Avançar" isSaveDisabled={!selectedItem} />
                        </Box>
                    )}

                    {/* Step 3: Seleção de Serviços */}
                    {step === 2 && (
                        <Box w="100%">
                            <ChakraProvider>
                                <Box w={{ base: '100%', md: '85%' }} height="200px" overflow="auto" position="relative">
                                    <DataGridHourService data={dataService} onCheckboxClick={handleCheckboxServiceClick} selectedItemService={selectedItemService} />
                                    <ScrollTop target="parent" threshold={100} className="w-2rem h-2rem border-round bg-primary" icon="pi pi-arrow-up text-base" />
                                </Box>
                            </ChakraProvider>
                            <ActionButtons onBack={handlePreviousStep} onSave={handleNextStep} backLabel="Voltar" saveLabel="Avançar" isSaveDisabled={selectedItemService.length === 0} />
                        </Box>
                    )}

                    {/* Step 4: Confirmação */}
                    {step === 3 && (
                        <Box w="100%">
                            <Text fontSize="lg">Confirmação do agendamento</Text>
                            <Text>Profissional: {collaborators.find(c => c.colaboradorId === selectedCollaboratorId)?.nome}</Text>
                            <Text>Serviço: {dataService.find(s => s.servicoId === selectedItemService[0])?.nome}</Text>
                            <Text>Data: {selectedDate.toLocaleDateString()}</Text>
                            <Text>Hora: {selectedItem?.dataHoraConfigurada}</Text>
                            <Input placeholder='Observações (opcional)' size='lg' fontSize="18px" color="#3D5A73" fontWeight="bold" value={observacoes} onChange={(e) => setObservacoes(e.target.value)} />
                            <ActionButtons onBack={handlePreviousStep} onSave={handleSave} backLabel="Voltar" saveLabel="Agendar" isSaveDisabled={isSubmitting} />
                        </Box>
                    )}

                    {isSubmitting && <Spinner mt={4} />}
                </VStack>
            </Box>

            {/* <Box position="fixed" bottom="2rem" right="2rem">
                <Button as="a" href={whatsappLink} target="_blank" colorScheme="green" leftIcon={<FaWhatsapp />}>
                    Suporte via WhatsApp
                </Button>
            </Box> */}

            <Box position="fixed" bottom="2rem" right="2rem">
                <Button
                    as="a"
                    href={whatsappLink}
                    target="_blank"
                    colorScheme="green"
                    borderRadius="full"
                    p={4}
                    width="56px"
                    height="56px"
                >
                    <FaWhatsapp size={24} />
                </Button>
            </Box>

        </Flex>
    );
};

export default NovoAgendamento;

import { useState, useEffect } from "react";
import { Calendar } from 'primereact/calendar';
import usePrimeReactLocale from '../hooks/usePrimeReactLocale'; 
import { Flex, Box, VStack, HStack, useToast, Select, Table, TableContainer, Thead, Tbody, Tr, Th, Td, IconButton } from '@chakra-ui/react';
import {TimeIcon, Icon, DeleteIcon, AddIcon } from '@chakra-ui/icons';
import TitleSection from '../components/layout/TitleSection';
import { useNavigate } from 'react-router-dom';
import { registerCalendar } from '../services/serviceCalendar';
import { useAuth } from '../contexts/AuthContext';
import { getCollaborators } from '../services/collaboratorService';

const DisponibilidadeCalendario = () => {
    usePrimeReactLocale();
    const { token, user } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();
    const [collaborators, setCollaborators] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedHour, setSelectedHour] = useState(null);
    const [selectedCollaboratorId, setSelectedCollaboratorId] = useState('');
    const [scheduleList, setScheduleList] = useState([]);
    const [referenceDate, setReferenceDate] = useState(null);

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

    const handleAddSchedule = () => {
        if (!selectedCollaboratorId) {
            toast({
                title: "Atenção!",
                description: "Por favor, selecione um colaborador.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        if (!selectedDate || !selectedHour) {
            toast({
                title: "Atenção!",
                description: "Por favor, insira uma data e horário válido.",
                status: "info",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        const newScheduleDate = new Date(selectedDate);
        newScheduleDate.setHours(selectedHour.getHours(), selectedHour.getMinutes(), 0, 0);

        if (!referenceDate) {
            setReferenceDate(newScheduleDate);  // Set reference date if not already set
        } else if (new Date(referenceDate).toDateString() !== newScheduleDate.toDateString()) {
            toast({
                title: "Erro de validação",
                description: "Horário não corresponde à data inicialmente selecionada!",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        if (scheduleList.some(item => new Date(item.dataHoraConfigurada).getTime() === newScheduleDate.getTime())) {
            toast({
                title: "Erro de validação",
                description: "Este horário já foi adicionado à lista!",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        // Adicionar o novo horário à lista
        const formattedDate = newScheduleDate.toISOString().replace(/:\d+\.\d+Z$/, ':00Z');
        const newSchedule = {
            dataHoraConfigurada: formattedDate,
            gestorId: user.id,
            colaboradorId: selectedCollaboratorId
        };
        setScheduleList((prev) => [...prev, newSchedule]);
        setSelectedHour(null);

        toast({
            title: "Horário Adicionado",
            description: "Um novo horário foi adicionado com sucesso a lista.",
            status: "success",
            duration: 2000,
            isClosable: true,
        });
    };

    const handleRemoveSchedule = index => {
        const newScheduleList = scheduleList.filter((_, i) => i !== index);
        setScheduleList(newScheduleList);
    };


    const handleSubmit = async () => {
        try {
            await registerCalendar(scheduleList, token);
            toast({
                title: "Disponibilidade cadastrada",
                description: "Os horários foram cadastrados com sucesso.",
                status: "success",
                duration: 2500,
                isClosable: true,
                onCloseComplete: () => navigate('/dashboard')
            });
        } catch (error) {
            toast({
                title: "Erro ao cadastrar",
                description: error.message || "Não foi possível cadastrar a disponibilidade.",
                status: "error",
                duration: 2000,
                isClosable: true,
            });
        }
    };

    const handleClose = () => {
        navigate('/dashboard');
    };

    return (
        <Flex direction="column" minH="100vh" align="center" justify="center" bgGradient="linear(180deg, #455559, #182625)" w="100vw" m="0" p="0" overflowX="hidden">
            <TitleSection title="Registro de Disponibilidade" subtitle="Formulário para registrar a disponibilidade do colaborador." />
            <Box bg="#fff" p={5} shadow="md" borderWidth="1px" borderRadius="md" w={['100%', '100%', '50%']} maxWidth="960px" marginX="auto" marginTop="2rem" marginBottom="2rem" mt="5rem">
                <VStack spacing={4}>
                    <div className="card flex flex-wrap gap-3 p-fluid">
                        <Select placeholder="Selecione o Colaborador" name="colaboradorId" fontSize="18px" color="#3D5A73" fontWeight="bold" onChange={(e) => setSelectedCollaboratorId(e.target.value)}>
                            {collaborators.map(col => (
                                <option key={col.colaboradorId} value={col.colaboradorId}>{col.nome}</option>
                            ))}
                        </Select>
                        <div className="flex-auto">
                            <Calendar
                            id="buttondisplay"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.value)}
                            showIcon style={{ fontSize: '20px' }}
                            dateFormat="dd/mm/yy"
                            icon={() => <i className="pi pi-calendar" style={{ fontSize: '20px' }} />} />
                        </div>
                        <div className="flex-auto">
                            <Calendar
                            value={selectedHour}
                            onChange={(e) => setSelectedHour(e.value)}
                            showIcon style={{ fontSize: '20px' }} timeOnly
                            icon={() => <i className="pi pi-clock" style={{ fontSize: '20px' }} />} />
                        </div>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <Box
                                as='button'
                                p={3}
                                color='white'
                                fontWeight='bold'
                                borderRadius='md'
                                bgGradient='linear(to-l, green, green)'
                                _hover={{ bg: "#2A542B" }}
                                onClick={handleAddSchedule}
                            >
                                <Icon boxSize="4" alignItems="center" as={AddIcon} />
                                &nbsp;&nbsp;Adicionar
                            </Box>
                        </div>
                    </div>

                    <TableContainer paddingY="7">
                        <Table variant='simple'>
                            <Thead>
                                <Tr>
                                    <Th fontSize="14px" color="#3D5A73" fontWeight="bold" alignItems="left">Data</Th>
                                    <Th fontSize="14px" color="#3D5A73" fontWeight="bold" alignItems="left">Hora</Th>
                                    <Th></Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {scheduleList.map((item, index) => {
                                    const date = new Date(item.dataHoraConfigurada);
                                    return (
                                        <Tr key={index}>
                                            <Td fontSize="18px" color="#3D5A73" fontWeight="bold" alignItems="center">
                                                <Icon as={TimeIcon} color="green" mr="4" boxSize="6" alignItems="center" />
                                                {date.toLocaleDateString()}
                                            </Td>
                                            <Td fontSize="18px" color="#3D5A73" fontWeight="bold" alignItems="center">{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Td>
                                            <Td alignItems="center">
                                                <IconButton size="sm" colorScheme="red" aria-label="Delete schedule" icon={<DeleteIcon />} onClick={() => handleRemoveSchedule(index)} />
                                            </Td>
                                        </Tr>
                                    );
                                })}
                            </Tbody>
                        </Table>
                    </TableContainer>

                    <HStack spacing={4} width="full" justify="center">
                        <Box
                            as='button'
                            onClick={handleClose}
                            p={3}
                            color='white'
                            fontWeight='bold'
                            borderRadius='md'
                            bgGradient='linear(to-l, #3D5A73, #3D5A73)'
                            _hover={{ bg: "#182625" }}
                        >
                            VOLTAR
                        </Box>
                        <Box
                            as='button'
                            p={3}
                            color='white'
                            fontWeight='bold'
                            borderRadius='md'
                            bgGradient='linear(to-l, #244196, #244196)'
                            _hover={{ bg: "#7786D9" }}
                            onClick={handleSubmit}
                            isDisabled={scheduleList.length === 0}
                        >
                            GRAVAR
                        </Box>
                    </HStack>
                </VStack>
            </Box>
        </Flex>
    );
};

export default DisponibilidadeCalendario;
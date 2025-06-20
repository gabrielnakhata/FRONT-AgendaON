import { useState, useEffect } from "react";
import { Calendar } from 'primereact/calendar';
import usePrimeReactLocale from '../hooks/usePrimeReactLocale';
import { Flex, Box, VStack, useToast, Select, Icon, Button, ChakraProvider } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import TitleSection from '../components/common/TitleSection';
import DataGridCalendario from '../components/common/DataGridCalendario';
import { registerCalendar } from '../services/calendarService';
import { useAuth } from '../contexts/AuthContext';
import { getCollaborators } from '../services/collaboratorService';
import ActionButtons from '../components/common/ActionButtons';
import { useUserRedirect } from "../hooks/UseUserRedirect";
import { ScrollTop } from 'primereact/scrolltop';

const ProgramarDisponibilidadeCalendario = () => {
    usePrimeReactLocale();
    const { token, user } = useAuth();
    const toast = useToast();
    const [collaborators, setCollaborators] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedCollaboratorId, setSelectedCollaboratorId] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [startWorkTime, setStartWorkTime] = useState(new Date(selectedDate.setHours(8, 0)));
    const [endWorkTime, setEndWorkTime] = useState(new Date(selectedDate.setHours(19, 30)));
    const [startLunchTime, setStartLunchTime] = useState(new Date(selectedDate.setHours(12, 0)));
    const [endLunchTime, setEndLunchTime] = useState(new Date(selectedDate.setHours(13, 0)));
    const [timeInterval, setTimeInterval] = useState(new Date(selectedDate.setHours(0, 30)));
    const [scheduleList, setScheduleList] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { redirectToDashboard } = useUserRedirect();
    const [containerHeight] = useState('300px');

    useEffect(() => {
        if (user.tipoUsuario !== 'Colaborador') {
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
        }
    }, [token, toast, user.id]);

    const handleRemoveSchedule = calendarioId => {
        const newScheduleList = scheduleList.filter(item => item.calendarioId !== calendarioId);
        setScheduleList(newScheduleList);
    };

    const handleGenerateSchedules = () => {
        if ((user.tipoUsuario !== 'Colaborador' && !selectedCollaboratorId) || !selectedDate || !startWorkTime || !endWorkTime || !startLunchTime || !endLunchTime || !timeInterval) {
            toast({
                title: "Informações Incompletas",
                description: "Por favor, preencha todos os campos necessários.",
                status: "info",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        const intervalMinutes = timeInterval.getHours() * 60 + timeInterval.getMinutes();
        if (intervalMinutes <= 0) {
            toast({
                title: "Intervalo Inválido",
                description: "O intervalo deve ser maior que zero minutos.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        const schedules = [];
        let currentTime = new Date(selectedDate);
        currentTime.setHours(startWorkTime.getHours(), startWorkTime.getMinutes(), 0, 0);
        const endTime = new Date(selectedDate);
        endTime.setHours(endWorkTime.getHours(), endWorkTime.getMinutes(), 0, 0);
        const lunchStartTime = new Date(selectedDate);
        lunchStartTime.setHours(startLunchTime.getHours(), startLunchTime.getMinutes(), 0, 0);
        const lunchEndTime = new Date(selectedDate);
        lunchEndTime.setHours(endLunchTime.getHours(), endLunchTime.getMinutes(), 0, 0);

        while (currentTime < endTime) {
            if (!(currentTime >= lunchStartTime && currentTime < lunchEndTime)) {
                const formattedDateTime = `${currentTime.toLocaleDateString('en-CA')}T${currentTime.toLocaleTimeString('en-GB', { hour12: false })}`;
                const calendarioId = Math.floor(Math.random() * 1000);
                schedules.push({
                    calendarioId: calendarioId,
                    dataHoraConfigurada: formattedDateTime,
                    gestorId: user.tipoUsuario === 'Colaborador' ? null : user.id,
                    colaboradorId: user.tipoUsuario === 'Colaborador' ? user.id : parseInt(selectedCollaboratorId, 10)
                });
            }
            currentTime = new Date(currentTime.getTime() + intervalMinutes * 60000);
        }

        setScheduleList(schedules);

        setIsAdding(true);
        toast({
            title: "Horários Programados",
            description: "Os horários foram gerados com sucesso!",
            status: "info",
            duration: 3000,
            isClosable: true,
            onCloseComplete: () => setIsAdding(false)
        });
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            await registerCalendar(scheduleList, token);
            toast({
                title: "Horários cadastrados",
                description: "Os horários foram cadastrados com sucesso.",
                status: "success",
                duration: 2500,
                isClosable: true,
                // onCloseComplete: () => { redirectToDashboard(); }
            });
        } catch (error) {
            toast({
                title: "Erro ao cadastrar",
                description: error.message || "Não foi possível cadastrar a disponibilidade.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        redirectToDashboard();
    };

    const formatTime = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 3) {
            value = value.slice(0, 2) + ':' + value.slice(2, 4);
        }
        e.target.value = value;
    };

    return (
        <Flex direction="column" minH="100vh" align="center" justify="center" bgGradient="linear(180deg, #3D5A73, #182625)" w="100vw" m="0" p="0" overflowX="hidden">
            <TitleSection title="Disponibilidade" subtitle="Programar disponibilidade, horários do dia" />
            <Box bg="#fff" p={5} shadow="md" borderWidth="1px" borderRadius="md" w={['100%', '100%', '50%']} maxWidth="960px" marginX="auto" marginTop="2rem" marginBottom="2rem" mt="1rem">
                <VStack spacing={4}>
                    <div className="card flex flex-wrap gap-3 p-fluid">
                        {user.tipoUsuario !== 'Colaborador' && (
                            <Select placeholder="Selecione o Colaborador" name="colaboradorId" fontSize="18px" color="#3D5A73" fontWeight="bold" onChange={(e) => setSelectedCollaboratorId(parseInt(e.target.value, 10))}>
                                {collaborators.map(col => (
                                    <option key={col.colaboradorId} value={col.colaboradorId}>{col.nome}</option>
                                ))}
                            </Select>
                         )}
                        <div className="flex-auto">
                            <Calendar
                                id="buttondisplay"
                                value={selectedDate}
                                placeholder="Data da Disponibilidade"
                                onChange={(e) => setSelectedDate(e.value)}
                                showIcon style={{ fontSize: '20px' }}
                                dateFormat="dd/mm/yy"
                                icon={() => <i className="pi pi-calendar" style={{ fontSize: '20px' }} />} />
                        </div>
                        <div className="flex-auto">
                            <Calendar
                                value={timeInterval}
                                placeholder="Intervalo entre horários"
                                onInput={formatTime}
                                onChange={(e) => setTimeInterval(e.value)}
                                inputMode="numeric"
                                showIcon style={{ fontSize: '20px', touchAction: 'manipulation' }} timeOnly
                                icon={() => <i className="pi pi-clock" style={{ fontSize: '20px' }} />} />
                        </div>
                        <div className="flex-auto">
                            <Calendar
                                value={startWorkTime}
                                placeholder="Início Expediente"
                                onInput={formatTime}
                                onChange={(e) => setStartWorkTime(e.value)}
                                inputMode="numeric"
                                showIcon style={{ fontSize: '20px', touchAction: 'manipulation' }} timeOnly
                                icon={() => <i className="pi pi-clock" style={{ fontSize: '20px' }} />} />
                        </div>
                        <div className="flex-auto">
                            <Calendar
                                value={endWorkTime}
                                placeholder="Fim Expediente"
                                inputMode="numeric"
                                onInput={formatTime}
                                onChange={(e) => setEndWorkTime(e.value)}
                                showIcon style={{ fontSize: '20px', touchAction: 'manipulation' }} timeOnly
                                icon={() => <i className="pi pi-clock" style={{ fontSize: '20px' }} />} />
                        </div>
                        <div className="flex-auto">
                            <Calendar
                                value={startLunchTime}
                                placeholder="Início Almoço"
                                inputMode="numeric"
                                onInput={formatTime}
                                onChange={(e) => setStartLunchTime(e.value)}
                                showIcon style={{ fontSize: '20px', touchAction: 'manipulation' }} timeOnly
                                icon={() => <i className="pi pi-clock" style={{ fontSize: '20px' }} />} />
                        </div>
                        <div className="flex-auto">
                            <Calendar
                                value={endLunchTime}
                                placeholder="Fim Almoço"
                                onInput={formatTime}
                                onChange={(e) => setEndLunchTime(e.value)}
                                inputMode="numeric"
                                showIcon style={{ fontSize: '20px', touchAction: 'manipulation' }} timeOnly
                                icon={() => <i className="pi pi-clock" style={{ fontSize: '20px' }} />} />
                        </div>
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <Button
                                px={4} py={2}
                                color='white'
                                fontWeight='bold'
                                borderRadius='md'
                                bgGradient='linear(to-l, green, green)'
                                _hover={{ bg: "#2A542B" }}
                                onClick={handleGenerateSchedules}
                                isLoading={isAdding}
                                loadingText="Adicionando"
                                spinnerPlacement="end"
                            >
                                <Icon boxSize="4" alignItems="center" as={AddIcon} />
                                &nbsp;&nbsp;Adicionar
                            </Button>
                        </div>
                    </div>
                    <ChakraProvider>
                        <Box w={{ base: '100%', md: '70%' }} height={containerHeight} overflow="auto" position="relative">
                            <DataGridCalendario data={scheduleList} onDelete={handleRemoveSchedule} />
                            <ScrollTop target="parent" threshold={100} className="w-2rem h-2rem border-round bg-primary" icon="pi pi-arrow-up text-base" />
                        </Box>
                    </ChakraProvider>
                    <ActionButtons onBack={handleClose} onSave={handleSubmit} isSaveDisabled={scheduleList.length === 0 || isSubmitting} />
                </VStack>
            </Box>
        </Flex>
    );
};

export default ProgramarDisponibilidadeCalendario;
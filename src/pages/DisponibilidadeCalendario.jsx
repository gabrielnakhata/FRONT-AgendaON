import { Calendar } from 'primereact/calendar';
// import 'primereact/resources/themes/saga-blue/theme.css';
// import 'primereact/resources/primereact.min.css';
// import 'primeicons/primeicons.css';

import { useState } from "react";
import { Flex, Box, VStack, HStack, Button, useToast } from '@chakra-ui/react';
import TitleSection from '../components/layout/TitleSection';
import { useNavigate } from 'react-router-dom';
import { registerCalendar } from '../services/serviceCalendar';
import { useAuth } from '../contexts/AuthContext';

const DisponibilidadeCalendario = () => {
    const { token } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedHour, setSelectedHour] = useState(null);
    const [scheduleList, setScheduleList] = useState([]);

    const handleAddSchedule = () => {
        if (selectedHour) {
            const newSchedule = new Date(`${selectedDate.toDateString()} ${selectedHour.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
            setScheduleList((prev) => [...prev, newSchedule]);
            setSelectedHour(null);
        } else {
            toast({
                title: "Erro de validação",
                description: "Por favor, insira um horário válido.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleClose = () => {
        navigate('/dashboard');
    };

    const handleSubmit = async () => {
        // Formate os horários na estrutura JSON esperada
        const scheduleData = scheduleList.map((date) => ({
            dataHoraConfigurada: date.toISOString(),
            gestorId: 1, // Substituir pelo ID do gestor autenticado
            colaboradorId: 0, // Ajustar conforme necessário
        }));

        try {
            await registerCalendar(scheduleData, token);
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

    return (
        <Flex direction="column" minH="100vh" align="center" justify="center" bgGradient="linear(180deg, #455559, #182625)" w="100vw" m="0" p="0" overflowX="hidden">
            <TitleSection title="Registro de Disponibilidade" subtitle="Formulário para registrar a disponibilidade do colaborador." />
            <Box bg="#fff" p={5} shadow="md" borderWidth="1px" borderRadius="md" w={['100%', '100%', '50%']} maxWidth="960px" marginX="auto" marginTop="2rem" marginBottom="2rem" mt="5rem">
                <VStack spacing={4}>
                    {/* Calendário para selecionar a data */}
                    <Calendar id="buttondisplay" value={selectedDate} onChange={(e) => setSelectedDate(e.value)} showIcon />
                    
                    {/* Calendário apenas para o horário */}
                    
                    <Calendar value={selectedHour} onChange={(e) => setSelectedHour(e.value)} showIcon timeOnly icon={() => <i className="pi pi-clock" />} />
                    
                    {/* Botão para adicionar horário */}
                    <Button colorScheme="blue" onClick={handleAddSchedule}>
                        Adicionar Horário
                    </Button>

                    {/* Lista de horários adicionados */}
                    <Box>
                        {scheduleList.length > 0 ? (
                            <ul>
                                {scheduleList.map((item, index) => (
                                    <li key={index}>{`${item.toLocaleDateString()} ${item.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>Nenhum horário adicionado.</p>
                        )}
                    </Box>
                    
                    {/* Botões de voltar e gravar */}
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
import { Box, Badge, Flex, Text, HStack, Card } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useUserRedirect } from '../../hooks/UseUserRedirect';
import { useAuth } from '../../contexts/AuthContext';

const DataGridScheduling = ({ data, onRowClick }) => {
    const { canEditOrDelete } = useUserRedirect();
    const isEditable = canEditOrDelete();
    const { user } = useAuth();

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

    const sortedData = [...data].sort((a, b) => {
        const dateA = new Date(a.dataHoraAgendamento);
        const dateB = new Date(b.dataHoraAgendamento);
        return dateA - dateB;
    });

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

    return (
        <Flex paddingTop={2} paddingBottom={2} wrap="wrap" gap="2" justifyContent="center" background="#CECECECE">
            {sortedData.map(item => (
                <Card
                    key={item.agendamentoId}
                    p={4}
                    shadow="md"
                    borderWidth="0px"
                    borderRadius="md"
                    cursor="pointer"
                    onClick={() => onRowClick(item)}
                    position="relative"
                    w="270px"
                >
                    <Badge
                        colorScheme={getStatusColor(item.statusDescricao)}
                        borderRadius="full"
                        px={3}
                        py={1}
                        fontSize="12px"
                        position="absolute"
                        top={2}
                        right={2}
                    >
                        {item.statusDescricao}
                    </Badge>
                    <Flex justifyContent="space-between" alignItems="center">
                        <Box paddingRight={4}>
                            <HStack align="center" paddingBottom={1}>
                                <i className="pi pi-calendar-clock" style={{ fontSize: '20px', verticalAlign: 'middle', color: 'green' }} />
                                <Text fontSize="18px" color="#3D5A73" fontWeight="bold">
                                    {formatDate(item.dataHoraAgendamento)}
                                </Text>
                            </HStack>
                            <HStack align="center" paddingBottom={1}>
                                <i className="pi pi-clock" style={{ fontSize: '20px', verticalAlign: 'middle', color: 'green' }} />
                                <Text fontSize="18px" color="#3D5A73" fontWeight="bold">
                                    {formatTime(item.dataHoraAgendamento)}
                                </Text>
                            </HStack>
                            <HStack align="center" paddingBottom={1}>
                                <i className="pi pi-user" style={{ fontSize: '20px', verticalAlign: 'middle', color: 'green' }} />
                                <Text fontSize="14px" color="#3D5A73" fontWeight="bold">
                                    {user.tipoUsuario === 'Cliente' ? item.colaboradorNome : item.clienteNome}
                                </Text>
                            </HStack>
                        </Box>
                    </Flex>
                </Card>
            ))}
        </Flex>
    );
};

DataGridScheduling.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            agendamentoId: PropTypes.number.isRequired,
            colaboradorNome: PropTypes.string.isRequired,
            colaboradorId: PropTypes.number.isRequired,
            clienteNome: PropTypes.string.isRequired,
            clienteId: PropTypes.number.isRequired,
            calendarioId: PropTypes.number.isRequired,
            statusDescricao: PropTypes.string.isRequired,
            observacoes: PropTypes.string.isRequired,
            dataHoraAgendamento: PropTypes.string.isRequired,
        })
    ).isRequired,
    onRowClick: PropTypes.func.isRequired,
};

export default DataGridScheduling;

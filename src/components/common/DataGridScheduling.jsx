import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Badge, Flex } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Icon, TimeIcon } from '@chakra-ui/icons';
import { useUserRedirect } from '../../hooks/UseUserRedirect';
import AgendamentoModal from '../../components/layout/AgendamentoModal';

const DataGridScheduling = ({ data }) => {
    const { canEditOrDelete } = useUserRedirect();
    const isEditable = canEditOrDelete();
    const [selectedData, setSelectedData] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);

    const handleRowClick = (item) => {
        setSelectedData(item);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedData(null);
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

    return (
        <>
            <TableContainer>
                <Table size='md'>
                    <Thead>
                        <Tr align="center">
                            <Th fontSize="14px" color="#3D5A73" fontWeight="bold" alignItems="left">
                                <i className="pi pi-calendar-clock" style={{ fontSize: '20px', verticalAlign: 'middle', color: 'green' }} />
                                &nbsp; Data
                            </Th>
                            <Th fontSize="14px" color="#3D5A73" fontWeight="bold" alignItems="left">
                                <i className="pi pi-clock" style={{ fontSize: '20px', verticalAlign: 'middle', color: 'green' }} />
                                &nbsp;Hora</Th>
                            <Th fontSize="14px" color="#3D5A73" fontWeight="bold" alignItems="left">
                                <i className="pi pi-user" style={{ fontSize: '20px', verticalAlign: 'middle', color: 'green' }} />
                                &nbsp;Colaborador
                            </Th>
                            <Th fontSize="14px" color="#3D5A73" fontWeight="bold" alignItems="left">
                                <i className="pi pi-tag" style={{ fontSize: '20px', verticalAlign: 'middle', color: 'green' }} />
                                &nbsp;&nbsp;Status
                            </Th>
                            {isEditable && <Th><i className="pi pi-file-edit" style={{ fontSize: '20px', verticalAlign: 'middle', color: 'green' }} /></Th>}
                            {isEditable && <Th><i className="pi pi-trash" style={{ fontSize: '20px', verticalAlign: 'middle', color: 'red' }} /></Th>}
                        </Tr>
                    </Thead>
                    <Tbody>
                        {data.map(item => (
                            <Tr key={item.agendamentoId} onClick={() => handleRowClick(item)} _hover={{ backgroundColor: "#f0f0f0", cursor: "pointer" }} >
                                <Td fontSize="18px" color="#3D5A73" fontWeight="bold" alignItems="center">
                                    <Flex align="center">
                                        <Icon as={TimeIcon} color="green" mr="4" boxSize="6" alignItems="center" />
                                        {formatDate(item.dataHoraAgendamento)}
                                    </Flex>
                                </Td>
                                <Td fontSize="18px" color="#3D5A73" fontWeight="bold" alignItems="center">
                                    {formatTime(item.dataHoraAgendamento)}
                                </Td>
                                <Td fontSize="18px" color="#3D5A73" fontWeight="bold" alignItems="center">
                                    &nbsp; &nbsp;&nbsp;{item.colaboradorNome}
                                </Td>
                                <Td fontSize="16px" color="#3D5A73" fontWeight="bold" alignItems="center">
                                    <Badge colorScheme="green" mb={0} borderRadius="full" px={2} py={1} fontSize="0.8em">
                                        {item.statusDescricao}
                                    </Badge>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
            <AgendamentoModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                data={selectedData}
            />
        </>
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
    
};

export default DataGridScheduling;

import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, IconButton } from '@chakra-ui/react';
import { DeleteIcon, RepeatIcon } from '@chakra-ui/icons';
import PropTypes from 'prop-types';
import { useUserRedirect } from '../../hooks/UseUserRedirect';

const DataGridCommission = ({ data, onUpdate, onDelete }) => {
    const { canEditOrDelete } = useUserRedirect();
    const isEditable = canEditOrDelete();

    return (
        <TableContainer>
            <Table size='md'>
                <Thead>
                    <Tr>
                        <Th fontSize="14px" color="#3D5A73" fontWeight="bold" alignItems="left">
                            <i className="pi pi-user" style={{ fontSize: '20px', verticalAlign: 'middle', color: 'green' }} />
                            &nbsp;&nbsp;&nbsp;Colaborador</Th>
                        <Th fontSize="14px" color="#3D5A73" fontWeight="bold" alignItems="left">
                            <i className="pi pi-clipboard" style={{ fontSize: '20px', verticalAlign: 'middle', color: 'green' }} />
                            &nbsp;Serviço</Th>
                        <Th fontSize="14px" color="#3D5A73" fontWeight="bold" alignItems="left">Percentual</Th>
                        {isEditable && <Th fontSize="14px" color="#3D5A73" fontWeight="bold" alignItems="left">Atualizar</Th>}
                        {isEditable && <Th fontSize="14px" color="#3D5A73" fontWeight="bold" alignItems="left">Excluir</Th>}
                    </Tr>
                </Thead>
                <Tbody>
                    {data.map(item => (
                        <Tr key={item.comissaoId}>
                            <Td fontSize="16px" color="#3D5A73" fontWeight="bold" alignItems="center">
                                {item.nomeColaborador}
                            </Td>
                            <Td fontSize="16px" color="#3D5A73" fontWeight="bold" alignItems="center">{item.nomeServico}</Td>
                            <Td fontSize="20px" color="green" fontWeight="bold" alignItems="center">
                                {`${item.percentual}`} &nbsp;
                                <i className="pi pi-percentage" style={{ fontSize: '12px', verticalAlign: 'middle', color: 'green' }} />
                            </Td>
                            {isEditable && (
                                <Td>
                                    <IconButton
                                        aria-label="Delete schedule"
                                        icon={<RepeatIcon />}
                                        size="sm"
                                        colorScheme="blue"
                                        onClick={() => onUpdate(item)}
                                    />
                                </Td>
                            )}
                            {isEditable && (
                                <Td>
                                    <IconButton
                                        aria-label="Delete schedule"
                                        icon={<DeleteIcon />}
                                        size="sm"
                                        colorScheme="red"
                                        onClick={() => onDelete(item.comissaoId)}
                                    />
                                </Td>
                            )}
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </TableContainer>
    );
};

DataGridCommission.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            comissaoId: PropTypes.number.isRequired,
            nomeColaborador: PropTypes.string.isRequired,
            nomeServico: PropTypes.string.isRequired,
            percentual: PropTypes.string.isRequired,
        })
    ).isRequired,
    onUpdate: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default DataGridCommission;

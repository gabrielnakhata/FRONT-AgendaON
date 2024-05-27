import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Button } from '@chakra-ui/react';
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
                        <Th>Colaborador</Th>
                        <Th>Serviço</Th>
                        <Th>Percentual</Th>
                        {isEditable && <Th>Atualizar</Th>}
                        {isEditable && <Th>Excluir</Th>}
                    </Tr>
                </Thead>
                <Tbody>
                    {data.map(item => (
                        <Tr key={item.comissaoId}>
                            <Td>{item.nomeColaborador}</Td>
                            <Td>{item.nomeServico}</Td>
                            <Td>{`${item.percentual}%`}</Td>
                            {isEditable && (
                                <Td>
                                    <Button onClick={() => onUpdate(item)} colorScheme="blue">Atualizar</Button>
                                </Td>
                            )}
                            {isEditable && (
                                <Td>
                                    <Button onClick={() => onDelete(item.comissaoId)} colorScheme="red">Excluir</Button>
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

import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Button } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { useUserRedirect } from '../../hooks/UseUserRedirect'

const DataGridService = ({ data, onUpdate, onDelete }) => {
    const { canEditOrDelete } = useUserRedirect();
    const isEditable = canEditOrDelete();

    const formatCurrency = (value) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    return (
        <TableContainer>
            <Table size='md'>
                <Thead>
                    <Tr>
                        <Th>Nome</Th>
                        <Th>Valor</Th>
                        {isEditable && <Th>Atualizar</Th>}
                        {isEditable && <Th>Excluir</Th>}
                    </Tr>
                </Thead>
                <Tbody>
                    {data.map(item => (
                        <Tr key={item.servicoId}>
                            <Td>{item.nome}</Td>
                            <Td>{formatCurrency(parseFloat(item.valor))}</Td>
                            {isEditable && (
                                <Td>
                                    <Button onClick={() => onUpdate(item)} colorScheme="blue">Atualizar</Button>
                                </Td>
                            )}
                            {isEditable && (
                                <Td>
                                    <Button onClick={() => onDelete(item.servicoId)} colorScheme="red">Excluir</Button>
                                </Td>
                            )}
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </TableContainer>
    );
};

DataGridService.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            servicoId: PropTypes.number.isRequired,
            nome: PropTypes.string.isRequired,
            valor: PropTypes.string.isRequired,
        })
    ).isRequired,
    onUpdate: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default DataGridService;

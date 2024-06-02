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
                        <Th fontSize="14px" color="#3D5A73" fontWeight="bold" alignItems="left">Descrição</Th>
                        <Th fontSize="14px" color="#3D5A73" fontWeight="bold" alignItems="left">Valor</Th>
                        {isEditable && <Th fontSize="14px" color="#3D5A73" fontWeight="bold" alignItems="left">Atualizar</Th>}
                        {isEditable && <Th fontSize="14px" color="#3D5A73" fontWeight="bold" alignItems="left">Excluir</Th>}
                    </Tr>
                </Thead>
                <Tbody>
                    {data.map(item => (
                        <Tr key={item.servicoId}>
                            <Td fontSize="18px" color="#3D5A73" fontWeight="bold" alignItems="center">
                                <i className="pi pi-clipboard" style={{ fontSize: '25px', verticalAlign: 'middle', color: 'green' }} />
                                &nbsp; &nbsp;&nbsp;{item.nome}</Td>
                            <Td fontSize="18px" color="green" fontWeight="bold" alignItems="center">
                                {formatCurrency(parseFloat(item.valor))}</Td>
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

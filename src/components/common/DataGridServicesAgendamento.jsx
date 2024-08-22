import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react';
import PropTypes from 'prop-types';

const DataGridServicesAgendamentos = ({ data }) => {

    const formatCurrency = (value) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const sortedData = data.sort((a, b) => a.nome.localeCompare(b.nome));

    return (
        <TableContainer>
            <Table size='md'>
                <Thead>
                    <Tr>
                        <Th fontSize="14px" color="#3D5A73" fontWeight="bold" alignItems="left">
                            <i className="pi pi-tag" style={{ fontSize: '20px', verticalAlign: 'middle', color: 'green' }} />
                            &nbsp;&nbsp;Descrição do Serviço
                        </Th>
                        <Th fontSize="14px" color="#3D5A73" fontWeight="bold" alignItems="left">
                            <i className="pi pi-money-bill" style={{ fontSize: '20px', verticalAlign: 'middle', color: 'green' }} />
                            &nbsp;&nbsp;Valor
                        </Th>
                     
                    </Tr>
                </Thead>
                <Tbody>
                    {sortedData.map(item => (
                        <Tr key={item.servicoId}>
                            <Td fontSize="18px" color="#3D5A73" fontWeight="bold" alignItems="center">
                                <i className="pi pi-clipboard" style={{ fontSize: '25px', verticalAlign: 'middle', color: 'green' }} />
                                &nbsp; &nbsp;&nbsp;{item.nome}
                            </Td>
                            <Td fontSize="18px" color="green" fontWeight="bold" alignItems="center">
                                {formatCurrency(parseFloat(item.valor))}
                            </Td>
                            
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </TableContainer>
    );
};

DataGridServicesAgendamentos.propTypes = {
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

export default DataGridServicesAgendamentos;

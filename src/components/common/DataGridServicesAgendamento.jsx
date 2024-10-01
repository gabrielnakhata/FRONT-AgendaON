import { Box, Flex, Text, HStack, Card } from '@chakra-ui/react';
import PropTypes from 'prop-types';

const DataGridServicesAgendamentos = ({ data }) => {

    const formatCurrency = (value) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const sortedData = data.sort((a, b) => a.nome.localeCompare(b.nome));

    return (
        <Flex paddingTop={2} paddingBottom={2} wrap="wrap" gap="2" justifyContent="center" background="#CECECECE">
            {sortedData.map(item => (
                <Card key={item.servicoId} p={4} shadow="md" borderWidth="0px" borderRadius="md" cursor="pointer">
                    <Box paddingRight={4}>
                        <HStack align="center" paddingBottom={1}>
                            <i className="pi pi-tag" style={{ fontSize: '12px', verticalAlign: 'middle', color: 'green' }} />
                            <Text fontSize="10px" color="#3D5A73" fontWeight="bold">
                                {item.nome}
                            </Text>
                        </HStack>
                        <HStack>
                            <i className="pi pi-money-bill" style={{ fontSize: '12px', verticalAlign: 'middle', color: 'green' }} />
                            <Text fontSize="10px" color="#3D5A73" fontWeight="bold">
                                {formatCurrency(parseFloat(item.valor))}
                            </Text>
                        </HStack>
                    </Box>
                </Card>
            ))}
        </Flex>
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
};

export default DataGridServicesAgendamentos;


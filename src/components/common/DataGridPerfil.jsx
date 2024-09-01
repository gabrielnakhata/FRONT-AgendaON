import { Box, VStack, Text, IconButton, Divider, Flex } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import { EditIcon } from '@chakra-ui/icons';

const DataGridPerfil = ({ data, onUpdate }) => {
    if (!data) {
        return null; // ou você pode renderizar um estado de carregamento ou uma mensagem de "sem dados"
    }

    return (
        <Flex justifyContent="center" alignItems="center" bg="#f7f7f7" pt={5}>
            <Box p={5} borderWidth="1px" borderRadius="md" bg="#fff" shadow="md" w={['90%', '70%', '50%', '40%']}>
                <VStack align="start" spacing={3}>
                    <Box>
                        <Text fontWeight="bold" color="#3D5A73">Nome:</Text>
                        <Text>{data.nome}</Text>
                    </Box>
                    <Divider />
                    <Box>
                        <Text fontWeight="bold" color="#3D5A73">Celular:</Text>
                        <Text>{data.celular}</Text>
                    </Box>
                    <Divider />
                    <Box>
                        <Text fontWeight="bold" color="#3D5A73">Email:</Text>
                        <Text>{data.email}</Text>
                    </Box>
                    <Divider />
                    <Box>
                        <Text fontWeight="bold" color="#3D5A73">Aniversário:</Text>
                        <Text>{new Date(data.dataNascimento).toLocaleDateString()}</Text>
                    </Box>
                    <Divider />
                    <Box>
                        <Text fontWeight="bold" color="#3D5A73">Cadastro:</Text>
                        <Text>{new Date(data.dataCadastro).toLocaleDateString()} {new Date(data.dataCadastro).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                    </Box>
                    <Divider />
                    <Box w="100%" display="flex" justifyContent="center">
                        <IconButton
                            aria-label="Edit client"
                            icon={<EditIcon />}
                            size="sm"
                            colorScheme="blue"
                            onClick={() => onUpdate(data)}
                        />
                    </Box>
                </VStack>
            </Box>
        </Flex>
    );
};

DataGridPerfil.propTypes = {
    data: PropTypes.shape({
        clienteId: PropTypes.number.isRequired,
        nome: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        senha: PropTypes.string.isRequired,
        celular: PropTypes.string.isRequired,
        dataNascimento: PropTypes.instanceOf(Date).isRequired,
        dataCadastro: PropTypes.instanceOf(Date).isRequired,
    }).isRequired,
    onUpdate: PropTypes.func.isRequired,
};

export default DataGridPerfil;

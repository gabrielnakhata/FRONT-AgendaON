import { useState } from 'react';
import {
    Flex, Box, Button, FormControl, FormLabel, Input, VStack, useToast
} from '@chakra-ui/react';

const CadastroClientes = () => {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        celular: '',
        dataNascimento: '',
    });
    const toast = useToast();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Simula uma requisição POST para um endpoint de cadastro
        console.log({
            ...formData,
            dataCadastro: new Date().toISOString(),
        });
        // Aqui você irá conectar com o serviço para enviar os dados
        // Exemplo: await postCliente(formData);

        // Resetar Formulário
        setFormData({
            nome: '',
            email: '',
            senha: '',
            celular: '',
            dataNascimento: '',
        });

        // Exibir notificação
        toast({
            title: "Cliente cadastrado",
            description: "Os dados do cliente foram cadastrados com sucesso.",
            status: "success",
            duration: 9000,
            isClosable: true,
        });
    };

    return (
        <Flex direction="column" minH="100vh" align="center" justify="center" bgGradient='linear(to-l, #244196, #C02428)' w="100vw" m="0" p="0" overflowX="hidden">
        <Box bg="#fff" p={5} shadow="md" borderWidth="1px" flex="1" borderRadius="md" w={['100%', '100%', '50%']} maxWidth="960px" marginX="auto" marginTop="2rem" marginBottom="2rem" mt="5rem">
            <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                    <FormControl isRequired>
                        <FormLabel htmlFor='nome'>Nome</FormLabel>
                        <Input id='nome' name='nome' placeholder='Nome' value={formData.nome} onChange={handleChange} />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel htmlFor='email'>Email</FormLabel>
                        <Input id='email' name='email' type='email' placeholder='Email' value={formData.email} onChange={handleChange} />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel htmlFor='senha'>Senha</FormLabel>
                        <Input id='senha' name='senha' type='password' placeholder='Senha' value={formData.senha} onChange={handleChange} />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel htmlFor='celular'>Celular</FormLabel>
                        <Input id='celular' name='celular' placeholder='Celular' value={formData.celular} onChange={handleChange} />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel htmlFor='dataNascimento'>Data de Nascimento</FormLabel>
                        <Input id='dataNascimento' name='dataNascimento' type='date' value={formData.dataNascimento} onChange={handleChange} />
                    </FormControl>
                    <Button type='submit' colorScheme='blue' isFullWidth>Cadastrar</Button>
                </VStack>
            </form>
        </Box>
        </Flex>
    );
};

export default CadastroClientes;

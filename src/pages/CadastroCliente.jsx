import { useState } from 'react';
import { HStack, Flex, Box, VStack, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import CustomInput from '../components/layout/CustomInput';
import TitleSection from '../components/layout/TitleSection';
import { registerClient } from '../services/clientService';

const CadastroCliente = () => {

    const navigate = useNavigate();
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

    const handleClose = () => {
        navigate('/');  
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataCadastro = new Date().toISOString();  
            const data = await registerClient({ ...formData, dataCadastro });
            toast({
                title: "Cliente cadastrado",
                description: `Os dados foram cadastrados com sucesso! Bem-vindo(a), ${data.nome || 'cliente'}.`,
                status: "success",
                duration: 9000,
                isClosable: true,
            });
            navigate('/');  
        } catch (error) {
            toast({
                title: "Erro ao cadastrar",
                description: error.message || "Não foi possível cadastrar o cliente.",
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        }
    };

    return (
        <Flex direction="column" minH="100vh" align="center" justify="center" bgGradient="linear(180deg, #7786D9, #244196)" w="100vw" m="0" p="0" overflowX="hidden">
            <TitleSection title="Cadastro de Clientes" subtitle="Olá amigo(a) cliente para obter um login de acesso, gentileza efetuar cadastro." />
            <Box bg="#fff" p={5} shadow="md" borderWidth="1px" borderRadius="md" w={['100%', '100%', '50%']} maxWidth="960px" marginX="auto" marginTop="2rem" marginBottom="2rem" mt="5rem">
                <form onSubmit={handleSubmit}>
                    <VStack spacing={4}>
                        <CustomInput label="Nome" name="nome" placeholder="Digite o nome completo" value={formData.nome} onChange={handleChange} />
                        <CustomInput label="Email" name="email" type="email" placeholder="Este e-mail será utilizado para o login" value={formData.email} onChange={handleChange} />
                        <CustomInput label="Senha" name="senha" type="password" placeholder="Senha" value={formData.senha} onChange={handleChange} />
                        <CustomInput label="Celular" name="celular" placeholder="Celular" value={formData.celular} onChange={handleChange} />
                        <CustomInput label="Data de Nascimento" name="dataNascimento" type="date" placeholder="Data de Nascimento" value={formData.dataNascimento} onChange={handleChange} />
                        <HStack spacing={4} width="full" justify="center">
                            <Box
                                as='button'
                                onClick={handleClose}
                                p={3}
                                color='white'
                                fontWeight='bold'
                                borderRadius='md'
                                bgGradient='linear(to-l, #FA7F08, #F24405)'
                                _hover={{
                                    bg: "#FA7F08",
                                }}
                            >
                                VOLTAR
                            </Box>
                            <Box
                                type='submit'
                                as='button'
                                p={3}
                                color='white'
                                fontWeight='bold'
                                borderRadius='md'
                                bgGradient='linear(to-l, #7786D9, #244196)'
                                _hover={{
                                    bg: "#7786D9",
                                }}
                            >
                                CADASTRAR
                            </Box>
                        </HStack>
                    </VStack>
                </form>
            </Box>
        </Flex>
    );
};

export default CadastroCliente;
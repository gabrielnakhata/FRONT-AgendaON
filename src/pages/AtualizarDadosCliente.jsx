import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Flex, Box, VStack, useToast, InputGroup, InputRightElement, IconButton } from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import CustomInput from '../components/common/CustomInput';
import TitleSection from '../components/common/TitleSection';
import { updateClient } from '../services/clientService';
import { useAuth } from '../contexts/AuthContext';
import ActionButtons from '../components/common/ActionButtons';
import { useUserRedirect } from "../hooks/UseUserRedirect";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{10,11}$/;
const dateOfBirthRegex = /^(19[0-9]{2}|20[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;

const AtualizarDadosCliente = () => {
    const { token } = useAuth();
    const toast = useToast();
    const location = useLocation();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const client = location.state.client;
    const { redirectToDashboard } = useUserRedirect();

    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        celular: '',
        dataNascimento: '',
    });

    const [showPassword, setShowPassword] = useState(false); // Estado para controlar a visibilidade da senha

    useEffect(() => {
        if (client) {
            setFormData({
                clienteId: client.clienteId,
                nome: client.nome,
                email: client.email,
                senha: client.senha,
                celular: client.celular,
                dataNascimento: client.dataNascimento ? new Date(client.dataNascimento).toISOString().split('T')[0] : '',
                dataCadastro: client.dataCadastro ? new Date(client.dataCadastro).toISOString() : ''
            });
        }
    }, [client]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleClose = () => {
        redirectToDashboard();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

        if (!dateOfBirthRegex.test(formData.dataNascimento)) {
            toast({
                title: "Erro de validação",
                description: "Por favor, insira uma data de nascimento válida.",
                status: "error",
                duration: 1000,
                isClosable: true,
                onCloseComplete: () => {
                    setIsSubmitting(false);
                }
            });
            return;
        }
        if (!emailRegex.test(formData.email)) {
            toast({
                title: "Erro de validação",
                description: "Por favor, insira um e-mail válido.",
                status: "error",
                duration: 2000,
                isClosable: true,
                onCloseComplete: () => {
                    setIsSubmitting(false);
                }
            });
            return;
        }
        if (!phoneRegex.test(formData.celular)) {
            toast({
                title: "Erro de validação",
                description: "Por favor, insira um número de celular válido. (10 a 11 dígitos)",
                status: "error",
                duration: 2000,
                isClosable: true,
                onCloseComplete: () => {
                    setIsSubmitting(false);
                }
            });
            return;
        }

        const dataToUpdate = {
            clienteId: formData.clienteId,
            nome: formData.nome,
            email: formData.email,
            senha: formData.senha,
            celular: formData.celular,
            dataNascimento: new Date(formData.dataNascimento).toISOString(),
            dataCadastro: formData.dataCadastro ? new Date(client.dataCadastro).toISOString() : ''
        };

        try {
            const data = await updateClient(formData.clienteId, dataToUpdate, token);
            toast({
                title: "Dados atualizados",
                description: `Os dados foram atualizados com sucesso! ${data.nome || 'cliente'}.`,
                status: "success",
                duration: 2500,
                isClosable: true,
                onCloseComplete: () => navigate('/Profile')
            });
        } catch (error) {
            toast({
                title: "Erro ao cadastrar",
                description: error.message || "Não foi possível atualizar os dados.",
                status: "error",
                duration: 4000,
                isClosable: true,
                onCloseComplete: () => {
                    setIsSubmitting(false);
                }
            });
        }
    };

    return (
        <Flex direction="column" minH="100vh" align="center" justify="center" bgGradient="linear(180deg, #455559, #182625)" w="100vw" m="0" p="0" overflowX="hidden">
            <TitleSection title="Perfil" subtitle="Você pode atualizar dados" />
            <Box bg="#fff" p={5} shadow="md" borderWidth="1px" borderRadius="md" w={['100%', '100%', '50%']} maxWidth="960px" marginX="auto" marginTop="2rem" marginBottom="2rem" mt="1rem">
                <form onSubmit={handleSubmit}>
                    <VStack spacing={4}>
                        <CustomInput label="Nome" name="nome" placeholder="Digite o nome completo" value={formData.nome} onChange={handleChange} />
                        <CustomInput label="Email" name="email" type="email" placeholder="Este e-mail será utilizado para o login" value={formData.email} onChange={handleChange} />

                        <InputGroup>
                            <CustomInput
                                label="Senha"
                                name="senha"
                                type={showPassword ? "text" : "password"}
                                placeholder="Senha"
                                value={formData.senha}
                                onChange={handleChange}
                            />
                            <InputRightElement h="full" d="flex" alignItems="center" width="4.5rem">
                                <IconButton
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                    onClick={() => setShowPassword(!showPassword)}
                                    size="sm"
                                    variant="ghost"
                                />
                            </InputRightElement>
                        </InputGroup>


                        <CustomInput label="Celular" name="celular" placeholder="Celular" value={formData.celular} onChange={handleChange} />
                        <CustomInput label="Data de Nascimento" name="dataNascimento" type="date" placeholder="Data de Nascimento" value={formData.dataNascimento} onChange={handleChange} />
                        <ActionButtons onBack={handleClose} onSave={handleSubmit} isSaveDisabled={null} />
                    </VStack>
                </form>
            </Box>
        </Flex>
    );
};

export default AtualizarDadosCliente;

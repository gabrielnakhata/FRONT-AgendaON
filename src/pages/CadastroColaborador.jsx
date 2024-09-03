import { useState } from 'react';
import { Flex, Box, VStack, useToast, InputGroup, InputRightElement, IconButton } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import CustomInput from '../components/common/CustomInput';
import TitleSection from '../components/common/TitleSection';
import { registerCollaborator } from '../services/collaboratorService';
import moment from 'moment-timezone';
import { useAuth } from '../contexts/AuthContext';
import ActionButtons from '../components/common/ActionButtons'; 
import { useUserRedirect } from "../hooks/UseUserRedirect";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{10,11}$/;
const dateOfBirthRegex = /^(19[0-9]{2}|20[0-9]{2})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
const passwordRegex = /^.{6,}$/;

const CadastroColaborador = () => {
    const { token } = useAuth(); 
    const toast = useToast();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { redirectToDashboard } = useUserRedirect();

    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        celular: '',
        dataNascimento: '',
    });

    const [showPassword, setShowPassword] = useState(false); // Estado para controlar a visibilidade da senha

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

    const formatPhoneNumber = (phone) => {
        return phone.replace(/\D/g, ''); // Remove qualquer caractere que não seja dígito
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (isSubmitting) return;
        setIsSubmitting(true);

        // Formatar número de celular
        const formattedPhone = formatPhoneNumber(formData.celular);

        if (!formData.nome.trim()) {
            toast({
                title: "Erro de validação",
                description: "Por favor, insira um nome válido.",
                status: "info",
                duration: 2000,
                isClosable: true,
                onCloseComplete: () => {
                    setIsSubmitting(false)
                }
            });
            return;
        }

        if (!emailRegex.test(formData.email)) {
            toast({
                title: "Erro de validação",
                description: "Por favor, insira um e-mail válido.",
                status: "info",
                duration: 2000,
                isClosable: true,
                onCloseComplete: () => {
                    setIsSubmitting(false)
                }
            });
            return;
        }

        if (!passwordRegex.test(formData.senha)) {
            toast({
                title: "Erro de validação",
                description: "Por favor, insira uma senha válida. A senha deve ter pelo menos 6 caracteres.",
                status: "info",
                duration: 2000,
                isClosable: true,
                onCloseComplete: () => {
                    setIsSubmitting(false)
                }
            });
            return;
        }

        if (!phoneRegex.test(formattedPhone)) {
            toast({
                title: "Erro de validação",
                description: "Por favor, insira um número de celular válido. (10 a 11 dígitos)",
                status: "info",
                duration: 2000,
                isClosable: true,
                onCloseComplete: () => {
                    setIsSubmitting(false)
                }
            });
            return;
        }

        if (!dateOfBirthRegex.test(formData.dataNascimento)) {
            toast({
                title: "Erro de validação",
                description: "Por favor, insira uma data de nascimento válida.",
                status: "info",
                duration: 2000,
                isClosable: true,
                onCloseComplete: () => {
                    setIsSubmitting(false)
                }
            });
            return;
        }

        try {
            const dataCadastro = moment().tz("America/Sao_Paulo").format();
            const data = await registerCollaborator({ ...formData, celular: formattedPhone, dataCadastro }, token);
            toast({
                title: "Colaborador cadastrado",
                description: `Os dados cadastrados com sucesso! ${data.nome || 'colaborador'}.`,
                status: "success",
                duration: 2500,
                isClosable: true,
                onCloseComplete: () => {
                    navigate('/lista-colaborador')}
            });
        } catch (error) {
            toast({
                title: "Erro ao cadastrar",
                description: error.message || "Não foi possível cadastrar o colaborador.",
                status: "error",
                duration: 4000,
                isClosable: true,
                onCloseComplete: () => {
                    setIsSubmitting(false)
                }
            });
        }
    };

    return (
        <Flex direction="column" minH="100vh" align="center" justify="center" bgGradient="linear(180deg, #455559, #182625)" w="100vw" m="0" p="0" overflowX="hidden">
            <TitleSection title="Colaborador" subtitle="Cadastro de Colaboradores" />
            <Box bg="#fff" p={5} shadow="md" borderWidth="1px" borderRadius="md" w={['100%', '100%', '50%']} maxWidth="960px" marginX="auto" marginTop="2rem" marginBottom="2rem" mt="1rem">
                <form onSubmit={handleSubmit}>
                    <VStack spacing={4}>
                        <CustomInput label="Nome" name="nome" placeholder="Nome completo" value={formData.nome} onChange={handleChange} />
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

export default CadastroColaborador;

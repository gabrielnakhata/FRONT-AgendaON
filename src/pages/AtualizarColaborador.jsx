import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Flex, Box, VStack, useToast, InputGroup, InputRightElement, IconButton, Input } from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import TitleSection from '../components/common/TitleSection';
import { updateCollaborator } from '../services/collaboratorService';
import { useAuth } from '../contexts/AuthContext';
import ActionButtons from '../components/common/ActionButtons';
import { useUserRedirect } from "../hooks/UseUserRedirect";


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{10,11}$/;
const dateOfBirthRegex = /^([0-2]\d|3[01])\/(0\d|1[0-2])\/(19|20)\d{2}$/;

const AtualizarColaborador = () => {

    const { token } = useAuth();
    const toast = useToast();
    const location = useLocation();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const collaborator = location.state.collaborator;
    const { redirectToDashboard } = useUserRedirect();

    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        celular: '',
        dataNascimento: '',
    });

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (collaborator) {
            setFormData({
                colaboradorId: collaborator.colaboradorId,
                nome: collaborator.nome,
                email: collaborator.email,
                senha: collaborator.senha,
                celular: formatPhoneNumber(collaborator.celular),
                dataNascimento: collaborator.dataNascimento ? formatDateForDisplay(collaborator.dataNascimento) : '',
                dataCadastro: collaborator.dataCadastro ? new Date(collaborator.dataCadastro).toISOString() : ''
            });
        }
    }, [collaborator]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const formatPhoneNumber = (phone) => {
        const cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone.length <= 2) return `(${cleanPhone}`;
        if (cleanPhone.length <= 6) return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2)}`;
        if (cleanPhone.length <= 10) return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 6)}-${cleanPhone.slice(6)}`;
        return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 7)}-${cleanPhone.slice(7)}`;
    };


    const formatDateForDisplay = (dateString) => {
        if (!dateString) return '';

        const [datePart] = dateString.split('T');
        const [year, month, day] = datePart.split('-');
        return `${day}/${month}/${year}`;
    };

    const getPlainPhoneNumber = (formattedPhone) => {
        return formattedPhone.replace(/\D/g, '');
    };

    const formatDateForSubmission = (date) => {
        const [day, month, year] = date.split('/');
        return `${year}-${month}-${day}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

        const plainPhone = getPlainPhoneNumber(formData.celular);
        const formattedDate = formatDateForSubmission(formData.dataNascimento);

        if (!dateOfBirthRegex.test(formData.dataNascimento)) {
            toast({
                title: "Erro de validação",
                description: "Por favor, insira uma data de nascimento válida.",
                status: "error",
                duration: 1000,
                isClosable: true,
                onCloseComplete: () => setIsSubmitting(false),
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
                onCloseComplete: () => setIsSubmitting(false),
            });
            return;
        }
        if (!phoneRegex.test(plainPhone)) {
            toast({
                title: "Erro de validação",
                description: "Por favor, insira um número de celular válido. (10 a 11 dígitos)",
                status: "error",
                duration: 2000,
                isClosable: true,
                onCloseComplete: () => setIsSubmitting(false),
            });
            return;
        }

        const dataToUpdate = {
            colaboradorId: formData.colaboradorId,
            nome: formData.nome,
            email: formData.email,
            senha: formData.senha,
            celular: plainPhone,
            dataNascimento: formattedDate,
            dataCadastro: formData.dataCadastro ? new Date(collaborator.dataCadastro).toISOString() : ''
        };

        try {
            const data = await updateCollaborator(formData.colaboradorId, dataToUpdate, token);
            toast({
                title: "Colaborador atualizado",
                description: `Os dados foram atualizados com sucesso! ${data.nome || 'colaborador'}.`,
                status: "success",
                duration: 2500,
                isClosable: true,
                onCloseComplete: () => navigate('/lista-colaborador'),
            });
        } catch (error) {
            toast({
                title: "Erro ao cadastrar",
                description: error.message || "Não foi possível atualizar os dados do colaborador.",
                status: "error",
                duration: 4000,
                isClosable: true,
                onCloseComplete: () => setIsSubmitting(false),
            });
        }
    };

    const handleClose = () => {
        redirectToDashboard();
    };


    return (
        <Flex direction="column" minH="100vh" align="center" justify="center" bgGradient="linear(180deg, #455559, #182625)" w="100vw" m="0" p="0" overflowX="hidden">
            <TitleSection title="Colaborador" subtitle="Atualização do colaborador" />
            <Box bg="#fff" p={5} shadow="md" borderWidth="1px" borderRadius="md" w={['100%', '100%', '50%']} maxWidth="960px" marginX="auto" marginTop="2rem" marginBottom="2rem" mt="1rem">
                <form onSubmit={handleSubmit}>
                    <VStack spacing={4}>
                        <Input
                            placeholder="Digite o nome completo"
                            name="nome"
                            value={formData.nome}
                            onChange={handleChange}
                            isInvalid={!formData.nome.trim()}
                            errorBorderColor="red.300"
                        />
                        <Input
                            placeholder="E-mail"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            isInvalid={!emailRegex.test(formData.email)}
                            errorBorderColor="red.300"
                        />

                        <InputGroup>
                            <Input
                                placeholder="Senha"
                                name="senha"
                                type={showPassword ? "text" : "password"}
                                value={formData.senha}
                                onChange={handleChange}
                                isInvalid={!formData.senha}
                                errorBorderColor="red.300"
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

                        <Input
                            placeholder="Celular | exemplo: (31) 99487-5143"
                            name="celular"
                            value={formData.celular}
                            onChange={(e) =>
                                setFormData(prevState => ({
                                    ...prevState,
                                    celular: formatPhoneNumber(e.target.value)
                                }))
                            }
                            inputMode="numeric"
                            isInvalid={!phoneRegex.test(getPlainPhoneNumber(formData.celular))}
                            errorBorderColor="red.300"
                        />

                        <Input
                            placeholder="Data de Nascimento | exemplo: 21/06/1985"
                            name="dataNascimento"
                            value={formData.dataNascimento}
                            onChange={(e) =>
                                setFormData(prevState => ({
                                    ...prevState,
                                    dataNascimento: e.target.value
                                }))
                            }
                            isInvalid={!dateOfBirthRegex.test(formData.dataNascimento)}
                            errorBorderColor="red.300"
                        />

                        <ActionButtons onBack={handleClose} onSave={handleSubmit} isSaveDisabled={null} />
                    </VStack>
                </form>
            </Box>
        </Flex>
    );
};

export default AtualizarColaborador;
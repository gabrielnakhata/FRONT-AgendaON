import { useState } from 'react';
import { VStack, useToast, InputGroup, InputRightElement, IconButton, Input, Flex, Box } from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import TitleSection from '../components/common/TitleSection';
import { registerClient } from '../services/clientService';
import moment from 'moment-timezone';
import ActionButtons from '../components/common/ActionButtons';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{10,11}$/;
const dateOfBirthRegex = /^([0-2]\d|3[01])\/(0\d|1[0-2])\/(19|20)\d{2}$/;
const passwordRegex = /^.{6,}$/;

const CadastroCliente = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        celular: '',
        dataNascimento: '',
    });

    const [showPassword, setShowPassword] = useState(false);

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

    const formatPhoneNumber = (phone) => {
        const cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone.length <= 2) return cleanPhone;
        if (cleanPhone.length <= 7) return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2)}`;
        if (cleanPhone.length <= 11) return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 7)}-${cleanPhone.slice(7)}`;
        return `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 7)}-${cleanPhone.slice(7, 11)}`;
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

        if (!formData.nome.trim()) {
            toast({
                title: "Erro de validação",
                description: "Por favor, insira um nome válido.",
                status: "info",
                duration: 2000,
                isClosable: true,
                onCloseComplete: () => setIsSubmitting(false),
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
                onCloseComplete: () => setIsSubmitting(false),
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
                onCloseComplete: () => setIsSubmitting(false),
            });
            return;
        }

        if (!phoneRegex.test(plainPhone)) {
            toast({
                title: "Erro de validação",
                description: "Por favor, insira um número de celular válido. (10 a 11 dígitos)",
                status: "info",
                duration: 2000,
                isClosable: true,
                onCloseComplete: () => setIsSubmitting(false),
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
                onCloseComplete: () => setIsSubmitting(false),
            });
            return;
        }

        try {
            const dataCadastro = moment().tz("America/Sao_Paulo").format();
            await registerClient({
                ...formData,
                celular: plainPhone,
                dataNascimento: formattedDate,
                dataCadastro
            });
            toast({
                title: "Cliente cadastrado",
                description: "Os dados foram cadastrados com sucesso!",
                status: "success",
                duration: 2500,
                isClosable: true,
                onCloseComplete: () => navigate('/login-modal'),
            });
        } catch {
            toast({
                title: "Erro ao cadastrar",
                description: "Não foi possível cadastrar o cliente.",
                status: "error",
                duration: 4000,
                isClosable: true,
                onCloseComplete: () => setIsSubmitting(false),
            });
        }
    };

    const formatDate = (e) => {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length > 2) {
            value = value.slice(0, 2) + '/' + value.slice(2);
        }
        if (value.length > 5) {
            value = value.slice(0, 5) + '/' + value.slice(5, 9);
        }

        setFormData(prevState => ({
            ...prevState,
            dataNascimento: value
        }));
    };

    return (
        <Flex direction="column" minH="100vh" align="center" justify="center" bgGradient="linear(180deg, #455559, #182625)" w="100vw" m="0" p="0" overflowX="hidden">
            <TitleSection title="Cadastro de Clientes" subtitle="Por favor, efetue o cadastro." />
            <Box bg="#fff" p={5} shadow="md" borderWidth="1px" borderRadius="md" w={['100%', '50%']} marginTop="2rem">
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
                                isInvalid={!passwordRegex.test(formData.senha)}
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
                            value={formatPhoneNumber(formData.celular)}
                            onChange={(e) =>
                                setFormData(prevState => ({
                                    ...prevState,
                                    celular: e.target.value
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
                            onChange={formatDate}
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

export default CadastroCliente;
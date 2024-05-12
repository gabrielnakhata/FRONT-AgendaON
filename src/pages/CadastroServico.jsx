import { useState } from 'react';
import { Flex, Box, VStack, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import CustomInput from '../components/layout/CustomInput';
import TitleSection from '../components/layout/TitleSection';
import { registerService } from '../services/serviceService';
import { useAuth } from '../contexts/AuthContext';
import ActionButtons from '../components/layout/ActionButtons';

const CadastroServico = () => {
    const { token } = useAuth();
    const toast = useToast();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nome: '',
        valor: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleClose = () => {
        navigate('/dashboard');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.nome.trim()) {
            toast({
                title: "Erro de validação",
                description: "Por favor, insira o nome do serviço.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        const valorCorrigido = formData.valor.replace(',', '.');

        if (!valorCorrigido.trim()) {
            toast({
                title: "Erro de validação",
                description: "Por favor, insira o valor do serviço.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        if (isNaN(Number(valorCorrigido)) || Number(valorCorrigido) <= 0) {
            toast({
                title: "Erro de validação",
                description: "O valor do serviço deve ser um número positivo.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        const formDataCorrigido = { ...formData, valor: valorCorrigido };

        try {
            const data = await registerService(formDataCorrigido, token);
            toast({
                title: "Serviço cadastrado",
                description: `Os dados foram cadastrados com sucesso! ${data.nome || 'serviço'}.`,
                status: "success",
                duration: 2500,
                isClosable: true,
                onCloseComplete: () => navigate('/lista-servico')
            });
        } catch (error) {
            toast({
                title: "Erro ao cadastrar",
                description: error.message || "Não foi possível cadastrar o serviço.",
                status: "error",
                duration: 2000,
                isClosable: true,
            });
        }
    };

    return (
        <Flex direction="column" minH="100vh" align="center" justify="center" bgGradient="linear(180deg, #455559, #182625)" w="100vw" m="0" p="0" overflowX="hidden">
            <TitleSection title="Cadastro de Serviços" subtitle="Formulário de cadastro de serviços." />
            <Box bg="#fff" p={5} shadow="md" borderWidth="1px" borderRadius="md" w={['100%', '100%', '50%']} maxWidth="960px" marginX="auto" marginTop="2rem" marginBottom="2rem" mt="1rem">
                <form onSubmit={handleSubmit}>
                    <VStack spacing={4}>
                        <CustomInput label="Nome" name="nome" placeholder="Digite o nome completo" value={formData.nome} onChange={handleChange} />
                        <CustomInput label="Valor" name="valor" placeholder="Digite o valor do serviço" value={formData.valor} onChange={handleChange} />
                        <ActionButtons onBack={handleClose} onSave={handleSubmit} isSaveDisabled={null} />
                    </VStack>
                </form>
            </Box>
        </Flex>
    );
};

export default CadastroServico;

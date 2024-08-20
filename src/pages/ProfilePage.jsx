
import { Flex, Box, VStack, Text } from '@chakra-ui/react';
import TitleSection from '../components/common/TitleSection';
import { useAuth } from '../contexts/AuthContext';
import MenuCliente from '../components/common/MenuCliente';
import Footer from '../components/common/Footer';

const ProfilePage = () => {
    const { user } = useAuth();

    return (
        <Flex direction="column" minH="100vh" bg="#fff" w="100vw" m="0" p="0" overflow="hidden">
            <MenuCliente />
            <Flex direction="column" align="center" justify="center" bgGradient="linear(180deg, #3C3885, #3CCB95)" w="100vw" m="0" p="0" flex="1" overflow="hidden">
                <TitleSection title="Meu Perfil" subtitle="Para editar os dados do perfil clique em editar" />
                <Box bg="#fff" p={5} shadow="md" borderWidth="1px" borderRadius="md" w={['100%', '100%', '100%']} maxWidth="960px" mx="auto" my="2rem">
                    <VStack spacing={4} align="center" justify="center">
                        <Text fontSize="20PX" fontWeight="bold">Perfil do Usuário</Text>
                        <Text><b>ID:</b> {user.id}</Text>
                        <Text><b>Nome:</b> {user.nome}</Text>
                        <Text><b>Email:</b> {user.email}</Text>
                    </VStack>
                </Box>
            </Flex>
            <Footer />
        </Flex>
    );
};

export default ProfilePage;



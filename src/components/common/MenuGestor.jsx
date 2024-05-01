import {
    Box,
    Button,
    Flex,
    useDisclosure,
    IconButton,
    Drawer,
    DrawerBody,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    VStack,
    Text,
    Avatar,
    HStack,
    useToast,
    Badge
} from '@chakra-ui/react';
import { HamburgerIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const MenuGestor = () => {
    const toast = useToast();
    const { isOpen, onToggle, onClose } = useDisclosure();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        onClose();
        toast({
            title: "Logout realizado",
            description: "Volte sempre, " + (user?.nome || "Usuário") + "!",
            status: "info",
            duration: 3000,
            isClosable: true,
            position: "top"
        });
    };

    return (
        <Box px={10} py={3} boxShadow="md" w="100%" bg="#3D5A73">
            <Flex justify="space-between" align="center" w="100%">
                <HStack spacing={4}>
                    <Avatar name={user?.nome || 'No Name'} src={user?.image || 'https://fallback-url.com/default-avatar.png'} mr={2} />
                    <VStack align="flex-start" spacing={0}>
                        <Text fontSize="md" color="white" fontWeight="bold">{"Olá:"}&nbsp;&nbsp;{user?.nome || 'No Name'}</Text>
                        <Text fontSize="sm" color="white">{user?.email || 'noemail@example.com'}</Text>
                    </VStack>
                </HStack>
                <IconButton
                    icon={<HamburgerIcon />}
                    variant="outline"
                    aria-label="Open Menu"
                    onClick={onToggle}
                    size="lg"
                    color="white"
                />
            </Flex>
            <Drawer
                isOpen={isOpen}
                placement="right"
                onClose={onClose}
                size="xs"
            >
                <DrawerOverlay />
                <DrawerContent bg="#182625">
                    <DrawerCloseButton color="white" />
                    <DrawerBody>
                        <Flex direction="column" paddingTop={20} align="center" mt={4}>
                            <Badge colorScheme="green" mb={4} borderRadius="full" px={2} py={1} fontSize="0.8em">
                                &#9679; Acesso: {user?.tipoUsuario || 'Desconhecido'}
                            </Badge>
                            <Flex direction="column" mt="50px" align="center" w="100%">
                            <RouterLink to="/cadastro-colaborador" style={{ width: '100%', display: 'flex', justifyContent: 'center' }} onClick={onClose}>
                                <Button bg="white" mb={4} w="full">
                                    Cadastro de Colaborador
                                </Button>
                            </RouterLink>
                            <RouterLink to="/lista-colaborador" style={{ width: '100%', display: 'flex', justifyContent: 'center' }} onClick={onClose}>
                                <Button bg="white" mb={4} w="full">
                                    Listar Colaboradores
                                </Button>
                            </RouterLink>
                            <RouterLink to="/cadastro-servico" style={{ width: '100%', display: 'flex', justifyContent: 'center' }} onClick={onClose}>
                                <Button bg="white" mb={4} w="full">
                                    Cadastro de serviço
                                </Button>
                            </RouterLink>
                            <RouterLink to="/" onClick={handleLogout} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                <Button color="white" bg="#3D5A73" _hover={{ bg: "#7786D9" }} w="full" rightIcon={<ArrowBackIcon />} justifyContent="space-between">
                                    Logout
                                </Button>
                            </RouterLink>
                            </Flex>
                        </Flex>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Box>
    );
};

export default MenuGestor;

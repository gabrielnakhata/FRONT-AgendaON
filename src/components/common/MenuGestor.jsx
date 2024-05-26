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
    Badge,
    MenuButton,
    Menu,
    MenuList,
    MenuItem

} from '@chakra-ui/react';
import { HamburgerIcon, ArrowBackIcon, ChevronDownIcon } from '@chakra-ui/icons';
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
        <Box px={10} py={3} boxShadow="md" w="100%" bg="#172237">
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
                <DrawerContent bg="#172237">
                    <DrawerCloseButton color="white" />
                    <DrawerBody>
                        <Flex direction="column" paddingTop={20} align="center" mt={4}>
                            <Badge colorScheme="green" mb={4} borderRadius="full" px={2} py={1} fontSize="0.8em">
                                &#9679; Acesso: {user?.tipoUsuario || 'Desconhecido'}
                            </Badge>

                            <Flex direction="column" mt="50px" align="center" w="100%">
                                <Menu>
                                    <MenuButton color="white" boxSize="20" bg="#3D5A73" _hover={{ bg: "#3D5A90" }} mb={4} py={6} w="full" as={Button} rightIcon={<ChevronDownIcon />} justifyContent="space-between">
                                        Listar
                                    </MenuButton>
                                    <MenuList>
                                        <MenuItem>
                                            <RouterLink to="/disponibilidade-filtro-calendario" style={{ width: '100%', display: 'flex', justifyContent: 'center' }} onClick={onClose}>
                                                <Button color="white" bg="#3D5A73" _hover={{ bg: "#3D5A90" }} mb={0} py={6} w="full" justifyContent="space-between">
                                                    <i className="pi pi-filter" style={{ fontSize: '25px', verticalAlign: 'middle' }} />&nbsp;&nbsp;Disponibilidades
                                                </Button>
                                            </RouterLink>
                                        </MenuItem>
                                        <MenuItem>
                                            <RouterLink to="/lista-cliente" style={{ width: '100%', display: 'flex', justifyContent: 'center' }} onClick={onClose}>
                                                <Button color="white" bg="#3D5A73" _hover={{ bg: "#3D5A90" }} mb={0} py={6} w="full" justifyContent="space-between">
                                                    <i className="pi pi-users" style={{ fontSize: '30px', verticalAlign: 'middle' }} />&nbsp;&nbsp;Clientes
                                                </Button>
                                            </RouterLink>
                                        </MenuItem>
                                        <MenuItem>
                                            <RouterLink to="/lista-colaborador" style={{ width: '100%', display: 'flex', justifyContent: 'center' }} onClick={onClose}>
                                                <Button color="white" bg="#3D5A73" _hover={{ bg: "#3D5A90" }} mb={0} py={6} w="full" justifyContent="space-between">
                                                    <i className="pi pi-users" style={{ fontSize: '25px', verticalAlign: 'middle' }} />&nbsp;&nbsp;Colaboradores
                                                </Button>
                                            </RouterLink>
                                        </MenuItem>
                                        <MenuItem>
                                            <RouterLink to="/lista-servico" style={{ width: '100%', display: 'flex', justifyContent: 'center' }} onClick={onClose}>
                                                <Button color="white" bg="#3D5A73" _hover={{ bg: "#3D5A90" }} mb={0} py={6} w="full" justifyContent="space-between">
                                                    <i className="pi pi-list" style={{ fontSize: '25px', verticalAlign: 'middle' }} />&nbsp;&nbsp;Serviços
                                                </Button>
                                            </RouterLink>
                                        </MenuItem>
                                        <MenuItem>
                                            <RouterLink to="/lista-comissao" style={{ width: '100%', display: 'flex', justifyContent: 'center' }} onClick={onClose}>
                                                <Button color="white" bg="#3D5A73" _hover={{ bg: "#3D5A90" }} mb={0} py={6} w="full" justifyContent="space-between">
                                                    <i className="pi pi-list-check" style={{ fontSize: '25px', verticalAlign: 'middle' }} />&nbsp;&nbsp;Comissões
                                                </Button>
                                            </RouterLink>
                                        </MenuItem>
                                    </MenuList>
                                </Menu>

                                <RouterLink to="/disponibilidade-calendario" style={{ width: '100%', display: 'flex', justifyContent: 'center' }} onClick={onClose}>
                                    <Button color="white" bg="#3D5A73" _hover={{ bg: "#3D5A90" }} mb={4} py={6} w="full" justifyContent="space-between">
                                        <i className="pi pi-clock" style={{ fontSize: '25px', verticalAlign: 'middle' }} />&nbsp;&nbsp;Cadastrar Disponibilidade
                                    </Button>
                                </RouterLink>
                                <RouterLink to="/gerar-disponibilidade-calendario" style={{ width: '100%', display: 'flex', justifyContent: 'center' }} onClick={onClose}>
                                    <Button color="white" bg="#3D5A73" _hover={{ bg: "#3D5A90" }} mb={4} py={6} w="full" justifyContent="space-between">
                                        <i className="pi pi-clock" style={{ fontSize: '25px', verticalAlign: 'middle' }} />&nbsp;&nbsp;Gerar Disponibilidade
                                    </Button>
                                </RouterLink>
                                
                                <RouterLink to="/cadastro-colaborador" style={{ width: '100%', display: 'flex', justifyContent: 'center' }} onClick={onClose}>
                                    <Button color="white" bg="#3D5A73" _hover={{ bg: "#3D5A90" }} mb={4} py={6} w="full" justifyContent="space-between">
                                        <i className="pi pi-user-plus" style={{ fontSize: '25px', verticalAlign: 'middle' }} />&nbsp;&nbsp;Cadastrar Colaborador
                                    </Button>
                                </RouterLink>

                                <RouterLink to="/cadastro-servico" style={{ width: '100%', display: 'flex', justifyContent: 'center' }} onClick={onClose}>
                                    <Button color="white" bg="#3D5A73" _hover={{ bg: "#3D5A90" }} mb={4} py={6} w="full" justifyContent="space-between">
                                        <i className="pi pi-clipboard" style={{ fontSize: '25px', verticalAlign: 'middle' }} />&nbsp;&nbsp;Cadastrar Serviço
                                    </Button>
                                </RouterLink>

                                <RouterLink to="/cadastro-comissao" style={{ width: '100%', display: 'flex', justifyContent: 'center' }} onClick={onClose}>
                                    <Button color="white" bg="#3D5A73" _hover={{ bg: "#3D5A90" }} mb={4} py={6} w="full" justifyContent="space-between">
                                        <i className="pi pi-dollar" style={{ fontSize: '25px', verticalAlign: 'middle' }} />&nbsp;&nbsp;Cadastrar Comissão
                                    </Button>
                                </RouterLink>

                                <RouterLink to="/" onClick={handleLogout} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                    <Button color="white" boxSize="20" bg="#0B111B" _hover={{ bg: "#5381CB" }} w="full" py={6} rightIcon={<ArrowBackIcon />} justifyContent="space-between">
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

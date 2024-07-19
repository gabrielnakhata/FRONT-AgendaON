import { Box, Button, Flex, Image, useDisclosure, IconButton, Drawer, DrawerBody, DrawerOverlay, DrawerContent, DrawerCloseButton } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import logoAgendaIcon from '../../assets/kezuka_styles_icon_white.png';

const Header = () => {
    const { isOpen, onToggle, onClose } = useDisclosure();

    return (

        <Box px={4} py={3} boxShadow="md" w="100%" bg="#244196">
            <Flex justify="flex-end" align="center" w="100%">
                <IconButton
                    icon={<HamburgerIcon />}
                    variant="outline"
                    aria-label="Open Menu"
                    onClick={onToggle}
                    size="lg"
                    color="white"
                />
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
                                <RouterLink to="/login-modal" style={{ width: '100%', display: 'flex', justifyContent: 'center' }} onClick={onClose}>
                                    <Button bg="white" mb={4} onClick={onClose} w="full">
                                        Login
                                    </Button>
                                </RouterLink>
                                <RouterLink to="/cadastro-cliente" style={{ width: '100%', display: 'flex', justifyContent: 'center' }} onClick={onClose}>
                                    <Button color="white" bg="#244196" _hover={{ bg: "#244196" }} w="full">Cadastre-se</Button>
                                </RouterLink>
                            </Flex>
                            <Flex direction="column" paddingTop={530} align="center" mt={4}>
                            <Image
                            src={logoAgendaIcon}
                            w="10%"
                            objectFit="cover"
                            />
                            </Flex>
                        </DrawerBody>
                    </DrawerContent>
                  
                </Drawer>
            </Flex>
        </Box>
    );
};

export default Header;

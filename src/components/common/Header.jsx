import { Box, Button, Flex, Link, useDisclosure, IconButton, Drawer, DrawerBody, DrawerOverlay, DrawerContent, DrawerCloseButton } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';

const Header = () => {
    const { isOpen, onToggle, onClose } = useDisclosure();

    return (
        
        <Box px={4} py={3} boxShadow="md" w="100%" bgGradient='linear(to-l, #C02428, #244196)'> 
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
                    <DrawerContent bg="gray.700">
                        <DrawerCloseButton color="white" />
                        <DrawerBody>
                            <Flex direction="column" paddingTop={20} align="center" mt={4}>
                                <Button colorScheme="red" mb={4} onClick={onClose} w="full">
                                    Login
                                </Button>
                                <Link href="/cadastro" color="white" align="center" onClick={onClose} w="full">
                                    Cadastre-se
                                </Link>
                            </Flex>
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>
            </Flex>
        </Box>
    );
};

export default Header;

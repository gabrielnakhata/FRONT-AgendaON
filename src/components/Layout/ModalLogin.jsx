import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Input,
    FormControl,
    FormLabel,
    Stack,
    Image,
    Box,
    HStack,
    Link,
    Text 
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function ModalLogin() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();
    const location = useLocation();
    const [overlayType, setOverlayType] = useState('blur');

    useEffect(() => {
        if (location.pathname === '/login-modal') {
            setOverlayType('blur');
            onOpen();
        }
    }, [location, onOpen]);

    const handleClose = () => {
        onClose();         // Close the modal
        navigate('/');     // Navigate to home page
    };

    const OverlayOne = () => (
        <ModalOverlay
            bg='blackAlpha.300'
            backdropFilter='blur(50px) hue-rotate(90deg)'
            style={{
                backgroundImage: 'repeating-linear-gradient(45deg, #606dbc, #606dbc 10px, #465298 10px, #465298 20px)'
            }}
        />
    );

    const OverlayTwo = () => (
        <ModalOverlay
            bg='none'
            backdropFilter='auto'
            backdropInvert='80%'
            backdropBlur='8px'
        />
    );

    const getOverlay = () => {
        if (overlayType === 'blur') {
            return <OverlayOne />;
        } else {
            return <OverlayTwo />;
        }
    };

    return (
        <>
            <Modal isCentered isOpen={isOpen} onClose={handleClose} motionPreset="scale">
                {getOverlay()}
                <ModalContent>
                    <ModalCloseButton />
                    <ModalBody>
                        <Stack align="center" paddingTop={10}>
                            <Image
                                src="../src/assets/logo-kezuka.svg"
                                boxSize="180px"
                                alt="Logo AgendaOn Kezuka Style's"
                            />
                            <ModalHeader>Acessar AgendaOn</ModalHeader>
                            <FormControl isRequired>
                                <FormLabel>E-mail</FormLabel>
                                <Input placeholder="Insira seu e-mail" />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Senha</FormLabel>
                                <Input type="password" placeholder="Insira sua senha" />
                                <Text mt={2} textAlign="center" fontSize="sm">
                                <Link color="black" mt={2} onClick={() => navigate('/forgot-password')}>Esqueci minha senha</Link>
                                </Text>
                            </FormControl>
                        </Stack>
                    </ModalBody>
                    <ModalFooter>
                    <HStack spacing={4} width="full" justify="center">
                    <Box
                            isFullWidth
                            as='button'
                            onClick={handleClose}
                            p={3}
                            color='white'
                            fontWeight='bold'
                            borderRadius='md'
                            bgGradient='linear(to-l, #244196, #244196)'
                            _hover={{
                                bg: "#7786D9",
                            }}
                        >
                            LOGAR
                        </Box>
                    
                        </HStack>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default ModalLogin;

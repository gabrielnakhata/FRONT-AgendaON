import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    Input,
    FormControl,
    FormLabel,
    Stack,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate

function ModalLogin() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate(); // Hook para programar navegações
    const location = useLocation();
    const [overlayType, setOverlayType] = useState('blur');

    useEffect(() => {
        // Abre o modal automaticamente se a rota for '/login-modal'
        if (location.pathname === '/login-modal') {
            setOverlayType('blur');
            onOpen();
        }
    }, [location, onOpen]);

    const handleClose = () => {
        onClose();         // Fecha o modal
        navigate('/');     // Navega para a página inicial
    };

    const OverlayOne = () => (
        <ModalOverlay
            bg='blackAlpha.300'
            backdropFilter='blur(10px) hue-rotate(90deg)'
        />
    );

    const OverlayTwo = () => (
        <ModalOverlay
            bg='none'
            backdropFilter='auto'
            backdropInvert='80%'
            backdropBlur='2px'
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
                    <ModalHeader>Login to Your Account</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Stack spacing={4}>
                            <FormControl isRequired>
                                <FormLabel>Email</FormLabel>
                                <Input placeholder="Enter your email" />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel>Password</FormLabel>
                                <Input type="password" placeholder="Enter your password" />
                            </FormControl>
                        </Stack>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleClose}>Login</Button>
                        <Button variant="ghost" onClick={handleClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default ModalLogin;
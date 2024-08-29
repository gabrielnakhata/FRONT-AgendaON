import { useState } from 'react';
import { VStack, Card, HStack, Text, Flex, Box, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, AspectRatio } from '@chakra-ui/react';
import TitleSection from '../components/common/TitleSection';
import { useUserRedirect } from "../hooks/UseUserRedirect";
import ActionButtons from '../components/common/ActionButtons';

const LocalizacaoMaps = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { redirectToDashboard } = useUserRedirect();

    const handleClose = () => {
        redirectToDashboard();
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <Flex direction="column" minH="100vh" align="center" justify="center" bgGradient="linear(180deg, #455559, #182625)" w="100vw" m="0" p="0" overflowX="hidden">
            <TitleSection title="Localização" subtitle="Olá, demonstre sua satisfação nos avaliando no Google" />
            <Box bg="#fff" p={5} shadow="md" borderWidth="1px" borderRadius="md" w={['100%', '100%', '50%']} maxWidth="960px" marginX="auto" marginTop="2rem" marginBottom="2rem" mt="1rem">
                <VStack spacing={4}>
                    <AspectRatio ratio={16 / 9} w="100%">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3752.4290102720637!2d-44.00433548460492!3d-19.99693838154517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa6bdd3faa0d4a1%3A0xd43c812209c34fc8!2sSal%C3%A3o%20Kezuka%20Style's!5e0!3m2!1spt-BR!2sbr!4v1691325816341!5m2!1spt-BR!2sbr"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </AspectRatio>

                    <Box p={5} borderWidth="1px" borderRadius="md" bg="#fff" shadow="md">
                        <Text fontWeight="bold" justifyContent="center" color="#3D5A73">Avalie nosso salão no Google Maps:</Text>
                        <br></br>
                        <a href="https://www.google.com/maps/place/Sal%C3%A3o+Kezuka+Style%C2%B4s/@-19.9969384,-44.0021464,15z/data=!4m18!1m9!3m8!1s0xa6bdd3faa0d4a1:0xd43c812209c34fc8!2sSal%C3%A3o+Kezuka+Style%C2%B4s!8m2!3d-19.9969384!4d-44.0021464!9m1!1b1!16s%2Fg%2F11t88g3gqw!3m7!1s0xa6bdd3faa0d4a1:0xd43c812209c34fc8!8m2!3d-19.9969384!4d-44.0021464!9m1!1b1!16s%2Fg%2F11t88g3gqw?entry=ttu&g_ep=EgoyMDI0MDgyNi4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer">
                            <HStack justifyContent="center">
                                <i className="pi pi-star-fill" style={{ fontSize: '24px', color: '#FFD700' }}></i>
                                <i className="pi pi-star-fill" style={{ fontSize: '24px', color: '#FFD700' }}></i>
                                <i className="pi pi-star-fill" style={{ fontSize: '24px', color: '#FFD700' }}></i>
                                <i className="pi pi-star-fill" style={{ fontSize: '24px', color: '#FFD700' }}></i>
                                <i className="pi pi-star-fill" style={{ fontSize: '24px', color: '#FFD700' }}></i>
                            </HStack>
                        </a>
                        <br></br>
                    </Box>

                    <ActionButtons onBack={handleClose} onSave={null} isSaveDisabled={null} />
                </VStack>
            </Box>

            <Modal isOpen={isModalOpen} onClose={closeModal} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Atenção!</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4}>
                            <Card bg='#FEFF92' p={5}>
                                <HStack align="center" paddingBottom={2}>
                                    <i className="pi pi-exclamation-triangle" style={{ fontSize: '27px', verticalAlign: 'middle', color: '#172237' }} />
                                    <Text paddingLeft={4} fontSize="14px" color="#172237">
                                        Nosso sistema está em conformidade com a Lei Geral de Proteção de Dados (LGPD), assegurando a proteção e privacidade dos seus dados pessoais. Todas as informações coletadas são tratadas com segurança e utilizadas somente para os fins autorizados. Você tem o direito de acessar, corrigir ou solicitar a exclusão dos seus dados a qualquer momento. Estamos comprometidos em proteger sua privacidade e manter a sua confiança.
                                    </Text>
                                </HStack>
                            </Card>
                            <Card bg='#59FFA7' p={5}>
                                <HStack align="center" paddingBottom={2}>
                                    <i className="pi pi-info-circle" style={{ fontSize: '27px', verticalAlign: 'middle', color: '#38a169' }} />
                                    <Text paddingLeft={4} fontSize="14px" fontWeight="bold" color="#38a169">
                                        Você pode atualizar suas informações e alterar a senha acessando pelo botão Editar (lápis).
                                    </Text>
                                </HStack>
                            </Card>
                        </VStack>
                        <br></br>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Flex>
    );
};

export default LocalizacaoMaps;

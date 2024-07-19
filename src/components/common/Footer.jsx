import { Box, Container, Image, Text, Flex } from '@chakra-ui/react';
import logoAgenda from '../../assets/kezuka_styles_pro_logo_email.png';

const Footer = () => {
  return (
    <Box bg="#28403D" color="white" width="full" minH="150px"  display="flex" alignItems="center" justifyContent="center">
      <Container maxW="6xl" py={4}>
        <Flex justify="center" align="center">
          <Flex align="center" justify="center" width="100%">
            <Image
              src={logoAgenda}
              w="28%"
              objectFit="cover"
              m="0"
            />
            <Text color="#fff" paddingLeft={10}>© {new Date().getFullYear()} AgendaOn - Kezuka Style's Professional's. Todos os direitos reservados.</Text>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;

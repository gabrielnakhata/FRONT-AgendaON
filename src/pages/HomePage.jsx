import { Box, Image, Center, Flex } from '@chakra-ui/react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { useNavigate } from 'react-router-dom';
import bannerImage from '../assets/banner-agenda-online.jpg';

const HomePage = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/login-modal');
  };

  return (
    <Flex direction="column" minH="100vh" bg="#fff" w="100vw" m="0" p="0" overflowX="hidden">
      <Header />
      <Box flex="1" w="100%" overflow="hidden" p="0">
        <Image
          src={bannerImage}
          w="100%"
          h="500px"
          objectFit="cover"
          m="0"
        />
        <Center my={4}>
          <Box
            as='button'
            p={5}
            color='white'
            fontWeight='bold'
            borderRadius='md'
            onClick={handleNavigate}
            bgGradient='linear(to-l, #C02428, #C02428)'
            _hover={{
              bg: "#244196",
            }}
          >
            AGENDAR
          </Box>
        </Center>
      </Box>
      <Footer />
    </Flex>
  );
};

export default HomePage;
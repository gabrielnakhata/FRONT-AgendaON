import { Box, Text, Image, Center } from '@chakra-ui/react';
import Header from '../components/common/Header';

const HomePage = () => {
  return (

    <Box minW="100vw">
      <Header />
      <Center>
        <Image src="../src/assets/banner-agenda-online.jpg" boxSize="full" objectFit="cover" objectPosition="center" />
      </Center>
      <Center my={4}>
        <Box
          align="center"
          as='button'
          p={4}
          color='white'
          fontWeight='bold'
          borderRadius='md'
          bgGradient='linear(to-l, #C02428, #67469B)'
          _hover={{
            bgGradient: 'linear(to-l, #C02428, #D5A52F)',
          }}
        >
          AGENDAR
        </Box>
      </Center>
    </Box>

  );
};
export default HomePage;

import { Box, Flex, Heading, Text } from '@chakra-ui/react'
import { FaPizzaSlice } from 'react-icons/fa'

const Footer = () => {
  return (
    <Box as='footer' py='5' bgColor='red.500' zIndex={100}>
      <Flex alignItems='center' maxW='8xl' h='full' w='full' mx='auto' p='3'>
        <Flex flexDirection='column' experimental_spaceY={2}>
          <Flex alignItems='center' experimental_spaceX={2.5} color='white'>
            <FaPizzaSlice size={20} />

            <Heading as='h5' size='md' letterSpacing={1.5}>
              Todoist
            </Heading>
          </Flex>

          <Text color='white'>&copy; {new Date().getFullYear()} Baiq</Text>
        </Flex>

        {/* <Box ml='auto' experimental_spaceX={2.5}></Box> */}
      </Flex>
    </Box>
  )
}

export default Footer

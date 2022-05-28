import {
  Accordion as ChakraAccordion,
  Flex,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react'
import { FaInbox, FaRegCalendar, FaRegCalendarAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useCategories } from '../../hooks/useCategories'
import Accordion from '../Accordion'
import AddModal from '../AddModal'

const Sidebar = () => {
  const navigate = useNavigate()
  const { isLoading, error, categories } = useCategories((state) => ({
    isLoading: state.isLoading,
    categories: state.categories,
    error: state.error,
  }))

  return (
    <VStack
      flex={0.25}
      alignItems='flex-start'
      mx={5}
      mt={20}
      px={2}
      experimental_spaceY={2}
      overflowY='auto'
    >
      <Flex
        as='section'
        flexDirection='column'
        experimental_spaceY={1.5}
        w='full'
      >
        <Flex
          cursor='pointer'
          alignItems='center'
          experimental_spaceX={2.5}
          p={4}
          _hover={{
            backgroundColor: 'white',
          }}
          onClick={() => navigate('/')}
        >
          <FaInbox size={20} />
          <Text>Inbox</Text>
        </Flex>

        <Flex
          cursor='pointer'
          alignItems='center'
          experimental_spaceX={2.5}
          p={4}
          _hover={{
            backgroundColor: 'white',
          }}
          onClick={() => navigate('/today')}
        >
          <FaRegCalendar size={20} />
          <Text>Today</Text>
        </Flex>

        <Flex
          cursor='pointer'
          alignItems='center'
          experimental_spaceX={2.5}
          p={4}
          _hover={{
            backgroundColor: 'white',
          }}
          onClick={() => navigate('/next-7-days')}
        >
          <FaRegCalendarAlt size={20} />
          <Text>Next 7 days</Text>
        </Flex>
      </Flex>

      <ChakraAccordion
        as='section'
        allowMultiple
        w='full'
        experimental_spaceY={1.5}
      >
        {!isLoading ? (
          categories?.length! > 0 ? (
            categories?.map((dt) => (
              <Accordion key={dt.id} id={dt.id} data={dt.data} />
            ))
          ) : (
            <p>No categories yet.</p>
          )
        ) : (
          <Spinner />
        )}
      </ChakraAccordion>

      <AddModal title='new category' />
    </VStack>
  )
}

export default Sidebar

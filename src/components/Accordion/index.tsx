import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Icon,
  Text,
} from '@chakra-ui/react'
import { DocumentData } from 'firebase/firestore'
import { BsDot } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
import { CategoryItem } from '../../types/category'
import AddModal from '../AddModal'

interface Props {
  id: string
  data: DocumentData
}

const AccordionComp = ({ id, data }: Props) => {
  const navigate = useNavigate()

  return (
    <AccordionItem
      borderTop='none'
      borderBottomColor='blackAlpha.100'
      overflowY='auto'
    >
      <h2>
        <AccordionButton
          py={4}
          _hover={{
            backgroundColor: 'white',
          }}
          _focus={{
            outline: 'none',
          }}
        >
          <Box flex='1' textAlign='left'>
            {data.title}
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>

      <AccordionPanel pb={4}>
        {data?.categoryItems?.length! > 0 ? (
          data.categoryItems.map((categoryItem: CategoryItem) => (
            <Flex
              onClick={() =>
                navigate(
                  `/${data.title.toLowerCase()}/${categoryItem.itemName
                    .toLowerCase()
                    .split(' ')
                    .join('-')}/${categoryItem.id}`
                )
              }
              alignItems='center'
              cursor='pointer'
              gap={2.5}
              key={categoryItem.id}
              p={4}
              _hover={{
                backgroundColor: 'blackAlpha.50',
              }}
            >
              <Icon
                w={7}
                h={7}
                as={BsDot}
                color={`${categoryItem.itemColor}.500`}
              />
              <Text>{categoryItem.itemName}</Text>
            </Flex>
          ))
        ) : (
          <Flex alignItems='center' gap={2.5} p={4}>
            <Icon w={7} h={7} as={BsDot} color='gray.500' />
            <Text>No items yet.</Text>
          </Flex>
        )}

        <AddModal categoryRef={id} title={data.title} type='categoryItem' />
      </AccordionPanel>
    </AccordionItem>
  )
}

export default AccordionComp

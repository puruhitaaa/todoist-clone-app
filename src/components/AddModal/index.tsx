import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { useRef } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { BsPlus } from 'react-icons/bs'
import { auth } from '../../firebase/config'
import { useCategories } from '../../hooks/useCategories'
import { CategoryInput } from '../../types/category'

interface Props {
  categoryRef?: string
  title: string
  type?: string
}

const AddModal = ({ categoryRef, title, type = 'category' }: Props) => {
  const user = auth.currentUser
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const { addCategory, addCategoryItem } = useCategories((state) => ({
    addCategory: state.addCategory,
    addCategoryItem: state.addCategoryItem,
  }))
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryInput>()

  const onSubmit: SubmitHandler<CategoryInput> = async (data) => {
    if (type === 'category') {
      addCategory(data.title!, user?.uid!)
    } else {
      addCategoryItem(categoryRef!, data.itemColor!, data.itemName!)
    }

    reset()
    onClose()

    toast({
      title: 'Query success',
      description:
        type === 'category'
          ? `You have added ${data.title}.`
          : `You have added item ${data.itemName}`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  const initialRef = useRef(null)
  const finalRef = useRef(null)

  return (
    <>
      <Flex
        alignItems='center'
        cursor='pointer'
        gap={2.5}
        p={5}
        _hover={{
          backgroundColor: 'blackAlpha.50',
        }}
        onClick={onOpen}
        w='full'
      >
        <BsPlus size={20} /> Add {title}
      </Flex>

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {type === 'category'
              ? 'Create a new category'
              : `Create a new item on ${title}`}
          </ModalHeader>
          <ModalCloseButton />
          <Box as='form' onSubmit={handleSubmit(onSubmit)}>
            <ModalBody pb={6}>
              <FormControl>
                {type === 'category' ? (
                  <>
                    <FormLabel>Title</FormLabel>
                    <Input
                      placeholder='Title'
                      {...register('title', { required: true })}
                    />
                  </>
                ) : (
                  <VStack experimental_spaceY={3.5}>
                    <Box w='full'>
                      <FormLabel htmlFor='itemName'>Item name</FormLabel>
                      <Input
                        placeholder='Item name'
                        {...register('itemName', { required: true })}
                      />
                      {errors?.itemName && (
                        <FormErrorMessage>
                          {errors.itemName.message}
                        </FormErrorMessage>
                      )}
                    </Box>

                    <Box w='full'>
                      <FormLabel htmlFor='itemColor'>Item color</FormLabel>
                      <RadioGroup defaultValue='2'>
                        <Stack
                          spacing={5}
                          direction='row'
                          overflowX='auto'
                          p={2}
                        >
                          <Radio
                            colorScheme='red'
                            value='red'
                            {...register('itemColor')}
                          >
                            Red
                          </Radio>
                          <Radio
                            colorScheme='green'
                            value='green'
                            {...register('itemColor')}
                          >
                            Green
                          </Radio>
                          <Radio
                            colorScheme='blue'
                            value='blue'
                            {...register('itemColor')}
                          >
                            Blue
                          </Radio>
                          <Radio
                            colorScheme='yellow'
                            value='yellow'
                            {...register('itemColor')}
                          >
                            Yellow
                          </Radio>
                          <Radio
                            colorScheme='cyan'
                            value='cyan'
                            {...register('itemColor')}
                          >
                            Cyan
                          </Radio>
                          <Radio
                            colorScheme='teal'
                            value='teal'
                            {...register('itemColor')}
                          >
                            Teal
                          </Radio>
                          <Radio
                            colorScheme='purple'
                            value='purple'
                            {...register('itemColor')}
                          >
                            Purple
                          </Radio>
                        </Stack>
                      </RadioGroup>
                    </Box>
                  </VStack>
                )}
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button type='submit' colorScheme='green' mr={3}>
                Add
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </Box>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AddModal

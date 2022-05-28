import {
  AlertDialog as ChakraAlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  VStack,
  Button,
  Circle,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  ListIcon,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { useRef } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { BsCheckCircle, BsCircle, BsPlus } from 'react-icons/bs'
import { useParams } from 'react-router-dom'
import { auth } from '../../firebase/config'
import { useTodos } from '../../hooks/useTodos'
import { Todo, TodoInput } from '../../types/todo'

interface Props {
  todo?: Todo
  type: 'todoItem' | 'todoAdd'
}

const AlertDialog = ({ todo, type }: Props) => {
  const { setTaskAsDone, addTodo } = useTodos((state) => ({
    setTaskAsDone: state.setTaskAsDone,
    addTodo: state.addTodo,
  }))
  const toast = useToast()
  const user = auth.currentUser
  const { categoryRef = 'inbox' } = useParams()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TodoInput>()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef(null)

  const onSubmit: SubmitHandler<TodoInput> = async (data) => {
    addTodo(data.desc, categoryRef, user?.uid!, data.dueDate)

    reset()
    onClose()

    toast({
      title: `Hey ${user?.displayName}`,
      description: 'You have successfully added a new todo item.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  return (
    <>
      {type === 'todoItem' ? (
        <ListIcon
          as={todo?.data.isDone ? BsCheckCircle : BsCircle}
          cursor='pointer'
          onClick={onOpen}
        />
      ) : (
        <Circle
          size='40px'
          backgroundColor='red.500'
          position='absolute'
          color='white'
          right={5}
          bottom={5}
          transition='ease-in-out'
          cursor='pointer'
          onClick={onOpen}
          _hover={{
            backgroundColor: 'white',
            color: '#000',
            border: '1px solid #E53E3E',
          }}
        >
          <BsPlus size={24} />
        </Circle>
      )}

      <ChakraAlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent as='form' onSubmit={handleSubmit(onSubmit)}>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              {type === 'todoItem' ? 'Set task as done' : 'Add a new task'}
            </AlertDialogHeader>

            <AlertDialogBody>
              {type === 'todoItem' ? (
                todo?.data.isDone ? (
                  'Are you sure you want to mark this task as undone?'
                ) : (
                  'Are you sure you want to mark this task as done?'
                )
              ) : (
                <VStack w='full' experimental_spaceY={2.5}>
                  <FormControl>
                    <FormLabel htmlFor='desc'>Description</FormLabel>
                    <Input
                      id='desc'
                      type='text'
                      {...register('desc', { required: true })}
                    />
                    {errors?.desc && (
                      <FormErrorMessage>{errors.desc.message}</FormErrorMessage>
                    )}
                  </FormControl>

                  <FormControl>
                    <FormLabel htmlFor='dueDate'>Due Date</FormLabel>
                    <Input
                      id='dueDate'
                      type='date'
                      {...register('dueDate', { required: true })}
                    />
                    {errors?.dueDate && (
                      <FormErrorMessage>
                        {errors.dueDate.message}
                      </FormErrorMessage>
                    )}
                  </FormControl>
                </VStack>
              )}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                {type === 'todoItem' ? 'No' : 'Cancel'}
              </Button>
              {type === 'todoItem' ? (
                <Button
                  colorScheme='red'
                  onClick={() => {
                    setTaskAsDone(todo?.id!)
                    onClose()
                  }}
                  ml={3}
                >
                  Yes
                </Button>
              ) : (
                <Button colorScheme='red' type='submit' ml={3}>
                  Add
                </Button>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </ChakraAlertDialog>
    </>
  )
}

export default AlertDialog

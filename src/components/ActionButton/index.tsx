import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { useRef } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { BsPencil, BsTrash } from 'react-icons/bs'
import { auth } from '../../firebase/config'
import { useTodos } from '../../hooks/useTodos'
import { TodoInput } from '../../types/todo'

interface Props {
  todoId: string
  type: 'edit' | 'delete'
  data?: {
    desc: string
  }
}

const ActionButton = ({ type, data, todoId }: Props) => {
  const { updateTodo, deleteTodo } = useTodos((state) => ({
    updateTodo: state.updateTodo,
    deleteTodo: state.deleteTodo,
  }))
  const user = auth.currentUser
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TodoInput>({
    defaultValues: {
      desc: data?.desc,
    },
  })
  const cancelRef = useRef(null)

  const onSubmit: SubmitHandler<TodoInput> = async (data) => {
    updateTodo(todoId, data.desc, data.dueDate)

    reset()
    onClose()

    toast({
      title: `Hey ${user?.displayName}`,
      description: 'You have successfully updated a new todo item.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  return (
    <>
      <IconButton
        onClick={onOpen}
        aria-label={type === 'delete' ? 'Delete todo' : 'Update todo'}
        colorScheme={type === 'delete' ? 'red' : 'green'}
        icon={type === 'delete' ? <BsTrash /> : <BsPencil />}
      />

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              {type === 'delete' ? 'Delete Todo' : 'Update Todo'}
            </AlertDialogHeader>

            <AlertDialogBody>
              {type === 'delete' ? (
                "Are you sure? You can't undo this action afterwards."
              ) : (
                <Box
                  as='form'
                  id='edit-form'
                  w='full'
                  onSubmit={handleSubmit(onSubmit)}
                  experimental_spaceY={2.5}
                >
                  <FormControl>
                    <FormLabel htmlFor='desc'>Description</FormLabel>
                    <Input
                      id='desc'
                      type='text'
                      {...register('desc', { required: true })}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel htmlFor='dueDate'>Due Date</FormLabel>
                    <Input
                      id='dueDate'
                      type='date'
                      {...register('dueDate', { required: true })}
                    />
                  </FormControl>
                </Box>
              )}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              {type === 'delete' ? (
                <Button
                  colorScheme='red'
                  ml={3}
                  onClick={() => {
                    deleteTodo(todoId)
                    toast({
                      title: `Hey ${user?.displayName}`,
                      description: 'You have successfully deleted a todo item.',
                      status: 'success',
                      duration: 3000,
                      isClosable: true,
                    })
                  }}
                >
                  Delete
                </Button>
              ) : (
                <Button
                  colorScheme='green'
                  form='edit-form'
                  ml={3}
                  type='submit'
                >
                  Update
                </Button>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

export default ActionButton

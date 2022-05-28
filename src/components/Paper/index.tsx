import {
  Box,
  Flex,
  Heading,
  List,
  ListItem,
  Spacer,
  Spinner,
  Text,
} from '@chakra-ui/react'
import { formatDistance } from 'date-fns'
import { useEffect, useRef } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { auth } from '../../firebase/config'
import { useTodos } from '../../hooks/useTodos'
import ActionButton from '../ActionButton'
import AlertDialog from '../AlertDialog'

const Paper = () => {
  const user = auth.currentUser
  let fetchRef = useRef(true)
  let location = useLocation()
  let { categoryName = 'inbox', categoryRef } = useParams()
  const { isLoading, todos, fetchTodos } = useTodos((state) => ({
    isLoading: state.isLoading,
    todos: state.todos,
    fetchTodos: state.fetchTodos,
  }))

  useEffect(() => {
    if (location.pathname.split('/').length === 2) {
      fetchTodos(categoryName, user?.uid!)
    } else {
      fetchTodos(categoryRef!, user?.uid!)
    }

    return () => {
      fetchRef.current = false
    }
  }, [fetchTodos, categoryRef, categoryName, location, user])

  return !isLoading ? (
    <Box
      position='relative'
      bgColor='white'
      p={5}
      flex={0.5}
      mt={14}
      minH='92.8vh'
      maxH='92.8vh'
      overflowY='auto'
    >
      <Heading textTransform='capitalize' p={5}>
        {categoryName.split('-').join(' ')}
      </Heading>
      <List spacing={3} w='full'>
        {todos?.length! > 0 ? (
          todos?.map((todo) => (
            <ListItem
              key={todo.id}
              display='flex'
              alignItems='center'
              w='full'
              experimental_spaceX={2.5}
              p={3.5}
              _hover={{
                backgroundColor: 'blackAlpha.50',
              }}
            >
              <AlertDialog type='todoItem' todo={todo} />
              <Flex flexDirection='column'>
                <Text>{todo.data.desc}</Text>
                <Text color='GrayText' fontWeight='light'>
                  {formatDistance(
                    new Date(todo.data.dueDate.seconds * 1000),
                    new Date(),
                    {
                      addSuffix: true,
                    }
                  )}
                </Text>
              </Flex>

              <Spacer />

              <Flex experimental_spaceX={2.5}>
                <ActionButton type='delete' todoId={todo.id} />
                <ActionButton
                  data={{ desc: todo.data.desc }}
                  type='edit'
                  todoId={todo.id}
                />
              </Flex>
            </ListItem>
          ))
        ) : (
          <Heading px={5} as='h5' size='sm' color='GrayText'>
            No tasks for {categoryName.split('-').join(' ')} yet.
          </Heading>
        )}
      </List>
      <AlertDialog type='todoAdd' />
    </Box>
  ) : (
    <Spinner />
  )
}

export default Paper

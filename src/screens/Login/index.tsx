import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { SubmitHandler, useForm } from 'react-hook-form'
import { FaPizzaSlice } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { OAuth, SignUpModal } from '../../components'
import { auth } from '../../firebase/config'
import { AuthInputs } from '../../types/authentication'

const Login = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AuthInputs>()

  const onSubmit: SubmitHandler<AuthInputs> = async (data) => {
    const { user } = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    )

    reset()

    navigate('/', { replace: true })
    toast({
      title: `Hey there ${user.displayName}`,
      description: 'You have successfully logged in.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  return (
    <Container
      display='flex'
      h='full'
      maxW='8xl'
      flexDirection={['column', 'column', 'column', 'row']}
      experimental_spaceX={['0', '0', '0', '64']}
      experimental_spaceY={['12', '12', '12', '0']}
      justifyContent='center'
      alignItems='center'
      mx='auto'
      px='5'
    >
      <VStack
        as='section'
        alignItems={['center', 'center', 'center', 'start']}
        textAlign={['center', 'center', 'center', 'start']}
      >
        <Box color='red.500'>
          <Flex alignItems='center' experimental_spaceX={2.5}>
            <FaPizzaSlice size={32} />
            <Heading as='h5' size='xl' letterSpacing={1.5}>
              Todoist
            </Heading>
          </Flex>
        </Box>

        <Box>
          <Heading
            as='h4'
            size='lg'
            color='gray.700'
            letterSpacing={1.5}
            w={['full', 'full', 'full', 'xs']}
          >
            Your blazingly fast todo-list app.
          </Heading>
        </Box>
      </VStack>

      <Box
        as='form'
        experimental_spaceY={5}
        color='gray.700'
        onSubmit={handleSubmit(onSubmit)}
        w={['full', 'md', 'lg', 'xs']}
      >
        <OAuth action='Sign in' />

        <FormControl>
          <FormLabel htmlFor='email'>Email</FormLabel>
          <Input
            id='email'
            _placeholder={{ color: 'gray.500' }}
            bgColor='transparent'
            borderWidth={1}
            borderStyle='solid'
            borderColor='gray.800'
            placeholder='Enter email...'
            type='email'
            w={['full', 'full', 'lg', 'xs']}
            {...register('email', {
              required: true,
            })}
          />
          {errors?.email && (
            <FormErrorMessage>{errors.email.message}</FormErrorMessage>
          )}
        </FormControl>

        <FormControl>
          <FormLabel htmlFor='password'>Password</FormLabel>
          <Input
            id='password'
            _placeholder={{ color: 'gray.500' }}
            bgColor='transparent'
            borderWidth={1}
            borderStyle='solid'
            borderColor='gray.800'
            placeholder='Enter password...'
            type='password'
            w={['full', 'full', 'lg', 'xs']}
            {...register('password', {
              required: true,
              minLength: {
                value: 6,
                message: 'Password should be 6 characters or more',
              },
            })}
          />
          {errors?.password && (
            <FormErrorMessage>{errors.password.message}</FormErrorMessage>
          )}
        </FormControl>

        <Button
          type='submit'
          color='white'
          bgColor='red.500'
          w='full'
          _hover={{ bgColor: 'red.600' }}
        >
          Submit
        </Button>

        <Button display='block' variant='link' color='linkedin.700' mx='auto'>
          Forgot your password?
        </Button>

        <Divider bgColor='gray.600' />

        <SignUpModal />
      </Box>
    </Container>
  )
}

export default Login

import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react'
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../../firebase/config'
import { AuthInputs } from '../../types/authentication'
import OAuth from '../OAuth'

const SignUpModal = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AuthInputs>()

  const onSubmit: SubmitHandler<AuthInputs> = async (data) => {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    )

    await sendEmailVerification(user)

    await updateProfile(user, {
      displayName: data.username,
    })

    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      fullName: data.fullName,
      username: data.username,
      lastUpdated: serverTimestamp(),
    })

    reset()

    navigate('/', { replace: true })
    toast({
      title: `Welcome ${data.username}`,
      description: 'You have successfully registered.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  return (
    <>
      <Button
        color='white'
        bgColor='green.500'
        w='full'
        _hover={{ bgColor: 'green.600' }}
        onClick={onOpen}
      >
        Create new account
      </Button>

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sign Up</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack
              as='form'
              alignItems='center'
              experimental_spaceY={5}
              onSubmit={handleSubmit(onSubmit)}
              w='full'
              py={5}
            >
              <OAuth action='Sign up' />
              <FormControl>
                <FormLabel htmlFor='email'>Email</FormLabel>
                <Input
                  id='email'
                  bgColor='transparent'
                  borderWidth={1}
                  borderStyle='solid'
                  borderColor='gray.700'
                  placeholder='Enter email...'
                  type='email'
                  {...register('email', {
                    required: true,
                    minLength: {
                      value: 5,
                      message: 'Email should be 5 characters or more',
                    },
                  })}
                />
                {errors?.email && (
                  <FormErrorMessage>{errors.email.message}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl>
                <FormLabel htmlFor='fullName'>Full name</FormLabel>
                <Input
                  id='fullName'
                  bgColor='transparent'
                  borderWidth={1}
                  borderStyle='solid'
                  borderColor='gray.700'
                  placeholder='Enter full name...'
                  type='text'
                  {...register('fullName', {
                    required: true,
                  })}
                />
                {errors?.fullName && (
                  <FormErrorMessage>{errors.fullName.message}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl>
                <FormLabel htmlFor='username'>Username</FormLabel>
                <Input
                  id='username'
                  bgColor='transparent'
                  borderWidth={1}
                  borderStyle='solid'
                  borderColor='gray.700'
                  placeholder='Enter username...'
                  type='text'
                  {...register('username', {
                    required: true,
                    minLength: {
                      value: 5,
                      message: 'Username should be 5 characters or more',
                    },
                  })}
                />
                {errors?.username && (
                  <FormErrorMessage>{errors.username.message}</FormErrorMessage>
                )}
              </FormControl>

              <FormControl>
                <FormLabel htmlFor='password'>Password</FormLabel>
                <Input
                  id='password'
                  bgColor='transparent'
                  borderWidth={1}
                  borderStyle='solid'
                  borderColor='gray.700'
                  placeholder='Enter password...'
                  type='password'
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

              <FormControl>
                <FormLabel htmlFor='confirmPassword'>
                  Confirm Password
                </FormLabel>
                <Input
                  id='confirmPassword'
                  bgColor='transparent'
                  borderWidth={1}
                  borderStyle='solid'
                  borderColor='gray.700'
                  placeholder='Enter password...'
                  type='password'
                  {...register('confirmPassword', {
                    required: true,
                    minLength: {
                      value: 6,
                      message: 'Password should be 6 characters or more',
                    },
                  })}
                />
                {errors?.confirmPassword && (
                  <FormErrorMessage>
                    {errors.confirmPassword.message}
                  </FormErrorMessage>
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
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default SignUpModal

import { CheckIcon, CloseIcon, EditIcon } from '@chakra-ui/icons'
import {
  Avatar,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { sendPasswordResetEmail } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { useEffect, useRef } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { CgClose } from 'react-icons/cg'
import { FaEdit } from 'react-icons/fa'
import { HiOutlineCheck } from 'react-icons/hi'
import { useParams } from 'react-router-dom'
import { Header } from '../../components'
import { auth, db } from '../../firebase/config'
import { useProfile } from '../../hooks/useProfile'
import { AuthInputs } from '../../types/authentication'

const Profile = () => {
  const { userRef } = useParams()
  const { isLoading, isMounted, profile, fetchUserProfile } = useProfile(
    (state) => ({
      isLoading: state.isLoading,
      isMounted: state.isMounted,
      profile: state.profile,
      fetchUserProfile: state.fetchUserProfile,
    })
  )
  const user = auth
  const toast = useToast()
  const isMountedRef = useRef(isMounted)

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<AuthInputs>()

  const handleClick = async () => {
    const values = getValues()

    const docRef = doc(db, 'users', user.currentUser?.uid!)
    setDoc(docRef, { values }, { merge: true })
  }

  const handleResetPassword = async () => {
    await sendPasswordResetEmail(auth, profile?.email)

    toast({
      title: 'Email sent',
      description: 'Please follow emailed instructions to reset your password.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  useEffect(() => {
    if (isMountedRef) {
      fetchUserProfile(userRef!)
    }

    return () => {
      isMountedRef.current = false
    }
  }, [userRef, isMounted, fetchUserProfile])

  return !isLoading ? (
    <>
      <Header />

      <VStack
        maxW='8xl'
        alignItems='center'
        experimental_spaceY={10}
        mx='auto'
        py={20}
      >
        <Avatar size='xl' bg='teal.500' src={profile?.photoURL} />

        <VStack
          as='form'
          experimental_spaceY={5}
          color='gray.700'
          // onSubmit={handleSubmit(onSubmit)}
          alignItems='center'
          px={2.5}
          maxW={['sm', 'sm', 'lg']}
          w='full'
        >
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
              defaultValue={profile?.email}
              {...register('email', {
                required: true,
              })}
            />
            {errors?.email && (
              <FormErrorMessage>{errors.email.message}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl>
            <FormLabel htmlFor='username'>Username</FormLabel>
            <Input
              id='username'
              _placeholder={{ color: 'gray.500' }}
              bgColor='transparent'
              borderWidth={1}
              borderStyle='solid'
              borderColor='gray.800'
              placeholder='Enter username...'
              type='username'
              defaultValue={profile?.username}
              {...register('username', {
                required: true,
              })}
            />
            {errors?.username && (
              <FormErrorMessage>{errors.username.message}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl>
            <FormLabel htmlFor='fullName'>Full name</FormLabel>
            <Input
              id='fullName'
              _placeholder={{ color: 'gray.500' }}
              bgColor='transparent'
              borderWidth={1}
              borderStyle='solid'
              borderColor='gray.800'
              placeholder='Enter fullName...'
              type='fullName'
              defaultValue={profile?.fullName}
              {...register('fullName', {
                required: true,
              })}
            />
            {errors?.username && (
              <FormErrorMessage>{errors.username.message}</FormErrorMessage>
            )}
          </FormControl>

          <Button
            display='block'
            variant='link'
            color='linkedin.700'
            mx='auto'
            onClick={handleResetPassword}
          >
            Reset password
          </Button>

          <Button
            type='submit'
            color='white'
            bgColor='green.500'
            w='full'
            _hover={{ bgColor: 'green.600' }}
          >
            Confirm changes
          </Button>
        </VStack>
      </VStack>
    </>
  ) : (
    <Spinner position='absolute' left='50%' top='25%' />
  )
}

export default Profile

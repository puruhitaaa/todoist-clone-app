import { Button, Tooltip, useToast } from '@chakra-ui/react'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { FcGoogle } from 'react-icons/fc'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../../firebase/config'

interface Props {
  action: string
}

const OAuth = ({ action }: Props) => {
  const navigate = useNavigate()
  const toast = useToast()

  const onGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      const userRef = doc(db, 'users', user.uid)
      const docSnap = await getDoc(userRef)

      if (!docSnap.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          fullName: user.displayName,
          username: user.displayName?.replace(/\s+/g, '').toLowerCase(),
          email: user.email,
          photoURL: user.photoURL,
          lastUpdated: serverTimestamp(),
        })
      }

      navigate('/')
    } catch (error) {
      toast({
        title: `Google OAuth Error`,
        description: 'Could not authorize with Google.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }
  return (
    <Tooltip
      label={`${action} with Google`}
      justifySelf='self-end'
      bg='linkedin.700'
      color='white'
    >
      <Button colorScheme='whiteAlpha' boxShadow='sm' onClick={onGoogleClick}>
        <FcGoogle size={28} />
      </Button>
    </Tooltip>
  )
}

export default OAuth

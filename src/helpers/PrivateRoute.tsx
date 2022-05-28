import { useEffect, useRef } from 'react'
import { Spinner } from '@chakra-ui/react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function PrivateRoute() {
  const { loggedIn, isLoading, signIn, isMounted } = useAuth((state) => ({
    loggedIn: state.loggedIn,
    isLoading: state.isLoading,
    signIn: state.signIn,
    isMounted: state.isMounted,
  }))
  const isMountedRef = useRef(isMounted)

  useEffect(() => {
    if (isMountedRef) {
      signIn()
    }

    return () => {
      isMountedRef.current = false
    }
  }, [signIn, isMountedRef])

  if (isLoading) return <Spinner position='absolute' left='50%' top='25%' />

  return loggedIn ? <Outlet /> : <Navigate to='/sign-in' />
}

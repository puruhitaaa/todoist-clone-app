import {
  Avatar,
  Box,
  Flex,
  Heading,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react'
import { FaPizzaSlice } from 'react-icons/fa'
import { CgLogOut } from 'react-icons/cg'
import { HiOutlineCog } from 'react-icons/hi'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { auth } from '../../firebase/config'
import { signOut } from 'firebase/auth'

const Header = () => {
  const navigate = useNavigate()
  const user = auth.currentUser

  const logout = async () => {
    await signOut(auth)

    navigate('/sign-in', { replace: true })
  }

  return (
    <Box
      as='header'
      h={14}
      bgColor='red.500'
      w='full'
      position='fixed'
      top={0}
      zIndex={100}
    >
      <Flex alignItems='center' maxW='8xl' h='full' w='full' mx='auto' p='3'>
        <Flex
          alignItems='center'
          experimental_spaceX={2.5}
          color='white'
          flex={1}
        >
          <Link as={RouterLink} cursor='pointer' to='/'>
            <FaPizzaSlice size={20} />
          </Link>
          <Heading as='h5' size='md' letterSpacing={1.5}>
            Todoist
          </Heading>
        </Flex>

        <Menu>
          <MenuButton as='button' bgColor='transparent'>
            <Avatar size='sm' bg='teal.500' src={user?.photoURL!} />
          </MenuButton>

          <MenuList>
            <MenuItem
              display='flex'
              alignItems='center'
              experimental_spaceX={2.5}
              minH='40px'
              onClick={() => navigate(`/profile/${user?.uid}`)}
            >
              <Avatar size='2xs' bg='teal.500' src={user?.photoURL!} />
              <span>Profile</span>
              <Text fontWeight='semibold'>({user?.displayName})</Text>
            </MenuItem>
            <MenuItem
              display='flex'
              alignItems='center'
              experimental_spaceX={2.5}
              minH='40px'
            >
              <HiOutlineCog />
              <span>Settings</span>
            </MenuItem>
            <MenuItem
              onClick={logout}
              display='flex'
              alignItems='center'
              experimental_spaceX={2.5}
              minH='40px'
            >
              <CgLogOut color='#E53E3E' />
              <span>Logout</span>
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Box>
  )
}

export default Header

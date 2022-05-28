import { Box, ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Footer } from './components'
import PrivateRoute from './helpers/PrivateRoute'
import { MainScreen, LoginScreen, ProfileScreen } from './screens'

export const App = () => {
  return (
    <BrowserRouter>
      <ChakraProvider>
        <Box as='main' bgColor='gray.200' h='100vh'>
          <Routes>
            <Route path='/' element={<PrivateRoute />}>
              <Route path='/' element={<MainScreen />} />
            </Route>
            <Route path='/' element={<PrivateRoute />}>
              <Route path='/:categoryName' element={<MainScreen />} />
            </Route>
            <Route path='/' element={<PrivateRoute />}>
              <Route
                path='/:category/:categoryName/:categoryRef'
                element={<MainScreen />}
              />
            </Route>
            <Route path='sign-in' element={<LoginScreen />} />
            <Route path='profile/:userRef' element={<ProfileScreen />} />
          </Routes>
        </Box>

        <Footer />
      </ChakraProvider>
    </BrowserRouter>
  )
}

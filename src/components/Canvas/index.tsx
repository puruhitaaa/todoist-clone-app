import { Flex } from '@chakra-ui/react'
import Paper from '../Paper'
import Sidebar from '../Sidebar'

const Canvas = () => {
  return (
    <Flex maxW='8xl' mx='auto'>
      <Sidebar />
      <Paper />
      {/* <More /> */}
    </Flex>
  )
}

export default Canvas

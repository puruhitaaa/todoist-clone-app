import { useEffect } from 'react'
import { Canvas, Header } from '../../components'
import { auth } from '../../firebase/config'
import { useCategories } from '../../hooks/useCategories'

const Main = () => {
  const user = auth
  const fetchCategories = useCategories((state) => state.fetchCategories)

  useEffect(() => {
    fetchCategories(user.currentUser?.uid!)
  }, [fetchCategories, user])

  return (
    <>
      <Header />
      <Canvas />
    </>
  )
}

export default Main

import create from 'zustand'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase/config'

interface IAuth {
  loggedIn: boolean
  isLoading: boolean
  isMounted: boolean
  signIn: () => void
}

export const useAuth = create<IAuth>((set) => ({
  loggedIn: false,
  isLoading: true,
  isMounted: true,
  signIn: () =>
    onAuthStateChanged(auth, (user) => {
      if (user) {
        set({ loggedIn: true })
      }
      set({ isLoading: false })
    }),
}))

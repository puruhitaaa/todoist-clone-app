import { doc, DocumentData, getDoc } from 'firebase/firestore'
import create from 'zustand'
import { db } from '../firebase/config'

interface IProfile {
  profile: DocumentData | null
  isLoading: boolean
  isMounted: boolean
  fetchUserProfile: (userRef: string) => void
}

export const useProfile = create<IProfile>((set) => ({
  profile: null,
  isLoading: true,
  isMounted: true,
  fetchUserProfile: async (userRef: string) => {
    const docRef = doc(db, 'users', userRef!)
    const user = await getDoc(docRef)

    set({ profile: user?.data() })

    set({ isLoading: false })
  },
}))

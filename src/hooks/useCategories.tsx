import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  DocumentData,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  where,
} from 'firebase/firestore'
import create from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import { db } from '../firebase/config'
import { Category } from '../types/category'

interface ICategory {
  categories: Category[] | null
  lastFetched: DocumentData | null
  error: string | null
  isLoading: boolean
  isMounted: boolean
  fetchCategories: (userId: string) => void
  addCategory: (title: string, userRef: string) => void
  addCategoryItem: (
    categoryRef: string,
    itemColor: string,
    itemName: string
  ) => void
}

export const useCategories = create<ICategory>((set, get) => ({
  categories: null,
  lastFetched: null,
  error: null,
  isLoading: true,
  isMounted: true,
  fetchCategories: async (userId: string) => {
    const categoriesRef = collection(db, 'categories')

    const q = query(
      categoriesRef,
      where('userRef', '==', userId),
      orderBy('createdAt', 'asc'),
      limit(5)
    )

    const querySnap = await getDocs(q)

    const lastVisible = querySnap.docs[querySnap.docs.length - 1]
    set({ lastFetched: lastVisible })

    const tempCategories: Category[] = []

    querySnap.forEach((doc) => {
      return tempCategories.push({
        id: doc.id,
        data: doc.data(),
      })
    })

    set({ categories: tempCategories, isLoading: false })
  },
  addCategory: async (title: string, userRef: string) => {
    let newData: Category | null = null

    const docRef = await addDoc(collection(db, 'categories'), {
      title,
      userRef,
      createdAt: serverTimestamp(),
    })

    newData = {
      id: docRef.id,
      data: {
        title: title,
        userRef: userRef,
      },
    }

    set((state) => ({ categories: [...state.categories!, newData!] }))
  },
  addCategoryItem: async (
    categoryRef: string,
    itemColor: string,
    itemName: string
  ) => {
    let created_at = Timestamp.now()
    let categories = get().categories
    const docRef = doc(db, 'categories', categoryRef)
    const generateId = uuidv4()

    await setDoc(
      docRef,
      {
        categoryItems: arrayUnion({
          id: generateId,
          itemColor,
          itemName,
          createdAt: created_at,
        }),
      },
      { merge: true }
    )

    for (let i = 0, l = categories?.length!; i < l; ++i) {
      if (categories?.[i].id === categoryRef) {
        if (categories[i].data.categoryItems.length > 0) {
          categories[i].data.categoryItems = [
            ...categories[i].data.categoryItems,
            { id: generateId, itemColor, itemName, createdAt: created_at },
          ]
        } else {
          categories[i].data.categoryItems.push({
            id: generateId,
            itemColor,
            itemName,
            createdAt: created_at,
          })
        }

        set({ categories: categories })
      }
    }
  },
}))

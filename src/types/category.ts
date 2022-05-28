import { DocumentData } from 'firebase/firestore'

export interface Category {
  id: string
  data: DocumentData
}

export interface CategoryItem {
  id: string
  itemName: string
  itemColor: string
  createdAt: DocumentData
}

export interface CategoryInput {
  title?: string
  userRef?: string
  itemName?: string
  itemColor?: string
}

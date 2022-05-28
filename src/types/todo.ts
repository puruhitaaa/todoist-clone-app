import { DocumentData } from 'firebase/firestore'

export interface Todo {
  id: string
  data: DocumentData
}

export interface TodoInput {
  desc: string
  isDone: boolean
  categoryRef: string
  userRef: string
  dueDate: string
  createdAt: DocumentData
}

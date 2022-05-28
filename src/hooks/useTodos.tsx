import {
  addDoc,
  collection,
  deleteDoc,
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
import { db } from '../firebase/config'
import { Todo } from '../types/todo'

interface ITodo {
  todos: Todo[] | null
  lastFetched: DocumentData | null
  // error: string | null
  isLoading: boolean
  // isMounted: boolean
  fetchTodos: (categoryRef: string, userRef: string) => void
  setTaskAsDone: (id: string) => void
  addTodo: (
    desc: string,
    categoryRef: string,
    userRef: string,
    dueDate: string
  ) => void
  updateTodo: (todoId: string, desc: string, dueDate: string) => void
  deleteTodo: (todoId: string) => void
  // addCategory: (title: string, userRef: string) => void
  // addCategoryItem: (
  //   categoryRef: string,
  //   itemColor: string,
  //   itemName: string
  // ) => void
}

export const useTodos = create<ITodo>((set, get) => ({
  todos: null,
  lastFetched: null,
  isLoading: true,
  fetchTodos: async (categoryRef: string, userRef: string) => {
    const todosRef = collection(db, 'todos')

    const q = query(
      todosRef,
      where('categoryRef', '==', categoryRef),
      where('userRef', '==', userRef),
      orderBy('dueDate', 'desc'),
      limit(20)
    )

    const querySnap = await getDocs(q)

    const lastVisible = querySnap.docs[querySnap.docs.length - 1]
    set({ lastFetched: lastVisible })

    const tempTodos: Todo[] = []

    querySnap.forEach((doc) => {
      return tempTodos.push({
        id: doc.id,
        data: doc.data(),
      })
    })

    set({
      todos: tempTodos,
      isLoading: false,
    })
  },
  setTaskAsDone: async (id: string) => {
    let getTodos = get().todos
    let newTodo: Todo | null = null
    let index = getTodos?.findIndex((todo) => todo.id === id)
    const docRef = doc(db, 'todos', id)

    if (getTodos?.[index!].data.isDone) {
      await setDoc(
        docRef,
        {
          isDone: false,
        },
        { merge: true }
      )
    } else {
      await setDoc(
        docRef,
        {
          isDone: true,
        },
        { merge: true }
      )
    }

    newTodo = {
      ...getTodos?.[index!]!,
      data: {
        ...getTodos?.[index!].data,
        isDone: !getTodos?.[index!].data.isDone,
      },
    }

    set((prevState) => ({
      todos: [...prevState.todos!.filter((todo) => todo.id !== id), newTodo!],
    }))
  },
  addTodo: async (
    desc: string,
    categoryRef: string,
    userRef: string,
    dueDate: string
  ) => {
    let timestamp = serverTimestamp()
    let dueTimestamp = Timestamp.fromDate(new Date(dueDate))
    const ref = collection(db, 'todos')

    const docRef = await addDoc(ref, {
      desc,
      categoryRef,
      userRef,
      isDone: false,
      dueDate: dueTimestamp,
      createdAt: timestamp,
    })

    set((prevState) => ({
      todos: [
        ...prevState.todos!,
        {
          id: docRef.id,
          data: {
            desc,
            categoryRef,
            userRef,
            dueDate: dueTimestamp,
            createdAt: timestamp,
            isDone: false,
          },
        },
      ],
    }))
  },
  updateTodo: async (todoId: string, desc: string, dueDate: string) => {
    let dueTimestamp = Timestamp.fromDate(new Date(dueDate))
    const docRef = doc(db, 'todos', todoId)

    await setDoc(
      docRef,
      {
        desc,
        dueDate: dueTimestamp,
      },
      { merge: true }
    )

    set((prevState) => ({
      todos: prevState.todos?.map((todo) =>
        todo.id === todoId
          ? { ...todo, data: { desc: desc, dueDate: dueTimestamp } }
          : todo
      ),
    }))
  },
  deleteTodo: async (todoId: string) => {
    const docRef = doc(db, 'todos', todoId)

    await deleteDoc(docRef)

    set((prevState) => ({
      todos: prevState.todos?.filter((todo) => todo.id !== todoId),
    }))
  },
}))

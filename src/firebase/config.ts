import { initializeApp, getApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyAPdGpRYmEYb9HM01_obhfQrJeiEcjv3e8',
  authDomain: 'todoist-clone-app-6d6a1.firebaseapp.com',
  projectId: 'todoist-clone-app-6d6a1',
  storageBucket: 'todoist-clone-app-6d6a1.appspot.com',
  messagingSenderId: '425841812155',
  appId: '1:425841812155:web:8cddc45743f008644bbf9e',
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore(app)
const auth = getAuth(app)

export { db, auth }

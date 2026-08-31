import { create } from "zustand";
import { db } from "../Services/Firebase";
import { addDoc, collection, doc, getDocs, deleteDoc, updateDoc } from "firebase/firestore";

const useContactStore = create((set) => ({
    users: [],

    fetchUser: async () => {
        const snapShot = await getDocs(collection(db, "users"))
        const userData = snapShot.docs.map((docSnap) => ({
            id: docSnap.id, ...docSnap.data()
        }))
        set({ users: userData })
    },

    addNewUser: async (user) => {
        const docRef = await addDoc(collection(db, "users"), user)
        set((state) => ({
            users: [...state.users, { id: docRef.id, ...user }]
        }))
    },

    deleteUser: async (id) => {
        const userRef = doc(db, "users", id)
        await deleteDoc(userRef)
        set((state) => ({
            users: state.users.filter(user => user.id !== id)
        }))
    },


    updateUser: async (id, updatedData) => {
        const userRef = doc(db, "users", id)
        await updateDoc(userRef, updatedData)
        set((state) => ({
            users: state.users.map((user) => user.id === id ? { ...user, ...updatedData } : user)
        }))
    },

}))

export default useContactStore
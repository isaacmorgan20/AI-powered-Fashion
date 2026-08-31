import { create } from "zustand";
import { auth, db } from "../service/Firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import {
    createUserWithEmailAndPassword, //register
    signInWithEmailAndPassword,  // login
    signOut,  //logOut
    onAuthStateChanged, //keep session after refresh
} from "firebase/auth";
import useSettingsStore from "./settingsStore";

const useAuthStore = create((set) => ({
    user: null,     // firebase auth user (uid, email)
    profile: null,  // firebase profile (name, course, email)
    loading: true,  // true until firebase finishes checking session

    // Register; create auth account + saves profile in firebase
    register: async ({ businessName, name, email, password }) => {
        // create login account in firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;  // contains uid + email


        // 2) Build profile to save in Firestore
        const profileData = {
            uid: user.uid,
            businessName,
            name,
            email: user.email,  // use Auth email as source of truth
            createdAt: Date.now(),
        };


        // 3) save to Firestore at users/{uid} - using the setDoc function
        await setDoc(doc(db, "users", user.uid), profileData);

        // 4) save to zustand for easy access in UI
        set({ user, profile: profileData });
        try { useSettingsStore.getState().fetchSettings(); } catch {}
    },

    //LOGIN: 
    login: async ({ email, password }) => {
        // 1. sign in
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2) fetch profile using uid
        const snap = await getDoc(doc(db, "users", user.uid));
        const profileData = snap.exists() ? snap.data() : null;

        // 3) save to Zustand
        set({ user, profile: profileData });
        try { useSettingsStore.getState().fetchSettings(); } catch {}
    },

    //Logout: signs out + clears state
    logout: async() => {
        await signOut(auth);
        set({user: null, profile: null});
        try { useSettingsStore.getState().fetchSettings(); } catch {}
        useSettingsStore.setState({ settings: null, loading: true, error: null });
    },

    // SESSION: runs on app load; keeps user logged in after refresh
    listenToAuth: () => {
        onAuthStateChanged(auth, async (user) => {  //passing an async function as a callback function
            // if logged out
            if (!user) {
                set({ user: null, profile: null, loading: false});
                try { useSettingsStore.setState({ settings: null, loading: true, error: null }); } catch {}
                return;
            }
            // if logged in, fetch profile too
            const snap = await getDoc(doc(db, "users", user.uid));
            const profileData = snap.exists() ? snap.data() : null;

            set({user, profile: profileData, loading: false});
            try { useSettingsStore.getState().fetchSettings(); } catch {}
        });
    },


}));

export default useAuthStore;
import {
  getAuth,
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  User,
} from "firebase/auth";
import app from "./config";
import { useEffect, useState } from "react";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const provider = new GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/userinfo.profile");

const auth = getAuth(app);
const db = getFirestore(app);

export const signIn = () =>
  signInWithPopup(auth, provider)
    .then(async (result) => {
      if (!result) return;

      const user = result.user;

      const userDoc = {
        name: user.displayName || "",
        id: user.uid,
        favoriteTickets: [],
        tickets: [],
        membership: {
          point: 0,
          history: []
        },
        wallet: {
          balance: 0,
          history: []
        }
      };

      

      const userDocRef = doc(db, "users", user.uid); // Đường dẫn đến document của người dùng
      const existingUserDoc = await getDoc(userDocRef); // Lấy dữ liệu từ Firestore
      if (existingUserDoc.exists()) return user;

      await setDoc(doc(db, "users", user.uid), userDoc)
        .catch((error) => {
          console.error("Error writing document: ", error);
        });

      return user;
    })
    .catch((error) => {});

export const signOut = () => auth.signOut();

export function useUserInfomation() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        console.log(user);
      }
      setIsLoading(false);
    });
  }, []);

  return [isLoading, user];
}

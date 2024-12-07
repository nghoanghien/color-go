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

const provider = new GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/userinfo.profile");

const auth = getAuth(app);

export const signIn = () =>
  signInWithPopup(auth, provider)
    .then((result) => {
      if (!result) return;

      const user = result.user;

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
      }
      setIsLoading(false);
    });
  }, []);

  return [isLoading, user];
}

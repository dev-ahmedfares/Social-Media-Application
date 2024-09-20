import { getCurrentUser } from "@/lib/appwrite/api";
import {  IUser } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const INITIAL_USER = {
  id: "",
  email: "",
  username: "",
  name: "",
  bio: "",
  imageUrl: "",
};

const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  setUser: () => {},
  checkAuthUser: async () => false as boolean,
};

type IContextType= {
    user: IUser,
    isLoading:boolean,
    isAuthenticated:boolean,
    setIsAuthenticated:React.Dispatch<React.SetStateAction<boolean>>,
    setUser:React.Dispatch<React.SetStateAction<IUser>>,
    checkAuthUser:()=> Promise<boolean>
}

const authContext = createContext<IContextType>(INITIAL_STATE);

export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
    const navigate= useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isLoading, setIsLoading] = useState(false);
  
  const checkAuthUser = async () => {
      setIsLoading(true)
    try {
      const currentAccount = await getCurrentUser();
      if (currentAccount) {
        setUser({
          id: currentAccount.$id,
          username:currentAccount.username,
          name:currentAccount.name,
          email:currentAccount.email,
          imageUrl:currentAccount.imageUrl,
          bio:currentAccount.bio,
        });
        setIsAuthenticated(true);
        return true;
      }

      return false;
    } catch (error) {
      console.log(error);
      return false
    } finally {
        setIsLoading(false)
    }
  };
  const values= {
    user,
    isAuthenticated,
    isLoading,
    checkAuthUser,
    setIsAuthenticated,
    setUser
  }
  useEffect(() => {
    const cookieFallback = localStorage.getItem("cookieFallback")

    if(cookieFallback === "[]" || cookieFallback === null || cookieFallback === undefined) {
        navigate("/sign-in")
        return;
    }
    checkAuthUser()
  }, []);

  return <authContext.Provider value={values}>{children}</authContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(authContext);
  if (context === undefined)
    throw new Error("useAuthContext must used within AuthContextProvider ");
  return context;
}



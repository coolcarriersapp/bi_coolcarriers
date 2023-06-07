import { useContext, createContext } from "react";

const defaultValues = {
  isAuthenticated: false,
  setIsAuthenticated: (_isAuthenticated: boolean) => {},
  userName: "",
  setUserName: (_userName: string) => {},
  userLastName: "",
  setUserLastName: (_userLastName: string) => {},
  userImage: "",
  setUserImage: (_userImage: string) => {},
};

export const AppContext = createContext(defaultValues);

export function useAppContext() {
  return useContext(AppContext);
}

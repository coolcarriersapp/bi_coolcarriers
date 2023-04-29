import { useContext, createContext } from "react";

const defaultValues = {
  isAuthenticated: false,
  setIsAuthenticated: (_isAuthenticated: boolean) => {},
};

export const AppContext = createContext(defaultValues);

export function useAppContext() {
  return useContext(AppContext);
}

import { useContext, createContext } from "react";

interface UserConfiguration {
  sections: {
    section_name: string;
    pages: {
      page_name: string;
      elements: {
        id: string;
        element_type: string;
        table_name: string;
        table_id: string;
        columns: string[];
        data: any;
        query_name: string;
        query: string;
        variables: {
          limit: number;
          offset: number;
          order: string;
          columns_like: any;
          filters: any;
        };
        filters: {
          global: {
            value: any;
            matchMode: string;
          };
        };
      }[];
    }[];
  }[];
}
interface AppContextType {
  isAuthenticated: Boolean;
  setIsAuthenticated: any;
  userToken: String | null;
  setUserToken: any;
  userName: String;
  setUserName: any;
  userLastName: String;
  setUserLastName: any;
  userImage: string;
  setUserImage: any;
  userConfiguration: UserConfiguration | null;
  setUserConfiguration: any;
  currentSection: String;
  setCurrentSection: any;
  currentPage: String;
  setCurrentPage: any;
}

const defaultValues = {
  isAuthenticated: false,
  setIsAuthenticated: (_isAuthenticated: boolean) => {},
  userToken: null,
  setUserToken: (_userToken: any) => {},
  userName: "",
  setUserName: (_userName: string) => {},
  userLastName: "",
  setUserLastName: (_userLastName: string) => {},
  userImage: "",
  setUserImage: (_userImage: string) => {},
  userConfiguration: null,
  setUserConfiguration: (_userConfiguration: any) => {},
  currentSection: "",
  setCurrentSection: (_userName: string) => {},
  currentPage: "",
  setCurrentPage: (_userName: string) => {},
};

export const AppContext = createContext<AppContextType>(defaultValues);

export function useAppContext() {
  return useContext(AppContext);
}

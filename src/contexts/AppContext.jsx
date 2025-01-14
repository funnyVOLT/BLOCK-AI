import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

export const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within a AppContextProvider");
  }
  return context;
};

const AppProvider = ({ children }) => {
  const [tab, setTab] = useState(0);
  return (
    <AppContext.Provider value={{ tab, setTab }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;

/* eslint-disable */
import { createContext, useContext } from "react";
import { SettingsDataContextProvider } from ".";
import { OTCTradesSolanaDataContextProvider } from ".";

export type GlobalContent = {
  reloadPage: () => void;
};

export const GlobalDataContext = createContext<GlobalContent>({
  reloadPage: () => {},
});

export const useGlobalDataContext = () => useContext(GlobalDataContext);

// Create a provider component
export const DataProvider = ({ children }: any) => {
  const reloadPage: any = () => {
    (window as any).location.reload();
  };

  return (
    <GlobalDataContext.Provider value={{ reloadPage }}>
      <SettingsDataContextProvider>
        <OTCTradesSolanaDataContextProvider>
          {children}
        </OTCTradesSolanaDataContextProvider>
      </SettingsDataContextProvider>
    </GlobalDataContext.Provider>
  );
};

/* eslint-disable */
import { createContext, useContext, useState } from "react";

export const applicationSettingsInitialState = {
  ui: {
    site: {
      meta: {
        title: "",
        keywords: "",
        description: "",
        author: "",
      },
    },
  },
};

export type SettingsContentTypeInterface = {
  applicationSettings: any;
  setApplicationSettings: (c: any) => void;
};

export const SettingsDataContext = createContext<SettingsContentTypeInterface>({
  applicationSettings: applicationSettingsInitialState,
  setApplicationSettings: () => {},
});

export const useSettingsDataContext = () => useContext(SettingsDataContext);

export const SettingsDataContextProvider = ({ children }: any) => {
  const [applicationSettings, setApplicationSettings] = useState<any>(
    applicationSettingsInitialState
  );

  //local settings

  //load from remote

  //save local settings

  return (
    <SettingsDataContext.Provider
      value={{
        applicationSettings,
        setApplicationSettings,
      }}
    >
      {children}
    </SettingsDataContext.Provider>
  );
};

import React, { createContext, useContext } from "react";
import ApiManager from "@/context/apiCalls";

const ApiManagerContext = createContext<ApiManager | null>(null);

export const ApiManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const apiManager = new ApiManager();  

  return (
    <ApiManagerContext.Provider value={apiManager}>
      {children}
    </ApiManagerContext.Provider>
  );
};

export const useApiManager = (): ApiManager => {
  const context = useContext(ApiManagerContext);
  if (!context) {
    throw new Error("useApiManager debe ser usado dentro del ApiManagerProvider");
  }
  return context;
};

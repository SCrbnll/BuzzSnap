import React from "react";
import { Provider } from "react-redux";
import AppRouter from "./routes/AppRouter";
import { store } from "@/context/store";
import { ApiManagerProvider } from "@/layouts/ApiContext"; 

const App: React.FC = () => {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <ApiManagerProvider>
          <AppRouter />
        </ApiManagerProvider>
      </Provider>
    </React.StrictMode>
  );
};

export default App;

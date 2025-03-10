import React from "react";
import { Provider } from "react-redux";
import AppRouter from "./routes/AppRouter";
import { store } from "@/context/store";
import { ApiManagerProvider } from "@/layouts/ApiContext"; 

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ApiManagerProvider>
        <AppRouter />
      </ApiManagerProvider>
    </Provider>
  );
};

export default App;

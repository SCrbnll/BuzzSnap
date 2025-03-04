import React from "react";
import { Provider } from "react-redux"; 
import AppRouter from "./routes/AppRouter"; 
import { store } from "@/context/store";

const App: React.FC = () => {
  return (
    // Envuelves tu aplicación con el Provider y pasas el store
    <Provider store={store}>
      <AppRouter />
    </Provider>
  );
};

export default App;

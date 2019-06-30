import { createContext } from "react";

const AppContext = createContext({
  currentUser: null,
  isAuth: false
});

export default AppContext;

import { createContext } from "react";

const AppContext = createContext({
  currentUser: null,
  isAuth: false,
  draft: null,
  pins: []
});

export default AppContext;

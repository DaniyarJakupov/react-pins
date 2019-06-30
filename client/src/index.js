import React, { useContext, useReducer } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "mapbox-gl/dist/mapbox-gl.css";

import App from "./pages/App";
import Splash from "./pages/Splash";
import AppContext from "./context";
import reducer from "./reducer";
import PrivateRoute from "./hoc/PrivateRoute";

const Root = () => {
  const initState = useContext(AppContext);
  const [state, dispatch] = useReducer(reducer, initState);

  return (
    <Router>
      <AppContext.Provider value={{ state, dispatch }}>
        <Switch>
          <PrivateRoute exact path="/" component={App} />
          <Route path="/login" component={Splash} />
        </Switch>
      </AppContext.Provider>
    </Router>
  );
};

ReactDOM.render(<Root />, document.getElementById("root"));

import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import AppContext from "../context";

const PrivateRoute = ({ component: Comp, ...rest }) => {
  const { state } = useContext(AppContext);

  return <Route render={props => (!state.isAuth ? <Redirect to="/login" /> : <Comp {...props} />)} {...rest} />;
};

export default PrivateRoute;

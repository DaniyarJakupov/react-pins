import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import AppContext from "../context";

const PrivateRoute = ({ component: Comp, ...rest }) => {
  const { state } = useContext(AppContext);

  return <Route {...rest} component={props => (state.isAuth ? <Comp {...props} /> : <Redirect to="/login" />)} />;
};

export default PrivateRoute;

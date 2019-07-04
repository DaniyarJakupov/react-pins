import React, { useContext, useReducer } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "mapbox-gl/dist/mapbox-gl.css";

import { ApolloProvider } from "react-apollo";
import { ApolloClient } from "apollo-client";
import { WebSocketLink } from "apollo-link-ws";
import { InMemoryCache } from "apollo-cache-inmemory";

import App from "./pages/App";
import Splash from "./pages/Splash";
import AppContext from "./context";
import reducer from "./reducer";
import PrivateRoute from "./hoc/PrivateRoute";

/* Configure Apollo */
const wsLink = new WebSocketLink({
  uri: "ws://localhost:4000/graphql",
  options: {
    reconnect: true
  }
});
const apolloClient = new ApolloClient({
  link: wsLink,
  cache: new InMemoryCache()
});

const Root = () => {
  const initState = useContext(AppContext);
  const [state, dispatch] = useReducer(reducer, initState);

  return (
    <Router>
      <ApolloProvider client={apolloClient}>
        <AppContext.Provider value={{ state, dispatch }}>
          <Switch>
            <PrivateRoute exact path="/" component={App} />
            <Route path="/login" component={Splash} />
          </Switch>
        </AppContext.Provider>
      </ApolloProvider>
    </Router>
  );
};

ReactDOM.render(<Root />, document.getElementById("root"));

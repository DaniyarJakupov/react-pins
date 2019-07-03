import React, { useContext } from "react";
import { GoogleLogin } from "react-google-login";
import { GraphQLClient } from "graphql-request";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import AppContext from "../../context";
import { ME_QUERY } from "../../graphql/queries";
import { BASE_URL } from "../../graphql/client";

const Login = ({ classes }) => {
  const { dispatch } = useContext(AppContext);

  const onSuccess = async googleUser => {
    try {
      const idToken = googleUser.getAuthResponse().id_token;
      const client = new GraphQLClient(BASE_URL, {
        headers: { authorization: idToken }
      });
      let { me } = await client.request(ME_QUERY);
      dispatch({ type: "LOGIN_USER", payload: me });
      dispatch({ type: "UPDATE_IS_AUTH", payload: googleUser.isSignedIn() });
    } catch (e) {
      onFailure(e);
    }
  };

  const onFailure = err => {
    console.error(`Error logging in, ${err}`);
  };

  return (
    <div className={classes.root}>
      <Typography component="h1" variant="h3" gutterBottom noWrap style={{ color: "rgb(66, 133, 244)" }}>
        Welcome to ReactPins!
      </Typography>
      <GoogleLogin
        clientId="539730108119-3ku7clq0lpq0tneolcugh7jrp266usi3.apps.googleusercontent.com"
        onSuccess={onSuccess}
        isSignedIn={true}
        onFailure={onFailure}
        theme="dark"
      />
    </div>
  );
};

const styles = {
  root: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center"
  }
};

export default withStyles(styles)(Login);

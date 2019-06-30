import React, { useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import { GoogleLogout } from "react-google-login";
import ExitToApp from "@material-ui/icons/ExitToApp";
import Typography from "@material-ui/core/Typography";

import AppContext from "../../context";

const Signout = ({ classes }) => {
  const { dispatch } = useContext(AppContext);
  const onSignout = () => {
    dispatch({ type: "SIGN_OUT_USER" });
  };
  return (
    <GoogleLogout
      onLogoutSuccess={onSignout}
      render={({ onClick }) => (
        <span className={classes.root} onClick={onClick}>
          <Typography variant="body1" noWrap color="inherit" className={classes.buttonText}>
            Signout
          </Typography>
          <ExitToApp className={classes.buttonIcon} />
        </span>
      )}
    />
  );
};

const styles = {
  root: {
    cursor: "pointer",
    display: "flex"
  },
  buttonText: {
    color: "orange"
  },
  buttonIcon: {
    marginLeft: "5px",
    color: "orange"
  }
};

export default withStyles(styles)(Signout);

import React from "react";
import { withStyles } from "@material-ui/core/styles";
import ExploreIcon from "@material-ui/icons/Explore";
import Typography from "@material-ui/core/Typography";

const NoContent = ({ classes }) => {
  return (
    <div className={classes.root}>
      <ExploreIcon className={classes.icon} />
      <Typography noWrap component="h2" variant="h6" align="center" color="primary" gutterBottom>
        Click on the map to add the Pin
      </Typography>
    </div>
  );
};

const styles = theme => ({
  root: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center"
  },
  icon: {
    margin: theme.spacing.unit,
    fontSize: "80px"
  }
});

export default withStyles(styles)(NoContent);

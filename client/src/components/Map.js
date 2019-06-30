import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import ReactMapGl, { NavigationControl } from "react-map-gl";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/DeleteTwoTone";

const init_viewport = {
  latitude: 37.7577,
  longitude: -122.4376,
  zoom: 13
};

const Map = ({ classes }) => {
  const [viewport, setViewport] = useState(init_viewport);
  return (
    <div className={classes.root}>
      <ReactMapGl
        {...viewport}
        onViewportChange={newViewport => setViewport(newViewport)}
        width="100vw"
        height="calc(100vh - 64px)"
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxApiAccessToken="pk.eyJ1IjoiZGFuaXlhci1qYWt1cG92IiwiYSI6ImNqZ3AzZTRkcTBiN3Uyd3MwbWxlbjhwZzEifQ.zcgZLLrfzJq7XleAUid6oA"
      >
        <div className={classes.navigationControl}>
          <NavigationControl onViewportChange={newViewport => setViewport(newViewport)} />
        </div>
      </ReactMapGl>
    </div>
  );
};

const styles = {
  root: {
    display: "flex"
  },
  rootMobile: {
    display: "flex",
    flexDirection: "column-reverse"
  },
  navigationControl: {
    position: "absolute",
    top: 0,
    left: 0,
    margin: "1em"
  },
  deleteIcon: {
    color: "red"
  },
  popupImage: {
    padding: "0.4em",
    height: 200,
    width: 200,
    objectFit: "cover"
  },
  popupTab: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  }
};

export default withStyles(styles)(Map);

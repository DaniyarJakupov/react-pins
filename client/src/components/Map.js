import React, { useState, useEffect, useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import ReactMapGl, { NavigationControl, Marker } from "react-map-gl";
// import Button from "@material-ui/core/Button";
// import Typography from "@material-ui/core/Typography";
// import DeleteIcon from "@material-ui/icons/DeleteTwoTone";

import PinIcon from "./PinIcon";
import Blog from "./Blog";
import AppContext from "../context";
import { useClient } from "../graphql/client";
import { GET_PINS_QUERY } from "../graphql/queries";

const init_viewport = {
  latitude: 37.7577,
  longitude: -122.4376,
  zoom: 13
};

const Map = ({ classes }) => {
  const { state, dispatch } = useContext(AppContext);
  const [viewport, setViewport] = useState(init_viewport);
  const [userPosition, setUserPosition] = useState(null);
  const client = useClient();

  /* =============================== */
  useEffect(() => {
    getPins();
  }, []);

  const getPins = async () => {
    const { getPins } = await client.request(GET_PINS_QUERY);
    dispatch({ type: "GET_PINS", payload: getPins });
  };
  /* =============================== */
  useEffect(() => {
    getUserPosition();
  }, []);

  const getUserPosition = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;

        setViewport({ ...viewport, latitude, longitude });
        setUserPosition({ latitude, longitude });
      });
    }
  };
  /* =============================== */
  const handleMapClick = ({ lngLat, leftButton }) => {
    if (!leftButton) return;
    if (!state.draft) {
      dispatch({ type: "CREATE_DRAFT" });
    }
    const [longitude, latitude] = lngLat;
    dispatch({ type: "UPDATE_DRAFT_LOCATION", payload: { longitude, latitude } });
  };
  /* =============================== */

  return (
    <div className={classes.root}>
      <ReactMapGl
        width="100vw"
        height="calc(100vh - 64px)"
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxApiAccessToken="pk.eyJ1IjoiZGFuaXlhci1qYWt1cG92IiwiYSI6ImNqZ3AzZTRkcTBiN3Uyd3MwbWxlbjhwZzEifQ.zcgZLLrfzJq7XleAUid6oA"
        onViewportChange={newViewport => setViewport(newViewport)}
        onClick={handleMapClick}
        {...viewport}
      >
        {/* Navigation Control */}
        <div className={classes.navigationControl}>
          <NavigationControl onViewportChange={newViewport => setViewport(newViewport)} />
        </div>

        {/* Pin for User's Current Position */}
        {userPosition && (
          <Marker latitude={userPosition.latitude} longitude={userPosition.longitude} offsetLeft={-19} offsetTop={-37}>
            <PinIcon color="crimson" size={40} />
          </Marker>
        )}

        {/* Draft Pin */}
        {state.draft && (
          <Marker latitude={state.draft.latitude} longitude={state.draft.longitude} offsetLeft={-19} offsetTop={-37}>
            <PinIcon color="hotpink" size={40} />
          </Marker>
        )}

        {/* Created Pins */}
        {state.pins &&
          state.pins.map(pin => (
            <Marker key={pin._id} latitude={pin.latitude} longitude={pin.longitude} offsetLeft={-19} offsetTop={-37}>
              <PinIcon color="darkblue" size={40} />
            </Marker>
          ))}
      </ReactMapGl>

      {/* Blog area to add Pin Content */}
      <Blog />
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

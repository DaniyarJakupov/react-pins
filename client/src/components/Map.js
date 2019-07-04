import React, { useState, useEffect, useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import ReactMapGl, { NavigationControl, Marker, Popup } from "react-map-gl";
import differenceInMinutes from "date-fns/difference_in_minutes";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/DeleteTwoTone";
import { Subscription } from "react-apollo";
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";

import PinIcon from "./PinIcon";
import Blog from "./Blog";
import AppContext from "../context";
import { useClient } from "../graphql/client";
import { GET_PINS_QUERY } from "../graphql/queries";
import { DELETE_PIN_MUTATION } from "../graphql/mutations";
import { PIN_ADDED_SUB, PIN_DELETED_SUB, PIN_UPDATED_SUB } from "../graphql/subscriptions";

const init_viewport = {
  latitude: 37.7577,
  longitude: -122.4376,
  zoom: 13
};

const Map = ({ classes }) => {
  const mobileSize = useMediaQuery("(max-width: 650px)");
  const { state, dispatch } = useContext(AppContext);
  const [viewport, setViewport] = useState(init_viewport);
  const [userPosition, setUserPosition] = useState(null);
  const [popup, setPopup] = useState(null);
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
  const highlightNewPin = pin => {
    const isNewPin = differenceInMinutes(Date.now(), Number(pin.createdAt)) <= 30;
    return isNewPin ? "rebeccapurple" : "darkblue";
  };
  /* =============================== */
  const handleSelectPin = pin => {
    setPopup(pin);
    dispatch({ type: "SET_PIN", payload: pin });
  };

  const isAuthUser = () => state.currentUser._id === popup.author._id;

  const handlePinDelete = async pin => {
    try {
      const variables = { pinId: pin._id };
      await client.request(DELETE_PIN_MUTATION, variables);
      setPopup(null);
    } catch (e) {
      console.error("Error while deleting pin", e);
    }
  };
  /* =============================== */

  return (
    <div className={mobileSize ? classes.rootMobile : classes.root}>
      <ReactMapGl
        width="100vw"
        height="calc(100vh - 64px)"
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxApiAccessToken="pk.eyJ1IjoiZGFuaXlhci1qYWt1cG92IiwiYSI6ImNqZ3AzZTRkcTBiN3Uyd3MwbWxlbjhwZzEifQ.zcgZLLrfzJq7XleAUid6oA"
        onViewportChange={newViewport => setViewport(newViewport)}
        onClick={handleMapClick}
        scrollZoom={!mobileSize}
        {...viewport}
      >
        {/* Navigation Control */}
        <div className={classes.navigationControl}>
          <NavigationControl onViewportChange={newViewport => setViewport(newViewport)} />
        </div>

        {/* Pin for User's Current Position */}
        {userPosition && (
          <Marker
            latitude={userPosition.latitude}
            longitude={userPosition.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon color="crimson" size={40} />
          </Marker>
        )}

        {/* Draft Pin */}
        {state.draft && (
          <Marker
            latitude={state.draft.latitude}
            longitude={state.draft.longitude}
            offsetLeft={-19}
            offsetTop={-37}
          >
            <PinIcon color="hotpink" size={40} />
          </Marker>
        )}

        {/* Created Pins */}
        {state.pins &&
          state.pins.map(pin => (
            <Marker
              key={pin._id}
              latitude={pin.latitude}
              longitude={pin.longitude}
              offsetLeft={-19}
              offsetTop={-37}
            >
              <PinIcon
                color={highlightNewPin(pin)}
                size={40}
                onClick={() => handleSelectPin(pin)}
              />
            </Marker>
          ))}

        {/* Popup Area */}
        {popup && (
          <Popup
            anchor="top"
            latitude={popup.latitude}
            longitude={popup.longitude}
            closeOnClick={false}
            onClose={() => setPopup(null)}
          >
            <img className={classes.popupImage} src={popup.image} alt={popup.title} />

            <div className={classes.popupTab}>
              <Typography>
                {popup.latitude.toFixed(6)}, {popup.longitude.toFixed(6)}
              </Typography>

              {isAuthUser() && (
                <Button onClick={() => handlePinDelete(popup)}>
                  <DeleteIcon className={classes.deleteIcon} />
                </Button>
              )}
            </div>
          </Popup>
        )}
      </ReactMapGl>

      {/* Subscription for Pins */}
      <Subscription
        subscription={PIN_ADDED_SUB}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinAdded } = subscriptionData.data;
          dispatch({ type: "CREATE_PIN", payload: pinAdded });
        }}
      />

      <Subscription
        subscription={PIN_DELETED_SUB}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinDeleted } = subscriptionData.data;
          dispatch({ type: "DELETE_PIN", payload: pinDeleted });
        }}
      />

      <Subscription
        subscription={PIN_UPDATED_SUB}
        onSubscriptionData={({ subscriptionData }) => {
          const { pinUpdated } = subscriptionData.data;
          dispatch({ type: "CREATE_COMMENT", payload: pinUpdated });
        }}
      />

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

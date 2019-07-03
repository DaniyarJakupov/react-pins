import React, { useState, useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AddAPhotoIcon from "@material-ui/icons/AddAPhotoTwoTone";
import LandscapeIcon from "@material-ui/icons/LandscapeOutlined";
import ClearIcon from "@material-ui/icons/Clear";
import SaveIcon from "@material-ui/icons/SaveTwoTone";
import axios from "axios";

import AppContext from "../../context";
import { CREATE_PIN_MUTATION } from "../../graphql/mutations";
import { useClient } from "../../graphql/client";

const CreatePin = ({ classes }) => {
  const { dispatch, state } = useContext(AppContext);
  const client = useClient(); // Custom hook that creates GraphQL client
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleDiscard = () => {
    setTitle("");
    setImage("");
    setContent("");

    dispatch({ type: "REMOVE_DRAFT" });
  };

  const handleImageUpload = async () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "reactpins");
    data.append("cloud_name", "dw8oigkhb");
    const res = await axios.post("https://api.cloudinary.com/v1_1/dw8oigkhb/image/upload", data);
    return res.data.url;
  };

  const handleSubmit = async e => {
    try {
      e.preventDefault();
      setSubmitting(true);
      const imgUrl = await handleImageUpload();
      const variables = {
        title,
        image: imgUrl,
        content,
        latitude: state.draft.latitude,
        longitude: state.draft.longitude
      };
      const { createPin } = await client.request(CREATE_PIN_MUTATION, variables);
      console.log("pin created", createPin);
      handleDiscard();
    } catch (e) {
      setSubmitting(false);
      console.error("error creating pin", e);
    }
  };

  return (
    <form className={classes.form}>
      <Typography className={classes.alignCenter} component="h2" variant="h4" color="secondary">
        <LandscapeIcon className={classes.iconLarge} /> Pin a Location
      </Typography>

      <div>
        <TextField name="title" label="title" placeholder="Enter pin title" onChange={e => setTitle(e.target.value)} />

        <input
          id="image"
          accept="image/*"
          type="file"
          className={classes.input}
          onChange={e => setImage(e.target.files[0])}
        />

        <label htmlFor="image">
          <Button component="span" size="small" className={classes.button} style={{ color: image && "green" }}>
            <AddAPhotoIcon />
          </Button>
        </label>
      </div>

      <div className={classes.contentField}>
        <TextField
          name="content"
          label="content"
          multiline
          rows="6"
          margin="normal"
          fullWidth
          variant="outlined"
          onChange={e => setContent(e.target.value)}
        />
      </div>

      <div>
        <Button className={classes.button} variant="contained" color="primary" onClick={handleDiscard}>
          <ClearIcon className={classes.leftIcon} />
          Discard
        </Button>

        <Button
          type="submit"
          className={classes.button}
          variant="contained"
          color="secondary"
          disabled={!title.trim() || !image || !content.trim() || submitting}
          onClick={handleSubmit}
        >
          Submit
          <SaveIcon className={classes.rightIcon} />
        </Button>
      </div>
    </form>
  );
};

const styles = theme => ({
  form: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    paddingBottom: theme.spacing.unit
  },
  contentField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "95%"
  },
  input: {
    display: "none"
  },
  alignCenter: {
    display: "flex",
    alignItems: "center"
  },
  iconLarge: {
    fontSize: 40,
    marginRight: theme.spacing.unit
  },
  leftIcon: {
    fontSize: 20,
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    fontSize: 20,
    marginLeft: theme.spacing.unit
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit,
    marginLeft: 0
  }
});

export default withStyles(styles)(CreatePin);

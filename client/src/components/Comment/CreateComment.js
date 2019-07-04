import React, { useState, useContext } from "react";
import { withStyles } from "@material-ui/core";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import SendIcon from "@material-ui/icons/Send";
import Divider from "@material-ui/core/Divider";

import AppContext from "../../context";
import { CREATE_COMMENT_MUTATION } from "../../graphql/mutations";
import { useClient } from "../../graphql/client";

const CreateComment = ({ classes }) => {
  const client = useClient();
  const { state, dispatch } = useContext(AppContext);
  const [comment, setComment] = useState("");

  const handleCommentSubmit = async () => {
    const variables = { pinId: state.currentPin._id, text: comment };
    const { createComment } = await client.request(CREATE_COMMENT_MUTATION, variables);
    dispatch({ type: "CREATE_COMMENT", payload: createComment });
    setComment("");
  };

  return (
    <>
      <form className={classes.form}>
        <IconButton
          className={classes.clearButton}
          disabled={!comment.trim()}
          onClick={() => setComment("")}
        >
          <ClearIcon />
        </IconButton>

        <InputBase
          multiline
          className={classes.input}
          placeholder="Add Comment"
          onChange={e => setComment(e.target.value)}
          value={comment}
        />

        <IconButton
          className={classes.sendButton}
          onClick={handleCommentSubmit}
          disabled={!comment.trim()}
        >
          <SendIcon />
        </IconButton>
      </form>
      <Divider />
    </>
  );
};

const styles = theme => ({
  form: {
    display: "flex",
    alignItems: "center"
  },
  input: {
    marginLeft: 8,
    flex: 1
  },
  clearButton: {
    padding: 0,
    color: "red"
  },
  sendButton: {
    padding: 0,
    color: theme.palette.secondary.dark
  }
});

export default withStyles(styles)(CreateComment);

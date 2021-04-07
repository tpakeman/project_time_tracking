import React, { useState } from "react";
import { useStyles } from "./common/styles";
import Modal from "@material-ui/core/Modal";
import Card from "@material-ui/core/Card";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";

export const PasswordEntry = (props) => {
  const classes = useStyles();
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState(undefined);

  const handleChange = (e) => {
    setPassword(e.target.value);
    setErrorText(undefined);
  };

  const handleLogin = () => {
    if (password == process.env.PASSWORD) {
      props.auth(true);
    } else {
      setErrorText("Incorrect Password!");
    }
  };
  return (
    <Modal open className={classes.passwordModal}>
      <Card className={classes.cardTimer}>
        <Box display="flex" flexDirection="row" justifyContent="space-around">
          <TextField
            id="outlined-basic"
            label="Password"
            variant="outlined"
            style={{ width: "65%" }}
            value={password}
            onChange={handleChange}
            error={errorText !== undefined}
            helperText={errorText}
            type="password"
          />
          <Button
            onClick={handleLogin}
            style={{ width: "30%" }}
            variant="contained"
            color="primary"
          >
            Log in
          </Button>
        </Box>
      </Card>
    </Modal>
  );
};

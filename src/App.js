import React from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { TrackerMain } from "./Tracking/Timer";
import { useStyles } from "./Tracking/common/styles";

const Copyright = () => {
  const curYear = new Date().getFullYear();
  return (
    <Typography variant="body2" color="textSecondary">
      Copyright © Tom Pakeman {curYear}
    </Typography>
  );
};

export const App = () => {
  const classes = useStyles();
  return (
    <div id="app-container" className={classes.appContainer}>
      <Container component="main" className={classes.main} maxWidth="lg">
        <TrackerMain />
      </Container>
      <footer className={classes.footer}>
        <Container maxWidth="md">
          <Typography variant="body1"></Typography>
          <Copyright />
        </Container>
      </footer>
    </div>
  );
};

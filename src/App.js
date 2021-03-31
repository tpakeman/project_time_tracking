import React from 'react'
import Container from '@material-ui/core/Container'
import { TrackerMain } from './Tracking/Timer'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    appContainer: {
        display: 'flex',
        flexDirection: 'column', 
        minHeight: '100vh'
    },
    main: {
        marginTop: theme.spacing(8),
        marginBottom: theme.spacing(2),
    },
    footer: {
      padding: theme.spacing(3, 2),
      marginTop: 'auto',
      backgroundColor:
        theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
    },
  }));


  const Copyright = () => {
    const curYear = new Date().getFullYear();
    return (
        <Typography variant="body2" color="textSecondary">Copyright © Tom Pakeman {curYear}</Typography>
    )
  }


  export const App = () => {
    const classes = useStyles();
    return (
        <div id="app-container" className={classes.appContainer}>
            <Container component='main' className={classes.main} maxWidth="md">
                <TrackerMain/>
            </Container>
            <footer className={classes.footer}>
                <Container maxWidth="md">
                    <Typography variant="body1"></Typography>
                    <Copyright />
                </Container>
            </footer>
        </div>
    )
}
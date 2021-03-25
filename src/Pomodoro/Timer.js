import React, { useState } from 'react'
import Card from '@material-ui/core/Card'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
const TIMEINTERVAL = 1000; // ms
const useStyles = makeStyles((theme) => ({
    cardTimer: {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(2)
    },
    taskInput: {
        padding: theme.spacing(1)
    },
    cardHeader: {
        paddingBottom: theme.spacing(1)
    }
  }));


const Task = () => {
    return (
        <TextField id="outlined-basic" label="What task are you working on?" variant="outlined" />
    )
}

const ButtonMain = (props) => {
    // TO DO --> https://www.digitalocean.com/community/tutorials/react-countdown-timer-react-hooks
    const [isRunning, setIsRunning] = useState(false)
    const [displayTime, setDisplayTime] = useState(undefined)
    const handleClick = () => {
        setIsRunning(() => !isRunning)
        startTimer()
        props.handleClick()
    }

    return (
        <Box padding={0, 1} mx='auto'>
        <Button
            variant='contained'
            color='secondary'
            size='large'
            onClick={handleClick}
            disabled={isRunning} // Replace with timer ticking down
        >
            {isRunning ? displayTime : 'Start Timer'}
        </Button>
        </Box>
    )
}

const ButtonSecondary = (props) => {
    return (
        <Box padding={0, 1} display='flex' flexDirection='row' justifyContent='space-around'>
            <Button variant='outlined'>Pause</Button>
            <Button variant='outlined'>Stop</Button>
            <Button variant='outlined'>Next</Button>
        </Box>
    )
}

export const PomodoroMain = () => {
    const [isRunning, setIsRunning] = useState(false)
    const classes = useStyles();

    const handleMainButtonClick = () => {
        setIsRunning(() => !isRunning)
    }

    return (
        <Card className={classes.cardTimer} mx='auto'>
            <Box className={classes.cardHeader}>
                <Typography component="h1" variant="h4">ReactPomodoro</Typography>
            </Box>
            <Task className={classes.taskInput}/>
            <ButtonMain
                handleClick={handleMainButtonClick}
                totalTime={25}
            />
            {isRunning && <ButtonSecondary/>}
        </Card>
    )
}
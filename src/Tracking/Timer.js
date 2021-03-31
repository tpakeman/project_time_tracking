import React, { useEffect, useState, useRef } from 'react'
import Card from '@material-ui/core/Card'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import PlayCircleFilled from '@material-ui/icons/PlayCircleFilled';
import PauseCircleFilled from '@material-ui/icons/PauseCircleFilled';
import Clear from '@material-ui/icons/Clear';
import Delete from '@material-ui/icons/Delete';
import {cloneDeep} from 'lodash'

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    cardTimer: {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(2),
        marginBottom: theme.spacing(3)
    },
    addProject: {
        padding: theme.spacing(1)
    },
    cardHeader: {
        paddingBottom: theme.spacing(1)
    },
    projectList: {
        padding: theme.spacing(2)
    },
    bottomButtonContainer: {
        float: 'right',
        padding: theme.spacing(2),
    },
    bottomButton: {margin: theme.spacing(1)},
    clearallButton: {color: 'white', backgroundColor: theme.palette.success.main},
    projectRowRunning: {
        '&:hover': {backgroundColor: theme.palette.error.light},
        backgroundColor: theme.palette.success.light
    },
    projectRowNotRunning: {
        '&:hover': {backgroundColor: theme.palette.success.light},
    }
  }));


const AddProject = (props) => {
    const [projectName, setProjectName] = useState('')
    const [errorText, setErrorText] = useState(undefined)
    // Check if the project is already in props.existingProjects
    const handleChange = (e) => {
        setErrorText(undefined)
        setProjectName(e.target.value)
    }

    const handleAddProject = () => {
        if (!props.existingProjects.includes(projectName.toLowerCase())) {
            setProjectName('')
            props.addProject(projectName)
        }
        else {
            setErrorText('Project already exists!')
        }
    }

    return (
        <Box display='flex' flexDirection='row' justifyContent='space-around'>
            <TextField
                id="outlined-basic"
                label="Project Name"
                variant="outlined"
                style={{width: '75%'}}
                value={projectName}
                onChange={handleChange}
                error={errorText !== undefined}
                helperText={errorText}
                />
            <Button
                color='primary'
                variant='contained'
                size='large'
                onClick={handleAddProject}
                disabled={projectName.length == 0}
            >
                Add Project
            </Button>
        </Box>
    )
}

const Projects = (props) => {
    const classes = useStyles()
    const [currentRunning, setCurrentRunning] = useState(undefined)

    const handleRunUpdate = (projectKey) => {
        setCurrentRunning(projectKey)
    }
    
    const handleUpdateTime = (projectKey, newTime) => {
        props.handleUpdateTime(projectKey, newTime)
    }

    return (
        <Card mx='auto' className={classes.projectList}>
            <List>
                {Object.keys(props.data).map(p => {
                    return (
                    <ProjectRow
                        key={p}
                        handleRunUpdate={handleRunUpdate}
                        handleUpdateTime={handleUpdateTime}
                        currentRunning={currentRunning}
                        data={props.data[p]}
                        deleteProject={props.deleteProject}
                    />
                    )
                })}
            </List>
        </Card>
    )
}

const ProjectRow = (props) => {
    const todayDOW = new Date().getDay()
    const [isRunning, setIsRunning] = useState(false)
    const [totalTime, setTotalTime] = useState(props.data.elapsedTime[todayDOW])
    const classes = useStyles()

    let timer = useRef(null)
    let startTime = useRef(null)
    
    const formatTime = (ms) => {
        return new Date(ms).toISOString().substr(11, 8)
    }

    const startTimer = () => {
        setIsRunning(true)
        startTime.current = new Date().getTime()
        props.handleRunUpdate(props.data.id)
        timer.current = (setInterval(() => {
            setTotalTime(() => (totalTime + (new Date().getTime() - startTime.current)))
        }, 1000));
      };

    const stopTimer = () => {
        setIsRunning(false)
        clearInterval(timer.current);
        props.handleRunUpdate(undefined)
        props.handleUpdateTime(props.data.id, todayDOW, totalTime)
      };

    const resetTimer = () => {
        setTotalTime(0)
        props.handleUpdateTime(props.data.id, totalTime)
      };


    const handlePauseClick = () => {
        !isRunning ? startTimer() : stopTimer()
    }

    const handleClearClick = () => {
        resetTimer()
    }

    const handleDeleteClick = () => {
        props.deleteProject(props.data.id)
    }

    let activeClass = isRunning ? classes.projectRowRunning : classes.projectRowNotRunning

    return (
        <ListItem className={activeClass} button>
            <ListItemText
                primary={props.data.name}
                secondary={formatTime(totalTime)}
                onClick={handlePauseClick}    
            />
            <ListItemIcon onClick={handlePauseClick}>
                {isRunning ? <PauseCircleFilled />: <PlayCircleFilled/>}
            </ListItemIcon>
            <ListItemIcon onClick={handleClearClick}>
                <Clear/>
            </ListItemIcon>
            <ListItemIcon onClick={handleDeleteClick}>
                <Delete/>
            </ListItemIcon>
        </ListItem>
    )
}

const BottomButtons = (props) => {
    const classes = useStyles()
    return (
        <Box className={classes.bottomButtonContainer}>
            <Button
                variant='contained'
                color='secondary'
                className={classes.bottomButton}
                onClick={props.handleClearAll}    
            >Clear All</Button>
            <Button
                variant='contained'
                className={`${classes.bottomButton} ${classes.clearallButton}`}
                onClick={props.handleExport}    
            >Export</Button>
        </Box>
    )
}

export const TrackerMain = () => {
    const classes = useStyles()
    const [projects, setProjects] = useState({})
    const [maxID, setMaxID] = useState(0)

    const addProject = (projectName) => {
        let tmp = {...projects}
        tmp[maxID] = {id: maxID, name: projectName, elapsedTime: {1:0,2:0,3:0,4:0,5:0,6:0,7:0}}
        setProjects(tmp)
        setMaxID(() => maxID + 1)
    }

    const handleUpdateTime = (projectKey, dayKey, newTime) => {
        let tmp = cloneDeep(projects)
        tmp[projectKey].elapsedTime[dayKey] = newTime
        setProjects(tmp)
    }

    const deleteProject = (projectKey) => {
        let tmp = cloneDeep(projects)
        delete tmp[projectKey]
        setProjects(tmp)
    }

    const handleExport = () => {
        alert('TO DO: Export to csv!')
    }

    const handleClearAll = () => {
        setProjects({})
    }

    return (
        <>
        <Card className={classes.cardTimer} mx='auto'>
            <Box className={classes.cardHeader}>
                <Typography component="h1" variant="h4">PS Time Tracking</Typography>
            </Box>
            <AddProject
                className={classes.addProject}
                addProject={addProject}
                existingProjects={Object.values(projects).map(p => p.name.toLowerCase())}
                />
        </Card>
        {Object.keys(projects).length > 0 &&
        <>
            <Projects
                data={projects}
                handleUpdateTime={handleUpdateTime}
                deleteProject={deleteProject}
            />
            <BottomButtons
                handleExport={handleExport}
                handleClearAll={handleClearAll}
            />
        </>
        }
        </>
    )
}
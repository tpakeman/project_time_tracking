import React, { useEffect, useState } from 'react'
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
    exportButtonContainer: {
        float: 'right',
        padding: theme.spacing(2),
    },
    exportButton: {
        backgroundColor:theme.palette.success.main,
        color: 'white'
    },
    projectRowRunning: {
            '&:hover': {backgroundColor: theme.palette.error.light},
        },
        projectRowNotRunning: {
            '&:hover': {backgroundColor: theme.palette.success.light},
        }
  }));


const AddProject = (props) => {
    const [projectName, setProjectName] = useState('')
    // Check if the project is already in props.existingProjects
    const handleChange = (e) => {
        setProjectName(e.target.value)
    }

    const handleAddProject = () => {
        setProjectName('')
        props.addProject(projectName)
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
            />
            <Button
                variant='contained'
                color='secondary'
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
                    />
                    )
                })}
            </List>
        </Card>
    )
}

const ProjectRow = (props) => {
    const [isRunning, setIsRunning] = useState(false)
    const [totalTime, setTotalTime] = useState(props.data.elapsedTime)
    const [startTime, setStartTime] = useState(new Date().getTime())
    const [timer, setTimer] = useState(undefined)
    const classes = useStyles()

    const formatTime = () => {
        return new Date(totalTime).toISOString().substr(11, 8)
    }

    const startTimer = () => {
        props.handleRunUpdate(props.data.id)
        setIsRunning(true)
        setStartTime(new Date().getTime())
        setTimer(setInterval(() => {
            setTotalTime(() => (totalTime + (new Date().getTime() - startTime)))
        }, 1000));
      };

    const stopTimer = () => {
        props.handleRunUpdate(undefined)
        setIsRunning(false)
        clearInterval(timer);
        props.handleUpdateTime(props.data.id, totalTime)
      };

    const resetTimer = () => {
        setTotalTime(0)
      };


    const handleClick = () => {
        !isRunning ? startTimer() : stopTimer()
    }

    let activeClass = isRunning ? classes.projectRowRunning : classes.projectRowNotRunning

    return (
        <ListItem className={activeClass} button>
            <ListItemText
                primary={props.data.name}
                secondary={formatTime()}
                onClick={handleClick}    
            />
            <ListItemIcon onClick={handleClick}>
                {isRunning ? <PauseCircleFilled />: <PlayCircleFilled/>}
            </ListItemIcon>
        </ListItem>
    )
}

const ExportButton = (props) => {
    const classes = useStyles()
    return (
        <Box className={classes.exportButtonContainer}>
            <Button
                variant='contained'
                className={classes.exportButton}
                onClick={() => {alert('TO DO: Export to csv!')}}    
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
        tmp[maxID] = {id: maxID, name: projectName, elapsedTime: 0}
        setProjects(tmp)
        setMaxID(() => maxID + 1)
    }

    const handleUpdateTime = (projectKey, newTime) => {
        let tmp = cloneDeep(projects)
        tmp[projectKey].elapsedTime = newTime
        setProjects(tmp)
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
                existingProjects={Object.values(projects).map(p => p.name)}
                />
        </Card>
        {Object.keys(projects).length > 0 &&
        <>
            <Projects
                data={projects}
                handleUpdateTime={handleUpdateTime}
            />
            <ExportButton/>
        </>
        }
        </>
    )
}
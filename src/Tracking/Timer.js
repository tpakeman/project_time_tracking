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
import { DataGrid } from '@material-ui/data-grid';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import Clear from '@material-ui/icons/Clear';
import Delete from '@material-ui/icons/Delete';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import MoneyOff from '@material-ui/icons/MoneyOff';
import Checkbox from '@material-ui/core/Checkbox';
import TocIcon from '@material-ui/icons/Toc';
import TimerIcon from '@material-ui/icons/Timer';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { cloneDeep, sum, difference } from 'lodash'
import { green } from '@material-ui/core/colors';
import Modal from '@material-ui/core/Modal';
import {CSVLink} from 'react-csv';
import { makeStyles } from '@material-ui/core/styles';

const DAYS = {1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday', 7: 'Sunday'}
const DEFAULTS = ['Company Meetings', 'Professional Development', 'Sales Support', 'Team Development', 'Strategic Projects']

// TODO - move to a utilities file
const convertToNearestHour = (n, precision=4) => {
    let msHour = (60 * 60 * 1000)
    return Math.round((n / msHour) * precision) / precision
 }

const convertForExport = (data) => {
    let readyData = []
    let ix = 0
    Object.values(data).forEach(p => {
        let row = {id: ix, Project: p.name, Billable: p.billable}
        Object.keys(p.elapsedTime).forEach(d => {
            row[DAYS[d]] = convertToNearestHour(p.elapsedTime[d])
        })
        readyData.push(row)
        ix += 1
    })
    return readyData
}


const useStyles = makeStyles((theme) => ({
    passwordModal: {
        padding: theme.spacing(2, 4, 3),
        maxWidth: '35%'
    },
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
        padding: theme.spacing(2)
    },
    projectList: {
        padding: theme.spacing(2)
    },
    dataGrid: {
        width: '90vw',
        minHeight: '500px',
    },
    bottomButtonContainer: {
        float: 'right',
        padding: theme.spacing(2),
    },
    bottomButton: {margin: theme.spacing(1)},
    clearallButton: {color: 'white', backgroundColor: theme.palette.success.main},
    addDefaultButton: {color: 'white', backgroundColor: theme.palette.warning.main},
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
    const [billable, setBillable] = useState(true)
    // Check if the project is already in props.existingProjects
    const handleChange = (e) => {
        setErrorText(undefined)
        setProjectName(e.target.value)
    }

    const handleAddProject = () => {
        if (!props.existingProjects.includes(projectName.toLowerCase())) {
            setProjectName('')
            props.addProject(projectName, billable)
        }
        else {
            setErrorText('Project already exists!')
        }
    }

    const handleCheck = () => {
        setBillable(() => !billable)
    }

    return (
        <Box display='flex' flexDirection='row' justifyContent='space-around'>
            <TextField
                id="outlined-basic"
                label="Project Name"
                variant="outlined"
                style={{width: '65%'}}
                value={projectName}
                onChange={handleChange}
                error={errorText !== undefined}
                helperText={errorText}
                />
                <FormControlLabel
                    control={<Checkbox checked={billable} onChange={handleCheck} name="billable" />}
                    label="billable?"
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
    
    return (
        <Card mx='auto' className={classes.projectList}>
            <List>
                {Object.keys(props.data).map(p => {
                    return (
                    <ProjectRow
                        key={p}
                        handleRunUpdate={handleRunUpdate}
                        handleUpdateTime={props.handleUpdateTime}
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
    const [totalTime, setTotalTime] = useState(props.data.totalTime)
    const [todayTime, setTodayTime] = useState(props.data.elapsedTime[todayDOW])
    const [isOpen, setIsOpen] = useState(false);
    const classes = useStyles()

    let timer = useRef(null)
    let startTime = useRef(null)
    
    const formatTime = (ms) => {
        return new Date(ms).toISOString().substr(11, 8)
    }

    const calcTotal = () => {
        return sum(Object.values(props.data.elapsedTime))
    }

    const startTimer = () => {
        setIsRunning(true)
        startTime.current = new Date().getTime()
        props.handleRunUpdate(props.data.id)
        timer.current = (setInterval(() => {
            let newToday = (todayTime + (new Date().getTime() - startTime.current))
            setTodayTime(() => newToday)
            setTotalTime(() => calcTotal() + newToday)
        }, 1000));
      };

    const stopTimer = () => {
        setIsRunning(false)
        clearInterval(timer.current);
        props.handleRunUpdate(undefined)
        props.handleUpdateTime(props.data.id, todayDOW, todayTime, totalTime)
      };

    const resetTimer = () => {
        setTotalTime(calcTotal() - todayTime)
        setTodayTime(0)
        stopTimer()
      };

    const handleRowClick = () => {
        setIsOpen(() => !isOpen);
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
        <>
        <ListItem className={activeClass} button>
            <ListItemIcon>
                {props.data.billable ? <AttachMoneyIcon style={{color: green[500]}} /> : <MoneyOff/>}
                </ListItemIcon>
            <ListItemText
                primary={props.data.name}
                secondary={`Total: ${formatTime(totalTime)}`}
                onClick={handleRowClick}    
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
            {isOpen ? <ExpandLess onClick={handleRowClick}/> : <ExpandMore onClick={handleRowClick} />}
            </ListItem>
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <List dense disablePadding>
                {Object.keys(props.data.elapsedTime).map(t => {
                    return (
                        <ListItem button key={t}>
                          <ListItemText
                            primary={DAYS[t]}
                            secondary={formatTime(t == todayDOW ? totalTime : props.data['elapsedTime'][t])}
                            // Secondary = time on that day
                            // secondary={formatTime(totalTime)}
                            />
                        </ListItem>
                    )})}
                </List>
            </Collapse>
            </>
    )
}

const BottomButtons = (props) => {
    const classes = useStyles()
    return (
        <Box className={classes.bottomButtonContainer}>
            <Button
                variant='contained'
                className={`${classes.bottomButton} ${classes.addDefaultButton}`}
                onClick={props.addDefaults}    
            >Add defaults</Button>
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
                disabled={!props.hasData}
            >Export</Button>
            <Button
                variant='contained'
                className={classes.bottomButton}
                onClick={props.handleLogout}
            >Log Out</Button>
        </Box>
    )
}

const PasswordEntry = (props) => {
    const classes = useStyles();
    const [password, setPassword] = useState('')
    const [errorText, setErrorText] = useState(undefined)

    const handleChange = (e) => {
        setPassword(e.target.value)
        setErrorText(undefined)
    }

    const handleLogin = () => {
        if (password == 'looker') {
            props.auth(true)
        } else {
            setErrorText('Incorrect Password!')
        }
    }
    return (
        <Modal open className={classes.passwordModal}>
            <Card className={classes.cardTimer}>
                <Box display='flex' flexDirection='row' justifyContent='space-around'>
                    <TextField
                    id="outlined-basic"
                    label="Password"
                    variant="outlined"
                    style={{width: '65%'}}
                    value={password}
                    onChange={handleChange}
                    error={errorText !== undefined}
                    helperText={errorText}
                    type="password"
                    />
                    <Button
                        onClick={handleLogin}
                        style={{width: '30%'}}
                        variant='contained'
                        color='primary'
                    >Log in</Button>
                </Box>
            </Card>
        </Modal>
    )
}

const TrackerInner = (props) => {
    const classes = useStyles()
    const [projects, setProjects] = useState({})
    const [maxID, setMaxID] = useState(0)
    const [exportData, setExportData] = useState([])
    const [activePage, setActivePage] = useState(0)
    const handleActivePageChange = (_e, v) => {
        setActivePage(v)
    }

    const downloadLink = useRef(null)

    const addProject = (projectName, billable=false) => {
        let tmp = {...projects}
        tmp[maxID] = {id: maxID, name: projectName, totalTime: 0, elapsedTime: {1:0,2:0,3:0,4:0,5:0,6:0,7:0}, billable: billable}
        setProjects(tmp)
        setMaxID(() => maxID + 1)
    }

    const addProjects = (projectArray) => {
        let tmp = {...projects},
        tmpMaxID = maxID
        projectArray.forEach((p) => {
            tmp[tmpMaxID] = {id: tmpMaxID, name: p, totalTime: 0, elapsedTime: {1:0,2:0,3:0,4:0,5:0,6:0,7:0}}
            tmpMaxID += 1
        })
        setProjects(tmp)
        setMaxID(() => tmpMaxID + 1)
    }



    const handleUpdateTime = (projectKey, dayKey, dayTime, totalTime) => {
        let tmp = cloneDeep(projects)
        tmp[projectKey].elapsedTime[dayKey] = dayTime
        tmp[projectKey].totalTime = totalTime
        setProjects(tmp)
    }

    const deleteProject = (projectKey) => {
        let tmp = cloneDeep(projects)
        delete tmp[projectKey]
        setProjects(tmp)
    }


    const handleClearAll = () => {
        setProjects({})
    }

    const addDefaults = () => {
        let newProjects = difference(DEFAULTS, Object.values(projects).map(p => p.name))
        if (newProjects.length > 0) {
            addProjects(newProjects)
       }
    }

    const handleLogout = () => {
        props.auth(false)
    }

    const getCurWeek = () => {
        let d = new Date();
        let day = d.getDay()
        let diff = d.getDate() - day + (day == 0 ? -6:1)
        let r = new Date(d.setDate(diff))
        return `${r.getFullYear()}-${r.getMonth()}-${r.getDate()}`
    }

    const makeFileName = () => {
        return `Looker Time Logging - ${getCurWeek()}.csv`
    }

    const handleExport = () => {
        setExportData(convertForExport(projects))
        setTimeout(() => {
            downloadLink.current.link.click()
        }, 500)
    }

    return (
        <>
            <Tabs
                value={activePage}
                indicatorColor="primary"
                textColor="primary"
                onChange={handleActivePageChange}
                centered
                >
                <Tab label="Log Time" icon={<TimerIcon/>}/>
                <Tab
                    label="View Data" disabled={Object.keys(projects).length == 0}
                    icon={<TocIcon/>}
                />
            </Tabs>
            <div style={{display: activePage == 0 ? 'block' : 'none'}}>
            <Card className={classes.cardTimer} mx='auto'>
                <Box className={classes.cardHeader}>
                    <Typography component="h4" variant="h4">PS Time Tracking</Typography>
                    <Typography component="h6" variant="h6">{`W/C ${getCurWeek()}`}</Typography>
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
                <CSVLink
                    ref={(r) => {downloadLink.current = r}}
                    data={exportData}
                    filename={makeFileName()}
                    target="_blank"
                    style={{display:'none'}}
                />
                </>
            }
                <BottomButtons
                    handleExport={handleExport}
                    handleClearAll={handleClearAll}
                    addDefaults={addDefaults}
                    handleLogout={handleLogout}
                    hasData={Object.keys(projects).length > 0}
                />
            
            </div>
            <div>
                <DataPage
                    active={activePage == 1}
                    data={projects}
                />
            </div>
        </>
    )
}

const DataPage = (props) => {
    const classes = useStyles()
    let data = convertForExport(props.data)
    data.forEach(d => {
        let tmp = Object.keys(d).filter(k => Object.values(DAYS).includes(k)).map(k => Number(d[k]))
        d.Total = sum(tmp)
    })
    const columns = [
        { field: 'Project', headerName: 'Name', width: 300 },
        {
            field: 'Billable',
            headerName: '$',
            width: 60,
            valueFormatter: (v) => v.value == undefined ? '' : '$'
        },
        { field: 'Monday', headerName: 'M', type: 'number', width: 90 },
        { field: 'Tuesday', headerName: 'T', type: 'number', width: 90 },
        { field: 'Wednesday', headerName: 'W', type: 'number', width: 90 },
        { field: 'Thursday', headerName: 'Th', type: 'number', width: 90 },
        { field: 'Friday', headerName: 'F', type: 'number', width: 90 },
        { field: 'Saturday', headerName: 'S', type: 'number', width: 90 },
        { field: 'Sunday', headerName: 'Su', type: 'number', width: 90 },
        { field: 'Total', headerName: 'Total', type: 'number', width: 150 },
      ];
    return (
        <div style={{'display': props.active ? 'flex': 'none'}}>
            <DataGrid
                autoHeight
                loading={data.length === 0}
                className={classes.dataGrid}
                rows={data}
                columns={columns}
            />
        </div>
    )
}

export const TrackerMain = () => {
    const [authed, setAuthed] = useState(false)
    return (<>{authed ? 
                <TrackerInner auth={setAuthed}/>
                : <PasswordEntry auth={setAuthed}/> 
            }</>)
}
import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import CommentIcon from '@material-ui/icons/Comment';
import Container from '@material-ui/core/Container';
import Zoom from '@material-ui/core/Zoom';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import Icon from '@material-ui/core/Icon';
import axios from 'axios';
import io from 'socket.io-client';

var socket = io();
socket.emit('chat message', 'tset');
const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    fab: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
    paper: {
        position: 'relative',
        textAlign: 'center',
        display: 'inline-block',
        marginTop: '10%',
        width: '25%',
        minWidth: '300px',
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
    },
    form: {
        '& > *': {
          margin: theme.spacing(1),
          width: '100%',
        },
    },
    button: {
        margin: theme.spacing(1),
    },
}));

export function TaskList() {
    const classes = useStyles();
    const [checked, setChecked] = React.useState([0]);
    const [open, setOpen] = React.useState(false);
    const [taskname, setTaskname] = React.useState('');
    const [taskList, setTaskList] = React.useState([]);
    const [duplicateTask, setDuplicateTask] = React.useState(false);
    const getTasks = () => {
        axios.get('http://localhost:3001/api/getTasks').then(res => {
            setTaskList(res.data.tasks);
        });
    };
    useEffect(() => setInterval(getTasks, 1000), []);
    const handleToggle = value => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
        newChecked.push(value);
        } else {
        newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const add = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
        setDuplicateTask(false);
    }

    const addTask = () => {
        if (taskname){
            setDuplicateTask(false);
            axios.post('http://localhost:3001/api/addTask', { task: taskname }).then(res => {
                setTaskname('');
                setOpen(false);
            }).catch(err => {
                console.log('hello');
                const { response } = err;
                if (response &&     response.data.message === 'DuplicateTask'){
                    setDuplicateTask(true);
                }
            });
        }
    }

    const deleteTask = (taskId) => {
        axios.delete(`http://localhost:3001/api/deleteTask/${taskId}`);
    }

    return (
        <Container>
        <List className={classes.root}>
        {taskList.map && taskList.map(task => {
            const labelId = `checkbox-list-label-${task.name}`;
            return (
            <ListItem key={task.id} role={undefined} dense button onClick={handleToggle(task.name)}>
                <ListItemIcon>
                <Checkbox
                    edge="start"
                    checked={checked.indexOf(task.name) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                />
                </ListItemIcon>
                <ListItemText id={labelId} primary={task.name} />
                <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="trash" >
                    <Icon onClick={() => deleteTask(task.id)}>delete</Icon>
                </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
            );
        })}
        </List>
        <Zoom
            key={'primary'}
            in={true}
            unmountOnExit
        >
            <Fab onClick={add} aria-label={'Add'} className={classes.fab} color={'primary'}>
                <AddIcon /> 
            </Fab>
        </Zoom>
        <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            style={{ textAlign: 'center' }}
            open={open}
            onClose={handleClose}
        >
            <Container className={classes.paper}>
                <form className={classes.form} noValidate autoComplete="off">
                    <TextField id="standard-basic" error={duplicateTask} onKeyPress={e => {
                        if (e.key === 'Enter'){
                            e.preventDefault();
                            addTask();
                        }
                    }} label="task name" helperText={duplicateTask && "task already exist."} onChange={(e) => {setTaskname(e.target.value)}}/>
                    <Icon onClick={addTask}>send</Icon>
                </form>
            </Container>
        </Modal>
        </Container>
    );
}
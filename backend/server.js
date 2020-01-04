const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
var http = require('http').createServer(app);
var io = require('socket.io')(http);
import _ from 'lodash';

const app = express();
const API_PORT = 3001;
app.use(cors());
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

router.post('/login', (req, res) => {
  const { username } = req.body;
  return res.json({ authenticationSuccess: username === 'iamadmin' });
});

let tasks = [];
router.get('/getTasks', (req, res) => {
  res.json({ tasks });
});

io.on('connection', function(socket){
  console.log('a user connected----------------------------------');
});

router.post('/addTask', (req, res, next) => {
  const { task } = req.body;
  console.log(`task added ${task}`);
  if (_.findIndex(tasks, t => t.name === task) !== -1){
    res.status(400).json({
      status: 'validationError',
      message: 'DuplicateTask',
    })
  } else {
    tasks.push({ id: _.uniqueId(), name: req.body.task });
    res.json({ success: true });
  }
});

router.delete('/deleteTask/:id', (req, res) => {
  const { id } = req.params;
  console.log(`${id} deleted`, typeof id);
  console.log(tasks);
  _.remove(tasks, task => task.id === id);
  res.json({ success: true });
});

app.use('/api', router);

app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
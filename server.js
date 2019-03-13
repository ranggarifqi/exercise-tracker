require('dotenv').config();
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')

const mongoose = require('mongoose')
mongoose.connect(process.env.MLAB_URI || 'mongodb://localhost/exercise-track' )

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const UserModel = require('./models/user');
const ExerciseModel = require('./models/exercise');

app.post('/api/exercise/new-user', async function (req, res) {
  const username = req.body.username;

  // Check if username already existed
  try {
    const user = await UserModel.findOne({ username });
    if (user) {
      return res.status(422).json({ error: 'username already exist' })
    }

    const createdUser = await UserModel.create({ username });
    return res.json({ username: createdUser.username, _id: createdUser._id });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

const formatDate = (date) => {
  const dayName = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat' ];
  const monthName = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Des' ];

  const day = date.getDay();
  const tanggal = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  return `${dayName[day]} ${monthName[month]} ${tanggal} ${year}`;
};

app.post('/api/exercise/add', async function (req, res) {
  const userId = req.body.userId;
  const description = req.body.description;
  const duration = req.body.duration;
  let date = new Date(req.body.date);

  const payload = { user: userId, description, duration, date };

  try {
    const exercise = await ExerciseModel.create(payload);
    const user = await UserModel.findOne({ _id: userId });

    return res.json({
      username: user.username,
      description: exercise.description,
      duration: exercise.duration,
      date: formatDate(exercise.date)
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

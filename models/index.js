const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/auth', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})

exports.User = require('./User')(mongoose)

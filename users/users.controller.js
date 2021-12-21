const createError = require('http-errors')
const express = require('express')
const router = express.Router()

// User data model and mongoose connections were configured in models/
const User = require('./models/users.model.js');

const mailer = require('../lib/mailer')
const emailValidator = require('../lib/emailValidator')

router.get('', async (req, res) => {
  try {
    var users = await User.findAll({});
    res.json(users);
  } catch (e) {
    console.error(e.stack)
    return res.status(403).json({
      error: e.message
    })
  }
})

router.get('/:user_id', async (req, res) => {
  try {
    var users = await User.findOne({
      id: req.params.user_id
    });
    res.json(users);
  } catch (e) {
    console.error(e.stack)
    return res.status(403).json({
      error: e.message
    })
  }
})

router.patch('/:user_id', async (req, res) => {
  try {
    let result = await User.update({favorite_cards: req.body.favorite_cards},{
      where: {
        id: req.params.user_id
      }
    });
    res.json(result);
  } catch (e) {
    console.error(e.stack)
    return res.status(403).json({
      error: e.message
    })
  }
})

router.delete('/:user_id', async (req, res) => {
  try {
    let result = await User.destroy({
      where: {
        id: req.params.user_id
      }
    });
    res.json(result);
  } catch (e) {
    console.error(e.stack)
    return res.status(403).json({
      error: e.message
    })
  }
})

router.post('', async (req, res) => {
  try {
    let form = req.body
    let result = User.create({
      email: form.email,
      password: form.password
    });
    res.json(result);
  } catch (e) {
    console.error(e.stack)
    return res.status(403).json({
      error: e.message
    })
  }
})

module.exports = router

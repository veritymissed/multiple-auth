const createError = require('http-errors');
const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// User data model and mongoose connections were configured in models/
var User = require('../models').User;

// Mailgun related configures is confiured in this library lib/
var mailer = require('../lib/mailer')

const emailValidator = require('../lib/emailValidator');

//Get users
router.get('/users', async (req, res) => {
  try {
    var users = await User.find({})
    res.json(users)
  } catch (e) {
    console.error(e.stack);
    return res.status(403).json({
      error: e.message
    })
  }
});

router.delete('/user/:user_id', async (req, res) => {
  try {
    var targetUser = await User.findOne({
      _id: req.params.user_id
    })
    if(!targetUser) throw(createError("User has been delted or not found."))
    await targetUser.remove()

    var users = await User.find({})
    res.json(users)
  } catch (e) {
    console.error(e.stack);
    return res.status(403).json({
      error: e.message
    })
  }
})

// User login
router.post('/login', async (req, res) => {
  try {
    var form = req.body;
    if(!form.email) throw(createError("Email missed !"))
    if(!form.password) throw(createError("Password missed !"))
    var existed_user = await User.findOne({
      email: form.email
    })
    if (!existed_user) throw(createError("Email not found !"))
    if (existed_user.password !== form.password) throw(createError("Password incorrect !"))

    req.session.isLogin = true;
    req.session.user = existed_user;

    res.json({token: existed_user._id})
    // res.redirect('/')
  } catch (e) {
    console.error(e.stack);
    return res.status(403).json({
      error: e.message
    })
  }
})

//User register
router.post('/register', async (req, res) => {
  try {
    var form = req.body;
    if(!form.email) throw(createError("Email missed !"))
    if(emailValidator(form.email) === null) throw(createError("Email format error!"))
    if(!form.password) throw(createError("Password missed !"))
    if(!form.passwordRe) throw(createError("Password repeat missed !"))
    if(!form.passwordRe || form.passwordRe !== form.password) throw(createError("Password repeat not match!"))
    if(form.password.length < 8) throw(createError(`Your password length is ${form.password.length},password must be longer than 8 characters !`))
    if (!form.username || form.username.length === 0) throw(createError("User name missed !"))

    var existed_user = await User.findOne({email: form.email})
    if (existed_user) throw(createError("Email has been registered !"))

    var newUserObj = {
      email: form.email,
      password: form.password,
      coupon: ['coupon1']
    }
    var newUser = new User(newUserObj)
    await newUser.save()

    const msg = {
      from: 'multiple-auth platform <auth@sandbox0040a7cdf8614a9aaad8ea35b3efb452.mailgun.org>',
	    to: newUserObj.email,
	    subject: `[multiple-auth] Register success !`,
	    text: `Register with ${newUserObj.email} success !`
    }
    await mailer.sendMail(msg)

    // var users = await User.find({})
    // res.json(users)
    res.json({token: newUser._id})
  } catch (e) {
    console.error(e.stack);
    return res.status(403).json({
      error: e.message
    })
  }
})

router.get('/logout', async (req, res) => {
  try {
    await req.session.destroy();
    res.redirect('/')
  } catch (e) {
    console.error(e.stack);
    return res.status(403).json({
      error: e.message
    })
  }
})

module.exports = router;

const createError = require('http-errors')
const express = require('express')
const router = express.Router()

// User data model and mongoose connections were configured in models/
const User = require('../models').User

const mailer = require('../lib/mailer')
const emailValidator = require('../lib/emailValidator')

router.get('/users', async (req, res) => {
  try {
    var users = await User.find({})
    res.json(users)
  } catch (e) {
    console.error(e.stack)
    return res.status(403).json({
      error: e.message
    })
  }
})

router.delete('/user/:user_id', async (req, res) => {
  try {
    var targetUser = await User.findOne({
      _id: req.params.user_id
    })
    if (!targetUser) throw (createError('User has been delted or not found.'))
    await targetUser.remove()

    var users = await User.find({})
    res.json(users)
  } catch (e) {
    console.error(e.stack)
    return res.status(403).json({
      error: e.message
    })
  }
})

router.post('/login', async (req, res) => {
  try {
    var form = req.body
    if (!form.email) throw (createError('Email missed !'))
    if (!form.password) throw (createError('Password missed !'))
    var existedUser = await User.findOne({
      email: form.email
    })
    if (!existedUser) throw (createError('Email not found !'))
    if (existedUser.password !== form.password) throw (createError('Password incorrect !'))

    req.session.isLogin = true
    req.session.user = existedUser

    res.json({ token: existedUser._id })
    // Todo: rediect to root after the pre-interview homework
    // res.redirect('/')
  } catch (e) {
    console.error(e.stack)
    return res.status(403).json({
      error: e.message
    })
  }
})

router.post('/register', async (req, res) => {
  try {
    var form = req.body
    if (!form.email) throw (createError('Email missed !'))
    if (!emailValidator(form.email)) throw (createError('Email format error!'))
    if (!form.password) throw (createError('Password missed !'))
    if (!form.passwordRe) throw (createError('Password repeat missed !'))
    if (!form.passwordRe || form.passwordRe !== form.password) throw (createError('Password repeat not match!'))
    if (form.password.length < 8) throw (createError(`Your password length is ${form.password.length},password must be longer than 8 characters !`))
    if (!form.username || form.username.length === 0) throw (createError('User name missed !'))

    var existedUser = await User.findOne({ email: form.email })
    if (existedUser) throw (createError('Email has been registered !'))

    var newUserObj = {
      email: form.email,
      password: form.password,
      coupon: ['coupon1']
    }
    var newUser = new User(newUserObj)
    await newUser.save()

    const msg = {
      from: `multiple-auth platform <${process.env.MAILGUN_DOMAIN}>`,
      to: newUserObj.email,
      subject: '[multiple-auth] Register success !',
      text: `Register with ${newUserObj.email} success !`
    }
    await mailer.sendMail(msg)

    res.json({ token: newUser._id })

    // Todo: sending user-list after the pre-interview homework
    // var users = await User.find({})
    // res.json(users)
  } catch (e) {
    console.error(e.stack)
    return res.status(403).json({
      error: e.message
    })
  }
})

router.get('/logout', async (req, res) => {
  try {
    await req.session.destroy()
    res.redirect('/')
  } catch (e) {
    console.error(e.stack)
    return res.status(403).json({
      error: e.message
    })
  }
})

module.exports = router

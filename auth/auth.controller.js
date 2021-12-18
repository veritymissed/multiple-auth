const createError = require('http-errors');
const express = require('express');
const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    // var form = req.body
    // if (!form.email) throw (createError('Email missed !'))
    // if (!form.password) throw (createError('Password missed !'))
    // var existedUser = await User.findOne({
    //   email: form.email
    // })
    // if (!existedUser) throw (createError('Email not found !'))
    // if (existedUser.password !== form.password) throw (createError('Password incorrect !'))
    //
    // req.session.isLogin = true
    // req.session.user = existedUser
    //
    // res.json({ token: existedUser._id })
    // Todo: rediect to root after the pre-interview homework
    // res.redirect('/')
    res.send('POST /auth/login');
  } catch (e) {
    console.error(e.stack)
    return res.status(403).json({
      error: e.message
    })
  }
})

router.post('/logout', async (req, res) => {
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

module.exports = router;

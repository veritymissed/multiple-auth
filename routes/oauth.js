const express = require('express');
const router = express.Router();
const createError = require('http-errors');
require('dotenv').config();

const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('../models').User;

// Mailgun related configures is confiured in this library lib/
const mailer = require('../lib/mailer')

// Configure the Facebook strategy for use by Passport.
passport.use(new FacebookStrategy({
    clientID: process.env['FACEBOOK_APP_ID'],
    clientSecret: process.env['FACEBOOK_APP_CLIENT_SECRET'],
    callbackURL: `${process.env['APP_URL']}/oauth/facebook/callback`,
    profileFields: ['id', 'displayName', 'photos', 'email'],
    enableProof: true
  },
  async function(accessToken, refreshToken, profile, done) {
    // In this example, the user's Facebook profile is supplied as the user
    // record.  In a production-quality application, the Facebook profile should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.
    // console.log("Facebook user profile", profile);
    try {
      var userDataObj = profile._json
      console.log("Facebook userDataObj", userDataObj);
      var existed_user = await User.findOne({email: userDataObj.email})
      if (existed_user) {
        if(existed_user.facebookId === userDataObj.id) {console.log("Login with facebook success!"); return done(null, existed_user)}
        else throw(createError(403, "Email has been registered !"))
      }
      else{
        var newUserObj = {
          email: userDataObj.email,
          name: userDataObj.name,
          facebookId: userDataObj.id,
          coupon: ['coupon1']
        }
        var newUser = new User(newUserObj)
        await newUser.save()

        const msg = {
          from: 'multiple-auth platform <auth@sandbox0040a7cdf8614a9aaad8ea35b3efb452.mailgun.org>',
          to: newUserObj.email,
          subject: `[multiple-auth] Register with Facebook oauth 2.0 success !`,
          text: `Hi ${newUserObj.name}, you just register with ${newUserObj.email} from Facebook oauth 2.0 success !`
        }
        await mailer.sendMail(msg)

        return done(null, newUser)
      }
    } catch (e) {
      return done(e, false)
    }
    // return done(null, profile);
  }
));

// Configure the Google strategy for use by Passport.
passport.use(new GoogleStrategy({
    clientID: process.env['GOOGLE_CLIENT_ID'],
    clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
    callbackURL: `${process.env['APP_URL']}/oauth/google/callback`
  },
  async function(accessToken, refreshToken, profile, done) {
    // console.log("profile", profile);
    try {
      var userDataObj = profile._json
      console.log("2. Google userDataObj", userDataObj);
      var existed_user = await User.findOne({email: userDataObj.email});
      if (existed_user) {
        if (existed_user.googleId === userDataObj.sub) {console.log("Login with google success!");return done(null, existed_user)}
        else throw createError(403, "Email has been registered !");
      }
      else{
        var newUserObj = {
          email: userDataObj.email,
          name: userDataObj.name,
          googleId: userDataObj.sub,
          coupon: ['coupon1']
        }
        var newUser = new User(newUserObj)
        await newUser.save()

        const msg = {
          from: 'multiple-auth platform <auth@sandbox0040a7cdf8614a9aaad8ea35b3efb452.mailgun.org>',
          to: newUserObj.email,
          subject: `[multiple-auth] Register with Google oauth 2.0 success !`,
          text: `Hi ${newUserObj.name}, you just register with ${newUserObj.email} from Google oauth 2.0 success !`
        }
        await mailer.sendMail(msg)

        return done(null, newUserObj)
        // console.log("accessToken", accessToken);
        // return done(null, profile)
      }
    } catch (e) {
      return done(e, false)
    }
  }
));
//
passport.serializeUser(function(user, done) {
  // console.log("3. serializeUser");
  console.log("3. serializeUser: user", user);
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  console.log("1. deserializeUser");
  // console.log("deserializeUser: obj", obj);
  done(null, obj);
});

// Initialize Passport and restore authentication state, if any, from the
// session.
router.use(passport.initialize());
router.use(passport.session());
//

router.get('/login/facebook', passport.authenticate('facebook',{
  scope: ['email']
}))
router.get('/oauth/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/login'
  }),
  function(req, res) {
    // req.session.provider = 'facebook';
    res.redirect('/');
  });

//
router.get('/login/google', passport.authenticate('google', {
  scope: ['email', 'profile']
}))
router.get('/oauth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login'
  }),
  function(req, res) {
    res.redirect('/');
  });
//
router.get('/oauth/logout',
  function(req, res) {
    req.session.destroy(function(err) {
      res.redirect('/');
    });
  });

router.use(function(err, req, res, next) {
  console.error(err.stack);
  var statusCode = err.status || 500;
  res.status(statusCode).send({ error: err.message });
})

module.exports = router

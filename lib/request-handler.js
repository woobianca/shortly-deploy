var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');
var mongoose = require('mongoose');
var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');
// var Users = require('../app/collections/users');
// var Links = require('../app/collections/links');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Links.find(function(links) {
    res.status(200).send(links.models);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;
  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }

  var newLink = new Link({ url: uri });
  Link.find().where( 'url', uri ).then(function(found) {
    if (found.length > 0) {
      res.status(200).send(found.attributes);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.sendStatus(404);
        }
        var newLink = new Link({
          url: uri,
          title: title,
          baseUrl: req.headers.origin
        });
        newLink.save()
        .then(function(newLink) {
          console.log('hello');
          Link.find().where('url', uri).then(function(url) {
            console.log('***LINKKKKK', url);
            console.log('***NEWLINK', newLink);
          });
        }).catch(function(err) {
          console.log('catch err post save', err);
        });
        res.status(200).send(newLink);
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.find().where({ username: username, password: password })
  .then(function(err, user) {
    if (err) {
      console.log(err);
    } else if (!user) {
      res.redirect('/login');
    } else {
      user.comparePassword(password, function(match) {
        if (match) {
          util.createSession(req, res, user);
        } else {
          res.redirect('/login');
        }
      });
    }
  });
      
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  var newUser = new User({ username: username, password: password });
  // console.log('****NEW USER: ', newUser);
  User.find().where('username', username).then(function(user) {          
    if (user.length < 1) {
      var newUser = new User({
        username: username,
        password: password
      });
      newUser.save()
        .then(function(newUser) {
          Users.insert(newUser);
          util.createSession(req, res, newUser);
          res.status(200);
        });
    } else {
      // User.find().where('username', username).then(function(user) {
      //   console.log('USERRR-- ', user);
      // });
      console.log('Account already exists: ', user);
      res.redirect('/signup');
    }
  });
  res.end();
};

exports.navToLink = function(req, res) {
  Link.find().where({ code: req.params[0] }).then((function(link) {
    if (!link) {
      res.redirect('/');
    } else {
      link.set({ visits: link.get('visits') + 1 })
        .save()
        .then(function() {
          return res.redirect(link.get('url'));
        });
    }
  }));
};
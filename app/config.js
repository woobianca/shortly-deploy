var path = require('path');
var assert = require('assert');
var mongoose = require('mongoose');

var url = 'mongodb://localhost:27017/shortly-deploy';
mongoose.connect(url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('mongoose connection successful');
});

module.exports = db;
// var MongoClient = require('mongodb').MongoClient;
// var db2 = require('bookshelf')(knex);

// var knex = require('knex')({
//   client: 'sqlite3',
//   connection: {
//     filename: path.join(__dirname, '../db/shortly.sqlite')
//   },
//   useNullAsDefault: true
// });


// db2.knex.schema.hasTable('urls').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('urls', function (link) {
//       link.increments('id').primary();
//       link.string('url', 255);
//       link.string('baseUrl', 255);
//       link.string('code', 100);
//       link.string('title', 255);
//       link.integer('visits');
//       link.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });

// db2.knex.schema.hasTable('users').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('users', function (user) {
//       user.increments('id').primary();
//       user.string('username', 100).unique();
//       user.string('password', 100);
//       user.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });

// MongoClient.connect(url, function (err, db) {
//   if (err) {
//     console.log('Unable to connect to the mongoDB server. Error:', err);
//   } else {
//     //HURRAY!! We are connected. :)
//     console.log('Connection established to', url);

//     // do some work here with the database.

//     //Close connection
//     db.close();
//   }
// });

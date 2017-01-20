var db = require('../config');
var crypto = require('crypto');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var urlsSchema = new Schema({
  url: String,
  baseUrl: String,
  code: String,
  title: String,
  visits: Number, default: 0,
  date: {type: Date, default: Date.now} 
});

urlsSchema.post('validate', function(url) {
  var shasum = crypto.createHash('sha1');
  shasum.update(urlsSchema.get('url'));
  urlsSchema.set('code', shasum.digest('hex').slice(0, 5));
  this.save();
});

urlsSchema.post('save', function(url) {
  var shasum = crypto.createHash('sha1');
  shasum.update(urlsSchema.get('url'));
  urlsSchema.set('code', shasum.digest('hex').slice(0, 5));
  this.save();
});


var Link = mongoose.model('Link', urlsSchema);
// Link.create()

// var Link2 = db.Model.extend({
//   tableName: 'urls',
//   hasTimestamps: true,
//   defaults: {
//     visits: 0
//   },
//   initialize: function() {
//     this.on('creating', function(model, attrs, options) {
//       var shasum = crypto.createHash('sha1');
//       shasum.update(model.get('url'));
//       model.set('code', shasum.digest('hex').slice(0, 5));
//     });
//   }
// });

module.exports = Link;

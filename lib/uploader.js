/* jshint node: true */

var request = require('request');
var RSVP    = require('rsvp');
var extend = require('util')._extend;
var fs = require('fs');

module.exports = function Uploader(config) {
  'use strict';
  this.bundleUrl = config.bundleUrl;
  this.accessToken = config.accessToken;
  this.srcDir = config.srcDir;
  this.baseDir = config.baseDir;

  this.uploadFiles = function(files) {
    var that = this;
    var requestOptions = {
      headers: {Authorization: 'Bearer ' + this.accessToken},
      followAllRedirects: true,
      json: true,
    };
    var assets = files.map(function(file) {
      return {
        name: file.replace(that.srcDir, '').replace(/^\//, ''),
        body: new Buffer(fs.readFileSync(that.baseDir + '/' +  file), 'utf-8').toString('base64')
      };
    }).sort(function(a, b) { // app.scss needs to come first
      if(a.name.indexOf('app.scss') > -1) {
        return -1;
      }
      if(b.name.indexOf('app.scss') > -1) {
        return 1;
      }
      if(a.name < b.name) {
        return -1;
      }
      if(a.name > b.name) {
        return 1;
      }
      return 0;
    });
    return new RSVP.Promise(function(resolve, reject) {
      request
        .put(extend(requestOptions, {
          url: that.bundleUrl,
          body: {assets: assets}
        }), function(error, response, body) {
          if(error) {
            reject(error);
          } else if(String(response.statusCode).substr(0, 1) !== '2') {
            reject(body.error);
          } else {
            resolve(body);
          }
        });
    });
  };
};

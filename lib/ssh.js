'use strict';

var Client = require('ssh2').Client;
var fs = require('fs');

var config = require('../config');

function SSH(user, hostname) {
  this.user = user;
  this.config = {
    username: config.ssh.user,
    hostname: hostname,
    privateKey: fs.readFileSync(config.ssh.path)
  };
}

SSH.prototype.execute = function (command, callback) {
  var data = {stdout: '', stderr: ''};
  var conn = new Client();
  conn.on('ready', function () {
    conn.exec(command, function (err, stream) {
      if (err) {
        return callback(err);
      }
      stream.on('close', function () {
        conn.end();
        callback(null, data);
      }).on('data', function (chunk) {
        data.stdout += chunk;
      }).stderr.on('data', function (chunk) {
          data.stderr += chunk;
        });
    });
  }).on('error', function (err) {
    conn.end();
    callback(err);
  }).connect(this.config);
};

SSH.prototype.startVNC = function (callback) {
  this.execute('./startvnc start ' + this.user, callback);
};

SSH.prototype.stopVNC = function (callback) {
  this.execute('./startvnc stop ' + this.user, callback);
};

SSH.prototype.statusVNC = function (callback) {
  this.execute('./startvnc status ' + this.user, callback);
};

SSH.prototype.startRTorrent = function (callback) {
  this.execute('./startrt start ' + this.user, callback);
};

SSH.prototype.stopRTorrent = function (callback) {
  this.execute('./startrt stop ' + this.user, callback);
};

SSH.prototype.getDiskUsage = function (callback) {
  this.execute('du ~' + this.user + ' -d 0 | awk \'{print $1}\'', callback);
};

module.exports = {SSH: SSH};

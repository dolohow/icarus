'use strict';

var app = {};

function dateToLocaleString(date) {
  return new Date(date).toLocaleDateString();
}

function requestWithFeedback(arg) {
  app.msg = true;
  return m.request(arg).then(function (obj) {
    app.msg = false;
    return obj;
  });
}

app.msg = false;

app.account = function () {
  return m.request({method: 'GET', url: window.location.href + '/data'})
    .then(function (obj) {
      var currentDate = new Date();
      obj.daysLeft = Math.floor((new Date(obj.validity) - currentDate) /
      1000 / 60 / 60 / 24);
      obj.validity = dateToLocaleString(obj.validity);
      return obj;
    });
};

app.VNC = function () {
  return m.request({method: 'GET', url: window.location.href + '/vnc'})
    .then(function (obj) {
      obj.isStarted = obj.stdout !== 'down\n';
      return obj;
    });
};

app.controller = function () {
  this.account = app.account().then(function (obj) {
    if (obj.allowedVNC) {
      this.VNC = app.VNC();
    }
    return obj;
  }.bind(this));

  this.manageVNC = function (arg) {
    requestWithFeedback({
      method: 'GET',
      url: window.location.href + '/vnc/' + arg,
      background: true
    }).then(function () {
      this.VNC = app.VNC();
    }.bind(this));
  }.bind(this);
};

function VNC(ctrl) {
  return [
    m('button', {
      onclick: ctrl.manageVNC.bind(ctrl, 'start'),
      disabled: ctrl.VNC().isStarted
    }, 'Start'),
    m('button', {
      onclick: ctrl.manageVNC.bind(ctrl, 'stop'),
      disabled: !ctrl.VNC().isStarted
    }, 'Stop'),
    m('button', {
      onclick: ctrl.manageVNC.bind(ctrl, 'restart'),
      disabled: !ctrl.VNC().isStarted
    }, 'Restart')
  ];
}

app.view = function (ctrl) {
  var account = ctrl.account();
  return m('body', [
    app.msg ? m('h2', 'Wait...') : null,
    m('p', 'Hostname: ' + account.hostname),
    m('p', 'Username: ' + account.username),
    account.allowedTorrents ?
      m('p', 'Active torrents: ' + account.allowedTorrents) : null,
    account.allowedTransfer ?
      m('p', 'Allowed upload: ' + account.allowedTransfer) : null,
    account.allowedVNC ?
      m('p', 'VNC: ' + ctrl.VNC().stdout) : null,
    account.allowedVNC ? VNC(ctrl) : null,
    account.allowedCapacity ?
      m('p', 'Capacity: ' + account.allowedCapacity + ' GB') : null,
    account.price ? m('p', 'Price: ' + account.price + ' zł') : null,
    account.validity ?
      m('p', 'Validity: ' + account.validity + ', left ' + account.daysLeft +
      ' days') : null
  ]);
};

m.module(document.body, app);

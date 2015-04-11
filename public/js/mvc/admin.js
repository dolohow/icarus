'use strict';

var app = {};

function dateToLocaleString(date) {
  return new Date(date).toLocaleDateString();
}

app.users = function () {
  return m.request({method: 'GET', url: '/admin/users'});
};

app.servers = function () {
  return m.request({method: 'GET', url: '/admin/servers'});
};

app.controller = function () {
  this.users = app.users();
  this.servers = app.servers();
};

function isAccountValid(account) {
  if (!account.validity) {
    return true;
  }
  var currentDate = new Date();
  var accountDate = new Date(account.validity);

  return accountDate > currentDate;
}

function accountView(user, server) {
  return [
    user.accounts.map(function (account) {
      if (account.hostname.hostname === server.hostname) {
        return m('tr', {
          style: {
            color: isAccountValid(account) ? 'green' : 'red',
            backgroundColor: account.payForAdmin ? 'yellow' : null
          }
        }, [
            m('td', user.user),
            m('td', [
              m('a',
                {href: '/admin/account/edit/' + account._id}, account.username)
            ]),
            m('td', account.allowedTorrents),
            m('td', account.allowedTransfer),
            m('td', account.allowedVNC),
            m('td', account.allowedCapacity),
            m('td', account.price),
            m('td', account.validity ?
              dateToLocaleString(account.validity) : null),
            m('td', [
              m('a', {href: '/admin/account/remove/' + account._id}, 'Usuń')
            ])
          ]);
      }
    })
  ];
}

app.view = function (ctrl) {
  var users = ctrl.users();
  var servers = ctrl.servers();
  return m('', [
    servers.map(function (server) {
      return m('', [
        m('h2', server.hostname + ' | ' + server.link + ' Mbit/s | ' +
        server.price + ' zł'),
        m('table', [
          m('th', 'User'),
          m('th', 'Username'),
          m('th', 'Aktywnych torrentów'),
          m('th', 'Transfer'),
          m('th', 'VNC'),
          m('th', 'Dysk'),
          m('th', 'Cena'),
          m('th', 'Ważność'),
          users.map(function (user) {
            return accountView(user, server);
          })
        ])
      ]);
    })
  ]);
};

m.module(document.getElementById('content'), app);

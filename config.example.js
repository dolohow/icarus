/*
 * You should edit this file prior to running application.
 *
 * Start by copying this file to config.js.
 * `cp config.example.js config.js`
 *
 * This is just an example file, you can arrange it in a different manner,
 * but variables which are exported have to be exported
 */
'use strict';

/* MongoDB path for storing login tokens */
var passwordless;

/* Path to MongoDB main database */
var mongodb;

/* Domain at which you want to run the application */
var domain;

/*
 * Use this pattern to differentiate between 'production' and 'development'
 * environment.
  */
switch (process.env.NODE_ENV) {
  case 'production':
    passwordless = 'mongodb://localhost/passwordless-simple-mail';
    mongodb = 'mongodb://localhost/db';
    domain = '';
    break;
  default:
    passwordless = 'mongodb://localhost/passwordless-simple-mail-dev';
    mongodb = 'mongodb://localhost/db-dev';
    domain = 'localhost:' + (process.env.PORT || 5000);
}

/* All of those variables should be exported so the app can use it */
module.exports = {
  passwordless: passwordless,
  email: {
    user: '',
    password: '',
    host: '',
    ssl: true,
    tls: false,
    port: 465
  },
  mongodb: mongodb,
  domain: domain,
  sessionSecret: 'LONG RANDOM STRING',
  /* Credentials for admin sections */
  basicAuth: {
    username: '',
    password: ''
  },
  /* Credentials for logging and executing command on remote servers */
  ssh: {
    user: 'root',
    /* Path to your private key for authentication */
    path: process.env.HOME + '/.ssh/id_rsa'
  }
};

icarus
======
## Prerequirements
* node with npm
* grunt-cli
* mongodb
* flightplan

## Installation
```shell
npm install
```
If your default version python is in version 3, then you should export env
variable.
```shell
PYTHON=python2.7 npm install
```

## Configuration
You should create a file `config.js` in your root directory with a exported
variables `passwordless`, `email`, `mongodb`, `domain`, `sessionSecret`,
`basicAuth`, `ssh`.

Example of a file:
```js
'use strict';

var passwordless;
var mongodb;
var domain;
switch (process.env.NODE_ENV) {
  case 'production':
    passwordless = 'mongodb://localhost/passwordless-simple-mail';
    mongodb = 'mongodb://localhost/db';
    domain = '';
    break;
  default:
    passwordless = 'mongodb://localhost/passwordless-simple-mail-dev';
    mongodb = 'mongodb://localhost/db-dev';
    domain = 'localhost:' + process.env.PORT;
}

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
  sessionSecret: '',
  basicAuth: {
    username: '',
    password: ''
  },
  ssh: {
    root: '',
    shell: ''
  }
};
```

## Building
```shell
grunt build
```

## Deploy
You might want to manually modify the `flightplan.js` file.

First install dependencies.
```shell
fly install-dep
```
Then deploy application.
```shell
fly deploy:production
```

## Running server
```shell
npm start
```
You can specify the port by PORT env variable and so running environment.
We recommend using nginx or similar web server as proxy.
```shell
NODE_ENV=production npm start
```

## Runing tests
```shell
grunt test
```

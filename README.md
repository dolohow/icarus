icarus
======
## Prerequirements
* node with npm
* grunt-cli
* mongodb

## Installation
```shell
npm install
```
Sometimes might be necessary to export env variable
```shell
PYTHON=python2 npm install
```

## Configuration
You should create a file `credentials.js` in your root directory with a
exported variables `passwordless`, `email`, and `mongodb`.

Example of a file:
```js
'use strict';

var passwordless;
var mongodb;
var email = {
  user: '',
  password: '',
  host: '',
  ssl: true,
  tls: false,
  port: 465
};
switch (process.env.NODE_ENV) {
  case 'production':
    passwordless = 'mongodb://localhost/passwordless-simple-mail';
    mongodb = 'mongodb://localhost/db';
    break;
  default:
    passwordless = 'mongodb://localhost/passwordless-simple-mail-dev';
    mongodb = 'mongodb://localhost/db-dev';
}

module.exports = {passwordless: passwordless, email: email, mongodb: mongodb};

```

## Building
```shell
grunt build
```

## Running server
Currently it does read from **public** dir
```shell
npm start
```

## Runing tests
```shell
grunt test
```

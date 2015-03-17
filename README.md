icarus
======
## Prerequirements
Those should be visible on PATH env variable.
* node
* npm
* mongodb
* bower
* grunt-cli
* flightplan

## Installation of dependencies
```shell
npm install && bower install
```
If your default version of python is in version 3, then you should export env
variable.
```shell
PYTHON=python2.7 npm install
```

## Configuration
You should create a file `config.js`, example of it is stored in the root of
application in file `config.example.js`. You may copy that file and edit.
```shell
cp config.js.example config.js
```

## Building
```shell
grunt build
```

## Deployment
You might want to manually modify the `flightplan.js` file.

First install dependencies on the remote server.
```shell
fly install-dep
```
Then deploy application.
```shell
fly deploy
```
### Updating deployed app
Just run
```shell
fly update
```

## Running server
### Developer environment
```shell
npm start
```
You can specify the port by PORT env variable and so running environment.
```shell
PORT=5000 NODE_ENV=production npm start
```
If you want to have an automatic reload of a server you might want to use a
command
```shell
grunt nodemon
```
If you want to automatically reload web browser after changes in files related
to web browser:
```shell
grunt watch:scripts
```
In that case you might be interest in looking at [Enabling live reload in your
html].
### Production environment
We recommend you to use passenger along with nginx. It can spawn multiple
processes and can also deal with crashes.
You can use `fly` for that purpose, see **Deploy** section.

## Runing tests
```shell
grunt test
```
You can also use a grunt task to run tests after modification of a single file
by:
```shell
grunt watch:test
```

[Enabling live reload in your html]:(https://github.com/gruntjs/grunt-contrib-watch/blob/master/docs/watch-examples.md#enabling-live-reload-in-your-html)

'use strict';
var plan = require('flightplan');

plan.target('production', [{
  host: 'shell.woox.pl',
  username: 'shell',
  privateKey: process.env.HOME + '/.ssh/id_rsa'
}]);

plan.remote('install-dep', function (remote) {
  /* MongoDB */
  remote.exec('apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10');
  remote.exec('echo \'' +
  'deb http://downloads-distro.mongodb.org/repo/debian-sysvinit dist 10gen\'' +
  ' | tee /etc/apt/sources.list.d/mongodb.list');

  /* NodeJS */
  var nodeVersion = 'v0.12.0';
  remote.exec('wget http://nodejs.org/dist/' + nodeVersion + '/node-' +
  nodeVersion + '-linux-x64.tar.gz');
  remote.exec('tar -xzf node-' + nodeVersion + '-linux-x64.tar.gz -C /opt');
  remote.exec('mv /opt/node-' + nodeVersion + '-linux-x64 /opt/node');
  remote.exec('echo PATH=$PATH:/opt/node/bin > ~/.profile');
  remote.exec('rm node-' + nodeVersion + '-linux-x64.tar.gz');

  /* Node deps */
  remote.exec('PATH=$PATH:/opt/node/bin npm install -g grunt-cli bower');

  /* Passenger */
  remote.exec('apt-key adv --keyserver keyserver.ubuntu.com --recv-keys ' +
  '561F9B9CAC40B2F7');
  remote.exec('echo deb ' +
  'https://oss-binaries.phusionpassenger.com/apt/passenger wheezy main > ' +
  '/etc/apt/sources.list.d/passenger.list');
  remote.exec('chown root: /etc/apt/sources.list.d/passenger.list');
  remote.exec('chmod 600 /etc/apt/sources.list.d/passenger.list');
  //remote.exec('aptitude install apt-transport-https -y');

  /* Install them all */
  remote.exec('aptitude update');
  remote.exec('aptitude install git make gcc g++ sudo python2.7 mongodb-org ' +
  'apt-transport-https ca-certificates nginx-extras passenger -y');
});

plan.local('install-dep', function (local) {
  local.transfer('config/nginx.conf', '/etc/nginx/nginx.conf');
  local.transfer('config/nginx-node-proxy', '/etc/nginx/sites-enabled/');
});

plan.remote('deploy', function (remote) {
  remote.exec('rm -rf icarus');
  remote.exec('git clone https://github.com/dolohow/icarus.git');
  remote.exec('echo PATH=$PATH:/opt/node/bin > ~/.profile');
  remote.exec('cd icarus;' +
  'PATH=$PATH:/opt/node/bin PYTHON=python2.7 npm install;' +
  'PATH=$PATH:/opt/node/bin bower install;');
});

plan.local('deploy', function (local) {
  local.transfer('credentials.js', '/home/shell/icarus/credentials.js');
});

plan.remote('update', function (remote) {
  remote.exec('cd icarus;' +
  'git pull;' +
  'PATH=$PATH:/opt/node/bin PYTHON=python2.7 npm install;' +
  'PATH=$PATH:/opt/node/bin bower install;' +
  'mkdir -p tmp;' +
  'touch tmp/restart.txt');
});

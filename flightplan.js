'use strict';
var plan = require('flightplan');
var credentials = require('./credentials');

/* TODO: Does targe should be merged, but no idea how */
plan.target('install-dep', [{
  host: 'shell.woox.pl',
  username: 'root',
  /* TODO: Find why this is not working */
  //privateKey: require('fs').readFileSync('~/.ssh/id_rsa'),
  /* TODO: Temporary solution */
  password: credentials.ssh.root
}]);

plan.target('production', [{
  host: 'shell.woox.pl',
  username: 'shell',
  //privateKey: require('fs').readFileSync('~/.ssh/id_rsa'),
  password: credentials.ssh.shell
}]);

plan.local(function (local) {
  local.transfer('config/nginx-node-proxy', '/etc/nginx/sites-enabled/');
});

plan.remote(function (remote) {
  var nodeVersion = 'v0.10.35';

  remote.exec('apt-key adv --keyserver keyserver.ubuntu.com --recv 7F0CEB10');
  remote.exec('echo \'' +
  'deb http://downloads-distro.mongodb.org/repo/debian-sysvinit dist 10gen\'' +
  ' | sudo tee /etc/apt/sources.list.d/mongodb.list');
  remote.exec('aptitude update');
  remote.exec('aptitude install git make gcc g++ sudo nginx python2.7 ' +
  'mongodb-org -y');
  remote.exec('wget http://nodejs.org/dist/' + nodeVersion + '/node-' +
  nodeVersion + '-linux-x64.tar.gz');
  remote.exec('tar -xzf node-' + nodeVersion + '-linux-x64.tar.gz');
  remote.exec('cp -r node-' + nodeVersion + '-linux-x64 /opt/node');
  //remote.exec('echo PATH=$PATH:/opt/node/bin > ~/.profile');
  remote.exec('PATH=$PATH:/opt/node/bin npm install -g grunt-cli');
});

plan.remote('deploy', function (remote) {
  remote.exec('rm -rf icarus');
  remote.exec('git clone https://github.com/dolohow/icarus.git');
  remote.exec('echo PATH=$PATH:/opt/node/bin > ~/.profile');
  remote.exec('cd icarus ; ' +
              'PATH=$PATH:/opt/node/bin PYTHON=python2.7 npm install');
});

plan.local('deploy', function (local) {
  local.transfer('credentials.js', '/home/shell/icarus/credentials.js');
});

'use strict';
var shell = require('shelljs');
exports.path = function (app) {
    var pwd = shell.pwd()
    return pwd.stdout
}
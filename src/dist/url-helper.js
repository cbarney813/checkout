"use strict";
exports.__esModule = true;
exports.isGhes = exports.getServerApiUrl = exports.getServerUrl = exports.getFetchUrl = void 0;
var assert = require("assert");
var url_1 = require("url");
function getFetchUrl(settings) {
    assert.ok(settings.repositoryOwner, 'settings.repositoryOwner must be defined');
    assert.ok(settings.repositoryName, 'settings.repositoryName must be defined');
    var serviceUrl = getServerUrl(settings.githubServerUrl);
    var encodedOwner = encodeURIComponent(settings.repositoryOwner);
    var encodedName = encodeURIComponent(settings.repositoryName);
    if (settings.sshKey) {
        return "git@" + serviceUrl.hostname + ":" + encodedOwner + "/" + encodedName + ".git";
    }
    // "origin" is SCHEME://HOSTNAME[:PORT]
    return serviceUrl.origin + "/" + encodedOwner + "/" + encodedName;
}
exports.getFetchUrl = getFetchUrl;
function getServerUrl(url) {
    var urlValue = url && url.trim().length > 0
        ? url
        : process.env['GITHUB_SERVER_URL'] || 'https://github.com';
    return new url_1.URL(urlValue);
}
exports.getServerUrl = getServerUrl;
function getServerApiUrl(url) {
    var apiUrl = 'https://api.github.com';
    if (isGhes(url)) {
        var serverUrl = getServerUrl(url);
        apiUrl = new url_1.URL(serverUrl.origin + "/api/v3").toString();
    }
    return apiUrl;
}
exports.getServerApiUrl = getServerApiUrl;
function isGhes(url) {
    var ghUrl = getServerUrl(url);
    return ghUrl.hostname.toUpperCase() !== 'GITHUB.COM';
}
exports.isGhes = isGhes;

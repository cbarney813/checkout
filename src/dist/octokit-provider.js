"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
exports.__esModule = true;
exports.getOctokit = void 0;
var github = require("@actions/github");
var url_helper_1 = require("./url-helper");
// Centralize all Octokit references by re-exporting
var rest_1 = require("@octokit/rest");
__createBinding(exports, rest_1, "Octokit");
function getOctokit(authToken, opts) {
    var options = {
        baseUrl: url_helper_1.getServerApiUrl(opts.baseUrl)
    };
    if (opts.userAgent) {
        options.userAgent = opts.userAgent;
    }
    return new github.GitHub(authToken, options);
}
exports.getOctokit = getOctokit;

"use strict";
exports.__esModule = true;
exports.fileExistsSync = exports.existsSync = exports.directoryExistsSync = void 0;
var fs = require("fs");
function directoryExistsSync(path, required) {
    var _a, _b, _c;
    if (!path) {
        throw new Error("Arg 'path' must not be empty");
    }
    var stats;
    try {
        stats = fs.statSync(path);
    }
    catch (error) {
        if (((_a = error) === null || _a === void 0 ? void 0 : _a.code) === 'ENOENT') {
            if (!required) {
                return false;
            }
            throw new Error("Directory '" + path + "' does not exist");
        }
        throw new Error("Encountered an error when checking whether path '" + path + "' exists: " + ((_c = (_b = error) === null || _b === void 0 ? void 0 : _b.message) !== null && _c !== void 0 ? _c : error));
    }
    if (stats.isDirectory()) {
        return true;
    }
    else if (!required) {
        return false;
    }
    throw new Error("Directory '" + path + "' does not exist");
}
exports.directoryExistsSync = directoryExistsSync;
function existsSync(path) {
    var _a, _b, _c;
    if (!path) {
        throw new Error("Arg 'path' must not be empty");
    }
    try {
        fs.statSync(path);
    }
    catch (error) {
        if (((_a = error) === null || _a === void 0 ? void 0 : _a.code) === 'ENOENT') {
            return false;
        }
        throw new Error("Encountered an error when checking whether path '" + path + "' exists: " + ((_c = (_b = error) === null || _b === void 0 ? void 0 : _b.message) !== null && _c !== void 0 ? _c : error));
    }
    return true;
}
exports.existsSync = existsSync;
function fileExistsSync(path) {
    var _a, _b, _c;
    if (!path) {
        throw new Error("Arg 'path' must not be empty");
    }
    var stats;
    try {
        stats = fs.statSync(path);
    }
    catch (error) {
        if (((_a = error) === null || _a === void 0 ? void 0 : _a.code) === 'ENOENT') {
            return false;
        }
        throw new Error("Encountered an error when checking whether path '" + path + "' exists: " + ((_c = (_b = error) === null || _b === void 0 ? void 0 : _b.message) !== null && _c !== void 0 ? _c : error));
    }
    if (!stats.isDirectory()) {
        return true;
    }
    return false;
}
exports.fileExistsSync = fileExistsSync;

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.prepareExistingDirectory = void 0;
var assert = require("assert");
var core = require("@actions/core");
var fs = require("fs");
var fsHelper = require("./fs-helper");
var io = require("@actions/io");
var path = require("path");
function prepareExistingDirectory(git, repositoryPath, repositoryUrl, clean, ref) {
    var _a, _b;
    return __awaiter(this, void 0, Promise, function () {
        var remove, _c, _d, lockPaths, _i, lockPaths_1, lockPath, error_1, branches, _e, branches_1, branch, upperName1, upperName1Slash, _f, branches_2, branch, upperName2, upperName2Slash, error_2, _g, _h, file;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    assert.ok(repositoryPath, 'Expected repositoryPath to be defined');
                    assert.ok(repositoryUrl, 'Expected repositoryUrl to be defined');
                    remove = false;
                    if (!!git) return [3 /*break*/, 1];
                    remove = true;
                    return [3 /*break*/, 30];
                case 1:
                    _c = !fsHelper.directoryExistsSync(path.join(repositoryPath, '.git'));
                    if (_c) return [3 /*break*/, 3];
                    _d = repositoryUrl;
                    return [4 /*yield*/, git.tryGetFetchUrl()];
                case 2:
                    _c = _d !== (_j.sent());
                    _j.label = 3;
                case 3:
                    if (!_c) return [3 /*break*/, 4];
                    remove = true;
                    return [3 /*break*/, 30];
                case 4:
                    lockPaths = [
                        path.join(repositoryPath, '.git', 'index.lock'),
                        path.join(repositoryPath, '.git', 'shallow.lock')
                    ];
                    _i = 0, lockPaths_1 = lockPaths;
                    _j.label = 5;
                case 5:
                    if (!(_i < lockPaths_1.length)) return [3 /*break*/, 10];
                    lockPath = lockPaths_1[_i];
                    _j.label = 6;
                case 6:
                    _j.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, io.rmRF(lockPath)];
                case 7:
                    _j.sent();
                    return [3 /*break*/, 9];
                case 8:
                    error_1 = _j.sent();
                    core.debug("Unable to delete '" + lockPath + "'. " + ((_b = (_a = error_1) === null || _a === void 0 ? void 0 : _a.message) !== null && _b !== void 0 ? _b : error_1));
                    return [3 /*break*/, 9];
                case 9:
                    _i++;
                    return [3 /*break*/, 5];
                case 10:
                    _j.trys.push([10, 29, , 30]);
                    core.startGroup('Removing previously created refs, to avoid conflicts');
                    return [4 /*yield*/, git.isDetached()];
                case 11:
                    if (!!(_j.sent())) return [3 /*break*/, 13];
                    return [4 /*yield*/, git.checkoutDetach()];
                case 12:
                    _j.sent();
                    _j.label = 13;
                case 13: return [4 /*yield*/, git.branchList(false)];
                case 14:
                    branches = _j.sent();
                    _e = 0, branches_1 = branches;
                    _j.label = 15;
                case 15:
                    if (!(_e < branches_1.length)) return [3 /*break*/, 18];
                    branch = branches_1[_e];
                    return [4 /*yield*/, git.branchDelete(false, branch)];
                case 16:
                    _j.sent();
                    _j.label = 17;
                case 17:
                    _e++;
                    return [3 /*break*/, 15];
                case 18:
                    if (!ref) return [3 /*break*/, 23];
                    ref = ref.startsWith('refs/') ? ref : "refs/heads/" + ref;
                    if (!ref.startsWith('refs/heads/')) return [3 /*break*/, 23];
                    upperName1 = ref.toUpperCase().substr('REFS/HEADS/'.length);
                    upperName1Slash = upperName1 + "/";
                    return [4 /*yield*/, git.branchList(true)];
                case 19:
                    branches = _j.sent();
                    _f = 0, branches_2 = branches;
                    _j.label = 20;
                case 20:
                    if (!(_f < branches_2.length)) return [3 /*break*/, 23];
                    branch = branches_2[_f];
                    upperName2 = branch.substr('origin/'.length).toUpperCase();
                    upperName2Slash = upperName2 + "/";
                    if (!(upperName1.startsWith(upperName2Slash) ||
                        upperName2.startsWith(upperName1Slash))) return [3 /*break*/, 22];
                    return [4 /*yield*/, git.branchDelete(true, branch)];
                case 21:
                    _j.sent();
                    _j.label = 22;
                case 22:
                    _f++;
                    return [3 /*break*/, 20];
                case 23:
                    core.endGroup();
                    if (!clean) return [3 /*break*/, 28];
                    core.startGroup('Cleaning the repository');
                    return [4 /*yield*/, git.tryClean()];
                case 24:
                    if (!!(_j.sent())) return [3 /*break*/, 25];
                    core.debug("The clean command failed. This might be caused by: 1) path too long, 2) permission issue, or 3) file in use. For futher investigation, manually run 'git clean -ffdx' on the directory '" + repositoryPath + "'.");
                    remove = true;
                    return [3 /*break*/, 27];
                case 25: return [4 /*yield*/, git.tryReset()];
                case 26:
                    if (!(_j.sent())) {
                        remove = true;
                    }
                    _j.label = 27;
                case 27:
                    core.endGroup();
                    if (remove) {
                        core.warning("Unable to clean or reset the repository. The repository will be recreated instead.");
                    }
                    _j.label = 28;
                case 28: return [3 /*break*/, 30];
                case 29:
                    error_2 = _j.sent();
                    core.warning("Unable to prepare the existing repository. The repository will be recreated instead.");
                    remove = true;
                    return [3 /*break*/, 30];
                case 30:
                    if (!remove) return [3 /*break*/, 35];
                    // Delete the contents of the directory. Don't delete the directory itself
                    // since it might be the current working directory.
                    core.info("Deleting the contents of '" + repositoryPath + "'");
                    _g = 0;
                    return [4 /*yield*/, fs.promises.readdir(repositoryPath)];
                case 31:
                    _h = _j.sent();
                    _j.label = 32;
                case 32:
                    if (!(_g < _h.length)) return [3 /*break*/, 35];
                    file = _h[_g];
                    return [4 /*yield*/, io.rmRF(path.join(repositoryPath, file))];
                case 33:
                    _j.sent();
                    _j.label = 34;
                case 34:
                    _g++;
                    return [3 /*break*/, 32];
                case 35: return [2 /*return*/];
            }
        });
    });
}
exports.prepareExistingDirectory = prepareExistingDirectory;

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
exports.getDefaultBranch = exports.downloadRepository = void 0;
var assert = require("assert");
var core = require("@actions/core");
var fs = require("fs");
var io = require("@actions/io");
var path = require("path");
var retryHelper = require("./retry-helper");
var toolCache = require("@actions/tool-cache");
var v4_1 = require("uuid/v4");
var octokit_provider_1 = require("./octokit-provider");
var IS_WINDOWS = process.platform === 'win32';
function downloadRepository(authToken, owner, repo, ref, commit, repositoryPath, baseUrl) {
    return __awaiter(this, void 0, Promise, function () {
        var archiveData, uniqueId, archivePath, extractPath, archiveFileNames, archiveVersion, tempRepositoryPath, _i, _a, fileName, sourcePath, targetPath;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(!ref && !commit)) return [3 /*break*/, 2];
                    core.info('Determining the default branch');
                    return [4 /*yield*/, getDefaultBranch(authToken, owner, repo, baseUrl)];
                case 1:
                    ref = _b.sent();
                    _b.label = 2;
                case 2: return [4 /*yield*/, retryHelper.execute(function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    core.info('Downloading the archive');
                                    return [4 /*yield*/, downloadArchive(authToken, owner, repo, ref, commit, baseUrl)];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        });
                    }); })
                    // Write archive to disk
                ];
                case 3:
                    archiveData = _b.sent();
                    // Write archive to disk
                    core.info('Writing archive to disk');
                    uniqueId = v4_1["default"]();
                    archivePath = path.join(repositoryPath, uniqueId + ".tar.gz");
                    return [4 /*yield*/, fs.promises.writeFile(archivePath, archiveData)];
                case 4:
                    _b.sent();
                    archiveData = Buffer.from(''); // Free memory
                    // Extract archive
                    core.info('Extracting the archive');
                    extractPath = path.join(repositoryPath, uniqueId);
                    return [4 /*yield*/, io.mkdirP(extractPath)];
                case 5:
                    _b.sent();
                    if (!IS_WINDOWS) return [3 /*break*/, 7];
                    return [4 /*yield*/, toolCache.extractZip(archivePath, extractPath)];
                case 6:
                    _b.sent();
                    return [3 /*break*/, 9];
                case 7: return [4 /*yield*/, toolCache.extractTar(archivePath, extractPath)];
                case 8:
                    _b.sent();
                    _b.label = 9;
                case 9: return [4 /*yield*/, io.rmRF(archivePath)
                    // Determine the path of the repository content. The archive contains
                    // a top-level folder and the repository content is inside.
                ];
                case 10:
                    _b.sent();
                    return [4 /*yield*/, fs.promises.readdir(extractPath)];
                case 11:
                    archiveFileNames = _b.sent();
                    assert.ok(archiveFileNames.length == 1, 'Expected exactly one directory inside archive');
                    archiveVersion = archiveFileNames[0] // The top-level folder name includes the short SHA
                    ;
                    core.info("Resolved version " + archiveVersion);
                    tempRepositoryPath = path.join(extractPath, archiveVersion);
                    _i = 0;
                    return [4 /*yield*/, fs.promises.readdir(tempRepositoryPath)];
                case 12:
                    _a = _b.sent();
                    _b.label = 13;
                case 13:
                    if (!(_i < _a.length)) return [3 /*break*/, 18];
                    fileName = _a[_i];
                    sourcePath = path.join(tempRepositoryPath, fileName);
                    targetPath = path.join(repositoryPath, fileName);
                    if (!IS_WINDOWS) return [3 /*break*/, 15];
                    return [4 /*yield*/, io.cp(sourcePath, targetPath, { recursive: true })]; // Copy on Windows (Windows Defender may have a lock)
                case 14:
                    _b.sent(); // Copy on Windows (Windows Defender may have a lock)
                    return [3 /*break*/, 17];
                case 15: return [4 /*yield*/, io.mv(sourcePath, targetPath)];
                case 16:
                    _b.sent();
                    _b.label = 17;
                case 17:
                    _i++;
                    return [3 /*break*/, 13];
                case 18: return [4 /*yield*/, io.rmRF(extractPath)];
                case 19:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.downloadRepository = downloadRepository;
/**
 * Looks up the default branch name
 */
function getDefaultBranch(authToken, owner, repo, baseUrl) {
    return __awaiter(this, void 0, Promise, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, retryHelper.execute(function () { return __awaiter(_this, void 0, void 0, function () {
                        var octokit, result, response, err_1;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    core.info('Retrieving the default branch name');
                                    octokit = octokit_provider_1.getOctokit(authToken, { baseUrl: baseUrl });
                                    _b.label = 1;
                                case 1:
                                    _b.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, octokit.repos.get({ owner: owner, repo: repo })];
                                case 2:
                                    response = _b.sent();
                                    result = response.data.default_branch;
                                    assert.ok(result, 'default_branch cannot be empty');
                                    return [3 /*break*/, 4];
                                case 3:
                                    err_1 = _b.sent();
                                    // Handle .wiki repo
                                    if (((_a = err_1) === null || _a === void 0 ? void 0 : _a.status) === 404 &&
                                        repo.toUpperCase().endsWith('.WIKI')) {
                                        result = 'master';
                                    }
                                    // Otherwise error
                                    else {
                                        throw err_1;
                                    }
                                    return [3 /*break*/, 4];
                                case 4:
                                    // Print the default branch
                                    core.info("Default branch '" + result + "'");
                                    // Prefix with 'refs/heads'
                                    if (!result.startsWith('refs/')) {
                                        result = "refs/heads/" + result;
                                    }
                                    return [2 /*return*/, result];
                            }
                        });
                    }); })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.getDefaultBranch = getDefaultBranch;
function downloadArchive(authToken, owner, repo, ref, commit, baseUrl) {
    return __awaiter(this, void 0, Promise, function () {
        var octokit, params, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    octokit = octokit_provider_1.getOctokit(authToken, { baseUrl: baseUrl });
                    params = {
                        owner: owner,
                        repo: repo,
                        archive_format: IS_WINDOWS ? 'zipball' : 'tarball',
                        ref: commit || ref
                    };
                    return [4 /*yield*/, octokit.repos.getArchiveLink(params)];
                case 1:
                    response = _a.sent();
                    if (response.status != 200) {
                        throw new Error("Unexpected response from GitHub API. Status: " + response.status + ", Data: " + response.data);
                    }
                    return [2 /*return*/, Buffer.from(response.data)]; // response.data is ArrayBuffer
            }
        });
    });
}

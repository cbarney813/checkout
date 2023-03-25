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
exports.cleanup = exports.getSource = void 0;
var core = require("@actions/core");
var fsHelper = require("./fs-helper");
var gitAuthHelper = require("./git-auth-helper");
var gitCommandManager = require("./git-command-manager");
var gitDirectoryHelper = require("./git-directory-helper");
var githubApiHelper = require("./github-api-helper");
var io = require("@actions/io");
var path = require("path");
var refHelper = require("./ref-helper");
var stateHelper = require("./state-helper");
var urlHelper = require("./url-helper");
function getSource(settings) {
    return __awaiter(this, void 0, Promise, function () {
        var repositoryUrl, isExisting, git, authHelper, _a, _b, refSpec, refSpec, checkoutInfo, commitInfo;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    // Repository URL
                    core.info("Syncing repository: " + settings.repositoryOwner + "/" + settings.repositoryName);
                    repositoryUrl = urlHelper.getFetchUrl(settings);
                    if (!fsHelper.fileExistsSync(settings.repositoryPath)) return [3 /*break*/, 2];
                    return [4 /*yield*/, io.rmRF(settings.repositoryPath)];
                case 1:
                    _c.sent();
                    _c.label = 2;
                case 2:
                    isExisting = true;
                    if (!!fsHelper.directoryExistsSync(settings.repositoryPath)) return [3 /*break*/, 4];
                    isExisting = false;
                    return [4 /*yield*/, io.mkdirP(settings.repositoryPath)];
                case 3:
                    _c.sent();
                    _c.label = 4;
                case 4:
                    // Git command manager
                    core.startGroup('Getting Git version info');
                    return [4 /*yield*/, getGitCommandManager(settings)];
                case 5:
                    git = _c.sent();
                    core.endGroup();
                    authHelper = null;
                    _c.label = 6;
                case 6:
                    _c.trys.push([6, , 46, 50]);
                    if (!git) return [3 /*break*/, 9];
                    authHelper = gitAuthHelper.createAuthHelper(git, settings);
                    if (!settings.setSafeDirectory) return [3 /*break*/, 9];
                    // Setup the repository path as a safe directory, so if we pass this into a container job with a different user it doesn't fail
                    // Otherwise all git commands we run in a container fail
                    return [4 /*yield*/, authHelper.configureTempGlobalConfig()];
                case 7:
                    // Setup the repository path as a safe directory, so if we pass this into a container job with a different user it doesn't fail
                    // Otherwise all git commands we run in a container fail
                    _c.sent();
                    core.info("Adding repository directory to the temporary git global config as a safe directory");
                    return [4 /*yield*/, git
                            .config('safe.directory', settings.repositoryPath, true, true)["catch"](function (error) {
                            core.info("Failed to initialize safe directory with error: " + error);
                        })];
                case 8:
                    _c.sent();
                    stateHelper.setSafeDirectory();
                    _c.label = 9;
                case 9:
                    if (!isExisting) return [3 /*break*/, 11];
                    return [4 /*yield*/, gitDirectoryHelper.prepareExistingDirectory(git, settings.repositoryPath, repositoryUrl, settings.clean, settings.ref)];
                case 10:
                    _c.sent();
                    _c.label = 11;
                case 11:
                    if (!!git) return [3 /*break*/, 13];
                    // Downloading using REST API
                    core.info("The repository will be downloaded using the GitHub REST API");
                    core.info("To create a local Git repository instead, add Git " + gitCommandManager.MinimumGitVersion + " or higher to the PATH");
                    if (settings.submodules) {
                        throw new Error("Input 'submodules' not supported when falling back to download using the GitHub REST API. To create a local Git repository instead, add Git " + gitCommandManager.MinimumGitVersion + " or higher to the PATH.");
                    }
                    else if (settings.sshKey) {
                        throw new Error("Input 'ssh-key' not supported when falling back to download using the GitHub REST API. To create a local Git repository instead, add Git " + gitCommandManager.MinimumGitVersion + " or higher to the PATH.");
                    }
                    return [4 /*yield*/, githubApiHelper.downloadRepository(settings.authToken, settings.repositoryOwner, settings.repositoryName, settings.ref, settings.commit, settings.repositoryPath, settings.githubServerUrl)];
                case 12:
                    _c.sent();
                    return [2 /*return*/];
                case 13:
                    // Save state for POST action
                    stateHelper.setRepositoryPath(settings.repositoryPath);
                    if (!!fsHelper.directoryExistsSync(path.join(settings.repositoryPath, '.git'))) return [3 /*break*/, 16];
                    core.startGroup('Initializing the repository');
                    return [4 /*yield*/, git.init()];
                case 14:
                    _c.sent();
                    return [4 /*yield*/, git.remoteAdd('origin', repositoryUrl)];
                case 15:
                    _c.sent();
                    core.endGroup();
                    _c.label = 16;
                case 16:
                    // Disable automatic garbage collection
                    core.startGroup('Disabling automatic garbage collection');
                    return [4 /*yield*/, git.tryDisableAutomaticGarbageCollection()];
                case 17:
                    if (!(_c.sent())) {
                        core.warning("Unable to turn off git automatic garbage collection. The git fetch operation may trigger garbage collection and cause a delay.");
                    }
                    core.endGroup();
                    // If we didn't initialize it above, do it now
                    if (!authHelper) {
                        authHelper = gitAuthHelper.createAuthHelper(git, settings);
                    }
                    // Configure auth
                    core.startGroup('Setting up auth');
                    return [4 /*yield*/, authHelper.configureAuth()];
                case 18:
                    _c.sent();
                    core.endGroup();
                    if (!(!settings.ref && !settings.commit)) return [3 /*break*/, 23];
                    core.startGroup('Determining the default branch');
                    if (!settings.sshKey) return [3 /*break*/, 20];
                    _a = settings;
                    return [4 /*yield*/, git.getDefaultBranch(repositoryUrl)];
                case 19:
                    _a.ref = _c.sent();
                    return [3 /*break*/, 22];
                case 20:
                    _b = settings;
                    return [4 /*yield*/, githubApiHelper.getDefaultBranch(settings.authToken, settings.repositoryOwner, settings.repositoryName, settings.githubServerUrl)];
                case 21:
                    _b.ref = _c.sent();
                    _c.label = 22;
                case 22:
                    core.endGroup();
                    _c.label = 23;
                case 23:
                    if (!settings.lfs) return [3 /*break*/, 25];
                    return [4 /*yield*/, git.lfsInstall()];
                case 24:
                    _c.sent();
                    _c.label = 25;
                case 25:
                    // Fetch
                    core.startGroup('Fetching the repository');
                    if (!(settings.fetchDepth <= 0)) return [3 /*break*/, 30];
                    refSpec = refHelper.getRefSpecForAllHistory(settings.ref, settings.commit);
                    return [4 /*yield*/, git.fetch(refSpec)
                        // When all history is fetched, the ref we're interested in may have moved to a different
                        // commit (push or force push). If so, fetch again with a targeted refspec.
                    ];
                case 26:
                    _c.sent();
                    return [4 /*yield*/, refHelper.testRef(git, settings.ref, settings.commit)];
                case 27:
                    if (!!(_c.sent())) return [3 /*break*/, 29];
                    refSpec = refHelper.getRefSpec(settings.ref, settings.commit);
                    return [4 /*yield*/, git.fetch(refSpec)];
                case 28:
                    _c.sent();
                    _c.label = 29;
                case 29: return [3 /*break*/, 32];
                case 30:
                    refSpec = refHelper.getRefSpec(settings.ref, settings.commit);
                    return [4 /*yield*/, git.fetch(refSpec, settings.fetchDepth)];
                case 31:
                    _c.sent();
                    _c.label = 32;
                case 32:
                    core.endGroup();
                    // Checkout info
                    core.startGroup('Determining the checkout info');
                    return [4 /*yield*/, refHelper.getCheckoutInfo(git, settings.ref, settings.commit)];
                case 33:
                    checkoutInfo = _c.sent();
                    core.endGroup();
                    if (!settings.lfs) return [3 /*break*/, 35];
                    core.startGroup('Fetching LFS objects');
                    return [4 /*yield*/, git.lfsFetch(checkoutInfo.startPoint || checkoutInfo.ref)];
                case 34:
                    _c.sent();
                    core.endGroup();
                    _c.label = 35;
                case 35:
                    // Checkout
                    core.startGroup('Checking out the ref');
                    return [4 /*yield*/, git.checkout(checkoutInfo.ref, checkoutInfo.startPoint)];
                case 36:
                    _c.sent();
                    core.endGroup();
                    if (!settings.submodules) return [3 /*break*/, 42];
                    // Temporarily override global config
                    core.startGroup('Setting up auth for fetching submodules');
                    return [4 /*yield*/, authHelper.configureGlobalAuth()];
                case 37:
                    _c.sent();
                    core.endGroup();
                    // Checkout submodules
                    core.startGroup('Fetching submodules');
                    return [4 /*yield*/, git.submoduleSync(settings.nestedSubmodules)];
                case 38:
                    _c.sent();
                    return [4 /*yield*/, git.submoduleUpdate(settings.fetchDepth, settings.nestedSubmodules)];
                case 39:
                    _c.sent();
                    return [4 /*yield*/, git.submoduleForeach('git config --local gc.auto 0', settings.nestedSubmodules)];
                case 40:
                    _c.sent();
                    core.endGroup();
                    if (!settings.persistCredentials) return [3 /*break*/, 42];
                    core.startGroup('Persisting credentials for submodules');
                    return [4 /*yield*/, authHelper.configureSubmoduleAuth()];
                case 41:
                    _c.sent();
                    core.endGroup();
                    _c.label = 42;
                case 42: return [4 /*yield*/, git.log1()
                    // Log commit sha
                ];
                case 43:
                    commitInfo = _c.sent();
                    // Log commit sha
                    return [4 /*yield*/, git.log1("--format='%H'")
                        // Check for incorrect pull request merge commit
                    ];
                case 44:
                    // Log commit sha
                    _c.sent();
                    // Check for incorrect pull request merge commit
                    return [4 /*yield*/, refHelper.checkCommitInfo(settings.authToken, commitInfo, settings.repositoryOwner, settings.repositoryName, settings.ref, settings.commit, settings.githubServerUrl)];
                case 45:
                    // Check for incorrect pull request merge commit
                    _c.sent();
                    return [3 /*break*/, 50];
                case 46:
                    if (!authHelper) return [3 /*break*/, 49];
                    if (!!settings.persistCredentials) return [3 /*break*/, 48];
                    core.startGroup('Removing auth');
                    return [4 /*yield*/, authHelper.removeAuth()];
                case 47:
                    _c.sent();
                    core.endGroup();
                    _c.label = 48;
                case 48:
                    authHelper.removeGlobalConfig();
                    _c.label = 49;
                case 49: return [7 /*endfinally*/];
                case 50: return [2 /*return*/];
            }
        });
    });
}
exports.getSource = getSource;
function cleanup(repositoryPath) {
    return __awaiter(this, void 0, Promise, function () {
        var git, _a, authHelper;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    // Repo exists?
                    if (!repositoryPath ||
                        !fsHelper.fileExistsSync(path.join(repositoryPath, '.git', 'config'))) {
                        return [2 /*return*/];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, gitCommandManager.createCommandManager(repositoryPath, false)];
                case 2:
                    git = _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    _a = _b.sent();
                    return [2 /*return*/];
                case 4:
                    authHelper = gitAuthHelper.createAuthHelper(git);
                    _b.label = 5;
                case 5:
                    _b.trys.push([5, , 10, 12]);
                    if (!stateHelper.PostSetSafeDirectory) return [3 /*break*/, 8];
                    // Setup the repository path as a safe directory, so if we pass this into a container job with a different user it doesn't fail
                    // Otherwise all git commands we run in a container fail
                    return [4 /*yield*/, authHelper.configureTempGlobalConfig()];
                case 6:
                    // Setup the repository path as a safe directory, so if we pass this into a container job with a different user it doesn't fail
                    // Otherwise all git commands we run in a container fail
                    _b.sent();
                    core.info("Adding repository directory to the temporary git global config as a safe directory");
                    return [4 /*yield*/, git
                            .config('safe.directory', repositoryPath, true, true)["catch"](function (error) {
                            core.info("Failed to initialize safe directory with error: " + error);
                        })];
                case 7:
                    _b.sent();
                    _b.label = 8;
                case 8: return [4 /*yield*/, authHelper.removeAuth()];
                case 9:
                    _b.sent();
                    return [3 /*break*/, 12];
                case 10: return [4 /*yield*/, authHelper.removeGlobalConfig()];
                case 11:
                    _b.sent();
                    return [7 /*endfinally*/];
                case 12: return [2 /*return*/];
            }
        });
    });
}
exports.cleanup = cleanup;
function getGitCommandManager(settings) {
    return __awaiter(this, void 0, Promise, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    core.info("Working directory is '" + settings.repositoryPath + "'");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, gitCommandManager.createCommandManager(settings.repositoryPath, settings.lfs)];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    err_1 = _a.sent();
                    // Git is required for LFS
                    if (settings.lfs) {
                        throw err_1;
                    }
                    // Otherwise fallback to REST API
                    return [2 /*return*/, undefined];
                case 4: return [2 /*return*/];
            }
        });
    });
}

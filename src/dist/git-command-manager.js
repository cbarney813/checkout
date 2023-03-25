"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.createCommandManager = exports.MinimumGitVersion = void 0;
var core = require("@actions/core");
var exec = require("@actions/exec");
var fshelper = require("./fs-helper");
var io = require("@actions/io");
var path = require("path");
var refHelper = require("./ref-helper");
var regexpHelper = require("./regexp-helper");
var retryHelper = require("./retry-helper");
var git_version_1 = require("./git-version");
// Auth header not supported before 2.9
// Wire protocol v2 not supported before 2.18
exports.MinimumGitVersion = new git_version_1.GitVersion('2.18');
function createCommandManager(workingDirectory, lfs) {
    return __awaiter(this, void 0, Promise, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, GitCommandManager.createCommandManager(workingDirectory, lfs)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.createCommandManager = createCommandManager;
var GitCommandManager = /** @class */ (function () {
    // Private constructor; use createCommandManager()
    function GitCommandManager() {
        this.gitEnv = {
            GIT_TERMINAL_PROMPT: '0',
            GCM_INTERACTIVE: 'Never' // Disable prompting for git credential manager
        };
        this.gitPath = '';
        this.lfs = false;
        this.workingDirectory = '';
    }
    GitCommandManager.prototype.branchDelete = function (remote, branch) {
        return __awaiter(this, void 0, Promise, function () {
            var args;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        args = ['branch', '--delete', '--force'];
                        if (remote) {
                            args.push('--remote');
                        }
                        args.push(branch);
                        return [4 /*yield*/, this.execGit(args)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    GitCommandManager.prototype.branchExists = function (remote, pattern) {
        return __awaiter(this, void 0, Promise, function () {
            var args, output;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        args = ['branch', '--list'];
                        if (remote) {
                            args.push('--remote');
                        }
                        args.push(pattern);
                        return [4 /*yield*/, this.execGit(args)];
                    case 1:
                        output = _a.sent();
                        return [2 /*return*/, !!output.stdout.trim()];
                }
            });
        });
    };
    GitCommandManager.prototype.branchList = function (remote) {
        return __awaiter(this, void 0, Promise, function () {
            var result, args, stderr, errline, stdout, stdline, listeners, _i, stdline_1, branch;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = [];
                        args = ['rev-parse', '--symbolic-full-name'];
                        if (remote) {
                            args.push('--remotes=origin');
                        }
                        else {
                            args.push('--branches');
                        }
                        stderr = [];
                        errline = [];
                        stdout = [];
                        stdline = [];
                        listeners = {
                            stderr: function (data) {
                                stderr.push(data.toString());
                            },
                            errline: function (data) {
                                errline.push(data.toString());
                            },
                            stdout: function (data) {
                                stdout.push(data.toString());
                            },
                            stdline: function (data) {
                                stdline.push(data.toString());
                            }
                        };
                        // Suppress the output in order to avoid flooding annotations with innocuous errors.
                        return [4 /*yield*/, this.execGit(args, false, true, listeners)];
                    case 1:
                        // Suppress the output in order to avoid flooding annotations with innocuous errors.
                        _a.sent();
                        core.debug("stderr callback is: " + stderr);
                        core.debug("errline callback is: " + errline);
                        core.debug("stdout callback is: " + stdout);
                        core.debug("stdline callback is: " + stdline);
                        for (_i = 0, stdline_1 = stdline; _i < stdline_1.length; _i++) {
                            branch = stdline_1[_i];
                            branch = branch.trim();
                            if (!branch) {
                                continue;
                            }
                            if (branch.startsWith('refs/heads/')) {
                                branch = branch.substring('refs/heads/'.length);
                            }
                            else if (branch.startsWith('refs/remotes/')) {
                                branch = branch.substring('refs/remotes/'.length);
                            }
                            result.push(branch);
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    GitCommandManager.prototype.checkout = function (ref, startPoint) {
        return __awaiter(this, void 0, Promise, function () {
            var args;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        args = ['checkout', '--progress', '--force'];
                        if (startPoint) {
                            args.push('-B', ref, startPoint);
                        }
                        else {
                            args.push(ref);
                        }
                        return [4 /*yield*/, this.execGit(args)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    GitCommandManager.prototype.checkoutDetach = function () {
        return __awaiter(this, void 0, Promise, function () {
            var args;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        args = ['checkout', '--detach'];
                        return [4 /*yield*/, this.execGit(args)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    GitCommandManager.prototype.config = function (configKey, configValue, globalConfig, add) {
        return __awaiter(this, void 0, Promise, function () {
            var args;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        args = ['config', globalConfig ? '--global' : '--local'];
                        if (add) {
                            args.push('--add');
                        }
                        args.push.apply(args, [configKey, configValue]);
                        return [4 /*yield*/, this.execGit(args)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    GitCommandManager.prototype.configExists = function (configKey, globalConfig) {
        return __awaiter(this, void 0, Promise, function () {
            var pattern, output;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pattern = regexpHelper.escape(configKey);
                        return [4 /*yield*/, this.execGit([
                                'config',
                                globalConfig ? '--global' : '--local',
                                '--name-only',
                                '--get-regexp',
                                pattern
                            ], true)];
                    case 1:
                        output = _a.sent();
                        return [2 /*return*/, output.exitCode === 0];
                }
            });
        });
    };
    GitCommandManager.prototype.fetch = function (refSpec, fetchDepth) {
        return __awaiter(this, void 0, Promise, function () {
            var args, _i, refSpec_1, arg, that;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        args = ['-c', 'protocol.version=2', 'fetch'];
                        if (!refSpec.some(function (x) { return x === refHelper.tagsRefSpec; })) {
                            args.push('--no-tags');
                        }
                        args.push('--prune', '--progress', '--no-recurse-submodules');
                        if (fetchDepth && fetchDepth > 0) {
                            args.push("--depth=" + fetchDepth);
                        }
                        else if (fshelper.fileExistsSync(path.join(this.workingDirectory, '.git', 'shallow'))) {
                            args.push('--unshallow');
                        }
                        args.push('origin');
                        for (_i = 0, refSpec_1 = refSpec; _i < refSpec_1.length; _i++) {
                            arg = refSpec_1[_i];
                            args.push(arg);
                        }
                        that = this;
                        return [4 /*yield*/, retryHelper.execute(function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, that.execGit(args)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    GitCommandManager.prototype.getDefaultBranch = function (repositoryUrl) {
        return __awaiter(this, void 0, Promise, function () {
            var output, _i, _a, line;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, retryHelper.execute(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.execGit([
                                            'ls-remote',
                                            '--quiet',
                                            '--exit-code',
                                            '--symref',
                                            repositoryUrl,
                                            'HEAD'
                                        ])];
                                    case 1:
                                        output = _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _b.sent();
                        if (output) {
                            // Satisfy compiler, will always be set
                            for (_i = 0, _a = output.stdout.trim().split('\n'); _i < _a.length; _i++) {
                                line = _a[_i];
                                line = line.trim();
                                if (line.startsWith('ref:') || line.endsWith('HEAD')) {
                                    return [2 /*return*/, line
                                            .substr('ref:'.length, line.length - 'ref:'.length - 'HEAD'.length)
                                            .trim()];
                                }
                            }
                        }
                        throw new Error('Unexpected output when retrieving default branch');
                }
            });
        });
    };
    GitCommandManager.prototype.getWorkingDirectory = function () {
        return this.workingDirectory;
    };
    GitCommandManager.prototype.init = function () {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.execGit(['init', this.workingDirectory])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    GitCommandManager.prototype.isDetached = function () {
        return __awaiter(this, void 0, Promise, function () {
            var output;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.execGit(['rev-parse', '--symbolic-full-name', '--verify', '--quiet', 'HEAD'], true)];
                    case 1:
                        output = _a.sent();
                        return [2 /*return*/, !output.stdout.trim().startsWith('refs/heads/')];
                }
            });
        });
    };
    GitCommandManager.prototype.lfsFetch = function (ref) {
        return __awaiter(this, void 0, Promise, function () {
            var args, that;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        args = ['lfs', 'fetch', 'origin', ref];
                        that = this;
                        return [4 /*yield*/, retryHelper.execute(function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, that.execGit(args)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    GitCommandManager.prototype.lfsInstall = function () {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.execGit(['lfs', 'install', '--local'])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    GitCommandManager.prototype.log1 = function (format) {
        return __awaiter(this, void 0, Promise, function () {
            var args, silent, output;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        args = format ? ['log', '-1', format] : ['log', '-1'];
                        silent = format ? false : true;
                        return [4 /*yield*/, this.execGit(args, false, silent)];
                    case 1:
                        output = _a.sent();
                        return [2 /*return*/, output.stdout];
                }
            });
        });
    };
    GitCommandManager.prototype.remoteAdd = function (remoteName, remoteUrl) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.execGit(['remote', 'add', remoteName, remoteUrl])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    GitCommandManager.prototype.removeEnvironmentVariable = function (name) {
        delete this.gitEnv[name];
    };
    /**
     * Resolves a ref to a SHA. For a branch or lightweight tag, the commit SHA is returned.
     * For an annotated tag, the tag SHA is returned.
     * @param {string} ref  For example: 'refs/heads/main' or '/refs/tags/v1'
     * @returns {Promise<string>}
     */
    GitCommandManager.prototype.revParse = function (ref) {
        return __awaiter(this, void 0, Promise, function () {
            var output;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.execGit(['rev-parse', ref])];
                    case 1:
                        output = _a.sent();
                        return [2 /*return*/, output.stdout.trim()];
                }
            });
        });
    };
    GitCommandManager.prototype.setEnvironmentVariable = function (name, value) {
        this.gitEnv[name] = value;
    };
    GitCommandManager.prototype.shaExists = function (sha) {
        return __awaiter(this, void 0, Promise, function () {
            var args, output;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        args = ['rev-parse', '--verify', '--quiet', sha + "^{object}"];
                        return [4 /*yield*/, this.execGit(args, true)];
                    case 1:
                        output = _a.sent();
                        return [2 /*return*/, output.exitCode === 0];
                }
            });
        });
    };
    GitCommandManager.prototype.submoduleForeach = function (command, recursive) {
        return __awaiter(this, void 0, Promise, function () {
            var args, output;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        args = ['submodule', 'foreach'];
                        if (recursive) {
                            args.push('--recursive');
                        }
                        args.push(command);
                        return [4 /*yield*/, this.execGit(args)];
                    case 1:
                        output = _a.sent();
                        return [2 /*return*/, output.stdout];
                }
            });
        });
    };
    GitCommandManager.prototype.submoduleSync = function (recursive) {
        return __awaiter(this, void 0, Promise, function () {
            var args;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        args = ['submodule', 'sync'];
                        if (recursive) {
                            args.push('--recursive');
                        }
                        return [4 /*yield*/, this.execGit(args)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    GitCommandManager.prototype.submoduleUpdate = function (fetchDepth, recursive) {
        return __awaiter(this, void 0, Promise, function () {
            var args;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        args = ['-c', 'protocol.version=2'];
                        args.push('submodule', 'update', '--init', '--force');
                        if (fetchDepth > 0) {
                            args.push("--depth=" + fetchDepth);
                        }
                        if (recursive) {
                            args.push('--recursive');
                        }
                        return [4 /*yield*/, this.execGit(args)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    GitCommandManager.prototype.tagExists = function (pattern) {
        return __awaiter(this, void 0, Promise, function () {
            var output;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.execGit(['tag', '--list', pattern])];
                    case 1:
                        output = _a.sent();
                        return [2 /*return*/, !!output.stdout.trim()];
                }
            });
        });
    };
    GitCommandManager.prototype.tryClean = function () {
        return __awaiter(this, void 0, Promise, function () {
            var output;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.execGit(['clean', '-ffdx'], true)];
                    case 1:
                        output = _a.sent();
                        return [2 /*return*/, output.exitCode === 0];
                }
            });
        });
    };
    GitCommandManager.prototype.tryConfigUnset = function (configKey, globalConfig) {
        return __awaiter(this, void 0, Promise, function () {
            var output;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.execGit([
                            'config',
                            globalConfig ? '--global' : '--local',
                            '--unset-all',
                            configKey
                        ], true)];
                    case 1:
                        output = _a.sent();
                        return [2 /*return*/, output.exitCode === 0];
                }
            });
        });
    };
    GitCommandManager.prototype.tryDisableAutomaticGarbageCollection = function () {
        return __awaiter(this, void 0, Promise, function () {
            var output;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.execGit(['config', '--local', 'gc.auto', '0'], true)];
                    case 1:
                        output = _a.sent();
                        return [2 /*return*/, output.exitCode === 0];
                }
            });
        });
    };
    GitCommandManager.prototype.tryGetFetchUrl = function () {
        return __awaiter(this, void 0, Promise, function () {
            var output, stdout;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.execGit(['config', '--local', '--get', 'remote.origin.url'], true)];
                    case 1:
                        output = _a.sent();
                        if (output.exitCode !== 0) {
                            return [2 /*return*/, ''];
                        }
                        stdout = output.stdout.trim();
                        if (stdout.includes('\n')) {
                            return [2 /*return*/, ''];
                        }
                        return [2 /*return*/, stdout];
                }
            });
        });
    };
    GitCommandManager.prototype.tryReset = function () {
        return __awaiter(this, void 0, Promise, function () {
            var output;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.execGit(['reset', '--hard', 'HEAD'], true)];
                    case 1:
                        output = _a.sent();
                        return [2 /*return*/, output.exitCode === 0];
                }
            });
        });
    };
    GitCommandManager.createCommandManager = function (workingDirectory, lfs) {
        return __awaiter(this, void 0, Promise, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = new GitCommandManager();
                        return [4 /*yield*/, result.initializeCommandManager(workingDirectory, lfs)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    GitCommandManager.prototype.execGit = function (args, allowAllExitCodes, silent, customListeners) {
        if (allowAllExitCodes === void 0) { allowAllExitCodes = false; }
        if (silent === void 0) { silent = false; }
        if (customListeners === void 0) { customListeners = {}; }
        return __awaiter(this, void 0, Promise, function () {
            var result, env, _i, _a, key, _b, _c, key, defaultListener, mergedListeners, stdout, options, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        fshelper.directoryExistsSync(this.workingDirectory, true);
                        result = new GitOutput();
                        env = {};
                        for (_i = 0, _a = Object.keys(process.env); _i < _a.length; _i++) {
                            key = _a[_i];
                            env[key] = process.env[key];
                        }
                        for (_b = 0, _c = Object.keys(this.gitEnv); _b < _c.length; _b++) {
                            key = _c[_b];
                            env[key] = this.gitEnv[key];
                        }
                        defaultListener = {
                            stdout: function (data) {
                                stdout.push(data.toString());
                            }
                        };
                        mergedListeners = __assign(__assign({}, defaultListener), customListeners);
                        stdout = [];
                        options = {
                            cwd: this.workingDirectory,
                            env: env,
                            silent: silent,
                            ignoreReturnCode: allowAllExitCodes,
                            listeners: mergedListeners
                        };
                        _d = result;
                        return [4 /*yield*/, exec.exec("\"" + this.gitPath + "\"", args, options)];
                    case 1:
                        _d.exitCode = _e.sent();
                        result.stdout = stdout.join('');
                        core.debug(result.exitCode.toString());
                        core.debug(result.stdout);
                        return [2 /*return*/, result];
                }
            });
        });
    };
    GitCommandManager.prototype.initializeCommandManager = function (workingDirectory, lfs) {
        return __awaiter(this, void 0, Promise, function () {
            var _a, gitVersion, gitOutput, stdout, match, gitLfsVersion, gitLfsPath, match, minimumGitLfsVersion, gitHttpUserAgent;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this.workingDirectory = workingDirectory;
                        // Git-lfs will try to pull down assets if any of the local/user/system setting exist.
                        // If the user didn't enable `LFS` in their pipeline definition, disable LFS fetch/checkout.
                        this.lfs = lfs;
                        if (!this.lfs) {
                            this.gitEnv['GIT_LFS_SKIP_SMUDGE'] = '1';
                        }
                        _a = this;
                        return [4 /*yield*/, io.which('git', true)
                            // Git version
                        ];
                    case 1:
                        _a.gitPath = _b.sent();
                        // Git version
                        core.debug('Getting git version');
                        gitVersion = new git_version_1.GitVersion();
                        return [4 /*yield*/, this.execGit(['version'])];
                    case 2:
                        gitOutput = _b.sent();
                        stdout = gitOutput.stdout.trim();
                        if (!stdout.includes('\n')) {
                            match = stdout.match(/\d+\.\d+(\.\d+)?/);
                            if (match) {
                                gitVersion = new git_version_1.GitVersion(match[0]);
                            }
                        }
                        if (!gitVersion.isValid()) {
                            throw new Error('Unable to determine git version');
                        }
                        // Minimum git version
                        if (!gitVersion.checkMinimum(exports.MinimumGitVersion)) {
                            throw new Error("Minimum required git version is " + exports.MinimumGitVersion + ". Your git ('" + this.gitPath + "') is " + gitVersion);
                        }
                        if (!this.lfs) return [3 /*break*/, 5];
                        // Git-lfs version
                        core.debug('Getting git-lfs version');
                        gitLfsVersion = new git_version_1.GitVersion();
                        return [4 /*yield*/, io.which('git-lfs', true)];
                    case 3:
                        gitLfsPath = _b.sent();
                        return [4 /*yield*/, this.execGit(['lfs', 'version'])];
                    case 4:
                        gitOutput = _b.sent();
                        stdout = gitOutput.stdout.trim();
                        if (!stdout.includes('\n')) {
                            match = stdout.match(/\d+\.\d+(\.\d+)?/);
                            if (match) {
                                gitLfsVersion = new git_version_1.GitVersion(match[0]);
                            }
                        }
                        if (!gitLfsVersion.isValid()) {
                            throw new Error('Unable to determine git-lfs version');
                        }
                        minimumGitLfsVersion = new git_version_1.GitVersion('2.1');
                        if (!gitLfsVersion.checkMinimum(minimumGitLfsVersion)) {
                            throw new Error("Minimum required git-lfs version is " + minimumGitLfsVersion + ". Your git-lfs ('" + gitLfsPath + "') is " + gitLfsVersion);
                        }
                        _b.label = 5;
                    case 5:
                        gitHttpUserAgent = "git/" + gitVersion + " (github-actions-checkout)";
                        core.debug("Set git useragent to: " + gitHttpUserAgent);
                        this.gitEnv['GIT_HTTP_USER_AGENT'] = gitHttpUserAgent;
                        return [2 /*return*/];
                }
            });
        });
    };
    return GitCommandManager;
}());
var GitOutput = /** @class */ (function () {
    function GitOutput() {
        this.stdout = '';
        this.exitCode = 0;
    }
    return GitOutput;
}());

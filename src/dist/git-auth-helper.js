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
exports.createAuthHelper = void 0;
var assert = require("assert");
var core = require("@actions/core");
var exec = require("@actions/exec");
var fs = require("fs");
var io = require("@actions/io");
var os = require("os");
var path = require("path");
var regexpHelper = require("./regexp-helper");
var stateHelper = require("./state-helper");
var urlHelper = require("./url-helper");
var v4_1 = require("uuid/v4");
var IS_WINDOWS = process.platform === 'win32';
var SSH_COMMAND_KEY = 'core.sshCommand';
function createAuthHelper(git, settings) {
    return new GitAuthHelper(git, settings);
}
exports.createAuthHelper = createAuthHelper;
var GitAuthHelper = /** @class */ (function () {
    function GitAuthHelper(gitCommandManager, gitSourceSettings) {
        this.insteadOfValues = [];
        this.sshCommand = '';
        this.sshKeyPath = '';
        this.sshKnownHostsPath = '';
        this.temporaryHomePath = '';
        this.git = gitCommandManager;
        this.settings = gitSourceSettings || {};
        // Token auth header
        var serverUrl = urlHelper.getServerUrl(this.settings.githubServerUrl);
        this.tokenConfigKey = "http." + serverUrl.origin + "/.extraheader"; // "origin" is SCHEME://HOSTNAME[:PORT]
        var basicCredential = Buffer.from("x-access-token:" + this.settings.authToken, 'utf8').toString('base64');
        core.setSecret(basicCredential);
        this.tokenPlaceholderConfigValue = "AUTHORIZATION: basic ***";
        this.tokenConfigValue = "AUTHORIZATION: basic " + basicCredential;
        // Instead of SSH URL
        this.insteadOfKey = "url." + serverUrl.origin + "/.insteadOf"; // "origin" is SCHEME://HOSTNAME[:PORT]
        this.insteadOfValues.push("git@" + serverUrl.hostname + ":");
        if (this.settings.workflowOrganizationId) {
            this.insteadOfValues.push("org-" + this.settings.workflowOrganizationId + "@github.com:");
        }
    }
    GitAuthHelper.prototype.configureAuth = function () {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Remove possible previous values
                    return [4 /*yield*/, this.removeAuth()
                        // Configure new values
                    ];
                    case 1:
                        // Remove possible previous values
                        _a.sent();
                        // Configure new values
                        return [4 /*yield*/, this.configureSsh()];
                    case 2:
                        // Configure new values
                        _a.sent();
                        return [4 /*yield*/, this.configureToken()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    GitAuthHelper.prototype.configureTempGlobalConfig = function () {
        var _a, _b;
        return __awaiter(this, void 0, Promise, function () {
            var runnerTemp, uniqueId, gitConfigPath, newGitConfigPath, configExists, err_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        // Already setup global config
                        if (((_a = this.temporaryHomePath) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                            return [2 /*return*/, path.join(this.temporaryHomePath, '.gitconfig')];
                        }
                        runnerTemp = process.env['RUNNER_TEMP'] || '';
                        assert.ok(runnerTemp, 'RUNNER_TEMP is not defined');
                        uniqueId = v4_1["default"]();
                        this.temporaryHomePath = path.join(runnerTemp, uniqueId);
                        return [4 /*yield*/, fs.promises.mkdir(this.temporaryHomePath, { recursive: true })
                            // Copy the global git config
                        ];
                    case 1:
                        _c.sent();
                        gitConfigPath = path.join(process.env['HOME'] || os.homedir(), '.gitconfig');
                        newGitConfigPath = path.join(this.temporaryHomePath, '.gitconfig');
                        configExists = false;
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, fs.promises.stat(gitConfigPath)];
                    case 3:
                        _c.sent();
                        configExists = true;
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _c.sent();
                        if (((_b = err_1) === null || _b === void 0 ? void 0 : _b.code) !== 'ENOENT') {
                            throw err_1;
                        }
                        return [3 /*break*/, 5];
                    case 5:
                        if (!configExists) return [3 /*break*/, 7];
                        core.info("Copying '" + gitConfigPath + "' to '" + newGitConfigPath + "'");
                        return [4 /*yield*/, io.cp(gitConfigPath, newGitConfigPath)];
                    case 6:
                        _c.sent();
                        return [3 /*break*/, 9];
                    case 7: return [4 /*yield*/, fs.promises.writeFile(newGitConfigPath, '')];
                    case 8:
                        _c.sent();
                        _c.label = 9;
                    case 9:
                        // Override HOME
                        core.info("Temporarily overriding HOME='" + this.temporaryHomePath + "' before making global git config changes");
                        this.git.setEnvironmentVariable('HOME', this.temporaryHomePath);
                        return [2 /*return*/, newGitConfigPath];
                }
            });
        });
    };
    GitAuthHelper.prototype.configureGlobalAuth = function () {
        return __awaiter(this, void 0, Promise, function () {
            var newGitConfigPath, _i, _a, insteadOfValue, err_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.configureTempGlobalConfig()];
                    case 1:
                        newGitConfigPath = _b.sent();
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 9, , 11]);
                        // Configure the token
                        return [4 /*yield*/, this.configureToken(newGitConfigPath, true)
                            // Configure HTTPS instead of SSH
                        ];
                    case 3:
                        // Configure the token
                        _b.sent();
                        // Configure HTTPS instead of SSH
                        return [4 /*yield*/, this.git.tryConfigUnset(this.insteadOfKey, true)];
                    case 4:
                        // Configure HTTPS instead of SSH
                        _b.sent();
                        if (!!this.settings.sshKey) return [3 /*break*/, 8];
                        _i = 0, _a = this.insteadOfValues;
                        _b.label = 5;
                    case 5:
                        if (!(_i < _a.length)) return [3 /*break*/, 8];
                        insteadOfValue = _a[_i];
                        return [4 /*yield*/, this.git.config(this.insteadOfKey, insteadOfValue, true, true)];
                    case 6:
                        _b.sent();
                        _b.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 5];
                    case 8: return [3 /*break*/, 11];
                    case 9:
                        err_2 = _b.sent();
                        // Unset in case somehow written to the real global config
                        core.info('Encountered an error when attempting to configure token. Attempting unconfigure.');
                        return [4 /*yield*/, this.git.tryConfigUnset(this.tokenConfigKey, true)];
                    case 10:
                        _b.sent();
                        throw err_2;
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    GitAuthHelper.prototype.configureSubmoduleAuth = function () {
        return __awaiter(this, void 0, Promise, function () {
            var output, configPaths, _i, configPaths_1, configPath, _a, _b, insteadOfValue;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: 
                    // Remove possible previous HTTPS instead of SSH
                    return [4 /*yield*/, this.removeGitConfig(this.insteadOfKey, true)];
                    case 1:
                        // Remove possible previous HTTPS instead of SSH
                        _c.sent();
                        if (!this.settings.persistCredentials) return [3 /*break*/, 12];
                        return [4 /*yield*/, this.git.submoduleForeach(
                            // wrap the pipeline in quotes to make sure it's handled properly by submoduleForeach, rather than just the first part of the pipeline
                            "sh -c \"git config --local '" + this.tokenConfigKey + "' '" + this.tokenPlaceholderConfigValue + "' && git config --local --show-origin --name-only --get-regexp remote.origin.url\"", this.settings.nestedSubmodules)
                            // Replace the placeholder
                        ];
                    case 2:
                        output = _c.sent();
                        configPaths = output.match(/(?<=(^|\n)file:)[^\t]+(?=\tremote\.origin\.url)/g) || [];
                        _i = 0, configPaths_1 = configPaths;
                        _c.label = 3;
                    case 3:
                        if (!(_i < configPaths_1.length)) return [3 /*break*/, 6];
                        configPath = configPaths_1[_i];
                        core.debug("Replacing token placeholder in '" + configPath + "'");
                        return [4 /*yield*/, this.replaceTokenPlaceholder(configPath)];
                    case 4:
                        _c.sent();
                        _c.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6:
                        if (!this.settings.sshKey) return [3 /*break*/, 8];
                        // Configure core.sshCommand
                        return [4 /*yield*/, this.git.submoduleForeach("git config --local '" + SSH_COMMAND_KEY + "' '" + this.sshCommand + "'", this.settings.nestedSubmodules)];
                    case 7:
                        // Configure core.sshCommand
                        _c.sent();
                        return [3 /*break*/, 12];
                    case 8:
                        _a = 0, _b = this.insteadOfValues;
                        _c.label = 9;
                    case 9:
                        if (!(_a < _b.length)) return [3 /*break*/, 12];
                        insteadOfValue = _b[_a];
                        return [4 /*yield*/, this.git.submoduleForeach("git config --local --add '" + this.insteadOfKey + "' '" + insteadOfValue + "'", this.settings.nestedSubmodules)];
                    case 10:
                        _c.sent();
                        _c.label = 11;
                    case 11:
                        _a++;
                        return [3 /*break*/, 9];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    GitAuthHelper.prototype.removeAuth = function () {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.removeSsh()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.removeToken()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    GitAuthHelper.prototype.removeGlobalConfig = function () {
        var _a;
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(((_a = this.temporaryHomePath) === null || _a === void 0 ? void 0 : _a.length) > 0)) return [3 /*break*/, 2];
                        core.debug("Unsetting HOME override");
                        this.git.removeEnvironmentVariable('HOME');
                        return [4 /*yield*/, io.rmRF(this.temporaryHomePath)];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    GitAuthHelper.prototype.configureSsh = function () {
        var _a;
        return __awaiter(this, void 0, Promise, function () {
            var runnerTemp, uniqueId, icacls, userKnownHostsPath, userKnownHosts, err_3, knownHosts, sshPath;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.settings.sshKey) {
                            return [2 /*return*/];
                        }
                        runnerTemp = process.env['RUNNER_TEMP'] || '';
                        assert.ok(runnerTemp, 'RUNNER_TEMP is not defined');
                        uniqueId = v4_1["default"]();
                        this.sshKeyPath = path.join(runnerTemp, uniqueId);
                        stateHelper.setSshKeyPath(this.sshKeyPath);
                        return [4 /*yield*/, fs.promises.mkdir(runnerTemp, { recursive: true })];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, fs.promises.writeFile(this.sshKeyPath, this.settings.sshKey.trim() + '\n', { mode: 384 })
                            // Remove inherited permissions on Windows
                        ];
                    case 2:
                        _b.sent();
                        if (!IS_WINDOWS) return [3 /*break*/, 6];
                        return [4 /*yield*/, io.which('icacls.exe')];
                    case 3:
                        icacls = _b.sent();
                        return [4 /*yield*/, exec.exec("\"" + icacls + "\" \"" + this.sshKeyPath + "\" /grant:r \"" + process.env['USERDOMAIN'] + "\\" + process.env['USERNAME'] + ":F\"")];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, exec.exec("\"" + icacls + "\" \"" + this.sshKeyPath + "\" /inheritance:r")];
                    case 5:
                        _b.sent();
                        _b.label = 6;
                    case 6:
                        userKnownHostsPath = path.join(os.homedir(), '.ssh', 'known_hosts');
                        userKnownHosts = '';
                        _b.label = 7;
                    case 7:
                        _b.trys.push([7, 9, , 10]);
                        return [4 /*yield*/, fs.promises.readFile(userKnownHostsPath)];
                    case 8:
                        userKnownHosts = (_b.sent()).toString();
                        return [3 /*break*/, 10];
                    case 9:
                        err_3 = _b.sent();
                        if (((_a = err_3) === null || _a === void 0 ? void 0 : _a.code) !== 'ENOENT') {
                            throw err_3;
                        }
                        return [3 /*break*/, 10];
                    case 10:
                        knownHosts = '';
                        if (userKnownHosts) {
                            knownHosts += "# Begin from " + userKnownHostsPath + "\n" + userKnownHosts + "\n# End from " + userKnownHostsPath + "\n";
                        }
                        if (this.settings.sshKnownHosts) {
                            knownHosts += "# Begin from input known hosts\n" + this.settings.sshKnownHosts + "\n# end from input known hosts\n";
                        }
                        knownHosts += "# Begin implicitly added github.com\ngithub.com ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAq2A7hRGmdnm9tUDbO9IDSwBK6TbQa+PXYPCPy6rbTrTtw7PHkccKrpp0yVhp5HdEIcKr6pLlVDBfOLX9QUsyCOV0wzfjIJNlGEYsdlLJizHhbn2mUjvSAHQqZETYP81eFzLQNnPHt4EVVUh7VfDESU84KezmD5QlWpXLmvU31/yMf+Se8xhHTvKSCZIFImWwoG6mbUoWf9nzpIoaSjB+weqqUUmpaaasXVal72J+UX2B+2RPW3RcT0eOzQgqlJL3RKrTJvdsjE3JEAvGq3lGHSZXy28G3skua2SmVi/w4yCE6gbODqnTWlg7+wC604ydGXA8VJiS5ap43JXiUFFAaQ==\n# End implicitly added github.com\n";
                        this.sshKnownHostsPath = path.join(runnerTemp, uniqueId + "_known_hosts");
                        stateHelper.setSshKnownHostsPath(this.sshKnownHostsPath);
                        return [4 /*yield*/, fs.promises.writeFile(this.sshKnownHostsPath, knownHosts)
                            // Configure GIT_SSH_COMMAND
                        ];
                    case 11:
                        _b.sent();
                        return [4 /*yield*/, io.which('ssh', true)];
                    case 12:
                        sshPath = _b.sent();
                        this.sshCommand = "\"" + sshPath + "\" -i \"$RUNNER_TEMP/" + path.basename(this.sshKeyPath) + "\"";
                        if (this.settings.sshStrict) {
                            this.sshCommand += ' -o StrictHostKeyChecking=yes -o CheckHostIP=no';
                        }
                        this.sshCommand += " -o \"UserKnownHostsFile=$RUNNER_TEMP/" + path.basename(this.sshKnownHostsPath) + "\"";
                        core.info("Temporarily overriding GIT_SSH_COMMAND=" + this.sshCommand);
                        this.git.setEnvironmentVariable('GIT_SSH_COMMAND', this.sshCommand);
                        if (!this.settings.persistCredentials) return [3 /*break*/, 14];
                        return [4 /*yield*/, this.git.config(SSH_COMMAND_KEY, this.sshCommand)];
                    case 13:
                        _b.sent();
                        _b.label = 14;
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    GitAuthHelper.prototype.configureToken = function (configPath, globalConfig) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Validate args
                        assert.ok((configPath && globalConfig) || (!configPath && !globalConfig), 'Unexpected configureToken parameter combinations');
                        // Default config path
                        if (!configPath && !globalConfig) {
                            configPath = path.join(this.git.getWorkingDirectory(), '.git', 'config');
                        }
                        // Configure a placeholder value. This approach avoids the credential being captured
                        // by process creation audit events, which are commonly logged. For more information,
                        // refer to https://docs.microsoft.com/en-us/windows-server/identity/ad-ds/manage/component-updates/command-line-process-auditing
                        return [4 /*yield*/, this.git.config(this.tokenConfigKey, this.tokenPlaceholderConfigValue, globalConfig)
                            // Replace the placeholder
                        ];
                    case 1:
                        // Configure a placeholder value. This approach avoids the credential being captured
                        // by process creation audit events, which are commonly logged. For more information,
                        // refer to https://docs.microsoft.com/en-us/windows-server/identity/ad-ds/manage/component-updates/command-line-process-auditing
                        _a.sent();
                        // Replace the placeholder
                        return [4 /*yield*/, this.replaceTokenPlaceholder(configPath || '')];
                    case 2:
                        // Replace the placeholder
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    GitAuthHelper.prototype.replaceTokenPlaceholder = function (configPath) {
        return __awaiter(this, void 0, Promise, function () {
            var content, placeholderIndex;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        assert.ok(configPath, 'configPath is not defined');
                        return [4 /*yield*/, fs.promises.readFile(configPath)];
                    case 1:
                        content = (_a.sent()).toString();
                        placeholderIndex = content.indexOf(this.tokenPlaceholderConfigValue);
                        if (placeholderIndex < 0 ||
                            placeholderIndex != content.lastIndexOf(this.tokenPlaceholderConfigValue)) {
                            throw new Error("Unable to replace auth placeholder in " + configPath);
                        }
                        assert.ok(this.tokenConfigValue, 'tokenConfigValue is not defined');
                        content = content.replace(this.tokenPlaceholderConfigValue, this.tokenConfigValue);
                        return [4 /*yield*/, fs.promises.writeFile(configPath, content)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    GitAuthHelper.prototype.removeSsh = function () {
        var _a, _b;
        return __awaiter(this, void 0, Promise, function () {
            var keyPath, err_4, knownHostsPath, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        keyPath = this.sshKeyPath || stateHelper.SshKeyPath;
                        if (!keyPath) return [3 /*break*/, 4];
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, io.rmRF(keyPath)];
                    case 2:
                        _d.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_4 = _d.sent();
                        core.debug("" + ((_b = (_a = err_4) === null || _a === void 0 ? void 0 : _a.message) !== null && _b !== void 0 ? _b : err_4));
                        core.warning("Failed to remove SSH key '" + keyPath + "'");
                        return [3 /*break*/, 4];
                    case 4:
                        knownHostsPath = this.sshKnownHostsPath || stateHelper.SshKnownHostsPath;
                        if (!knownHostsPath) return [3 /*break*/, 8];
                        _d.label = 5;
                    case 5:
                        _d.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, io.rmRF(knownHostsPath)];
                    case 6:
                        _d.sent();
                        return [3 /*break*/, 8];
                    case 7:
                        _c = _d.sent();
                        return [3 /*break*/, 8];
                    case 8: 
                    // SSH command
                    return [4 /*yield*/, this.removeGitConfig(SSH_COMMAND_KEY)];
                    case 9:
                        // SSH command
                        _d.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    GitAuthHelper.prototype.removeToken = function () {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // HTTP extra header
                    return [4 /*yield*/, this.removeGitConfig(this.tokenConfigKey)];
                    case 1:
                        // HTTP extra header
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    GitAuthHelper.prototype.removeGitConfig = function (configKey, submoduleOnly) {
        if (submoduleOnly === void 0) { submoduleOnly = false; }
        return __awaiter(this, void 0, Promise, function () {
            var _a, pattern;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!submoduleOnly) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.git.configExists(configKey)];
                    case 1:
                        _a = (_b.sent());
                        if (!_a) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.git.tryConfigUnset(configKey)];
                    case 2:
                        _a = !(_b.sent());
                        _b.label = 3;
                    case 3:
                        if (_a) {
                            // Load the config contents
                            core.warning("Failed to remove '" + configKey + "' from the git config");
                        }
                        _b.label = 4;
                    case 4:
                        pattern = regexpHelper.escape(configKey);
                        return [4 /*yield*/, this.git.submoduleForeach(
                            // wrap the pipeline in quotes to make sure it's handled properly by submoduleForeach, rather than just the first part of the pipeline
                            "sh -c \"git config --local --name-only --get-regexp '" + pattern + "' && git config --local --unset-all '" + configKey + "' || :\"", true)];
                    case 5:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return GitAuthHelper;
}());



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
var core = require("@actions/core");
var fs = require("fs");
var gitAuthHelper = require("../lib/git-auth-helper");
var io = require("@actions/io");
var os = require("os");
var path = require("path");
var stateHelper = require("../lib/state-helper");
var isWindows = process.platform === 'win32';
var testWorkspace = path.join(__dirname, '_temp', 'git-auth-helper');
var originalRunnerTemp = process.env['RUNNER_TEMP'];
var originalHome = process.env['HOME'];
var workspace;
var localGitConfigPath;
var globalGitConfigPath;
var runnerTemp;
var tempHomedir;
var git;
var settings;
var sshPath;
var githubServerUrl;
describe('git-auth-helper tests', function () {
    beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, io.which('ssh')
                    // Clear test workspace
                ];
                case 1:
                    // SSH
                    sshPath = _a.sent();
                    // Clear test workspace
                    return [4 /*yield*/, io.rmRF(testWorkspace)];
                case 2:
                    // Clear test workspace
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    beforeEach(function () {
        // Mock setSecret
        jest.spyOn(core, 'setSecret').mockImplementation(function (secret) { });
        // Mock error/warning/info/debug
        jest.spyOn(core, 'error').mockImplementation(jest.fn());
        jest.spyOn(core, 'warning').mockImplementation(jest.fn());
        jest.spyOn(core, 'info').mockImplementation(jest.fn());
        jest.spyOn(core, 'debug').mockImplementation(jest.fn());
        // Mock state helper
        jest.spyOn(stateHelper, 'setSshKeyPath').mockImplementation(jest.fn());
        jest
            .spyOn(stateHelper, 'setSshKnownHostsPath')
            .mockImplementation(jest.fn());
    });
    afterEach(function () {
        // Unregister mocks
        jest.restoreAllMocks();
        // Restore HOME
        if (originalHome) {
            process.env['HOME'] = originalHome;
        }
        else {
            delete process.env['HOME'];
        }
    });
    afterAll(function () {
        // Restore RUNNER_TEMP
        delete process.env['RUNNER_TEMP'];
        if (originalRunnerTemp) {
            process.env['RUNNER_TEMP'] = originalRunnerTemp;
        }
    });
    function testAuthHeader(testName, serverUrl) {
        if (serverUrl === void 0) { serverUrl = undefined; }
        return __awaiter(this, void 0, void 0, function () {
            var expectedServerUrl, authHelper, configContent, basicCredential;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        expectedServerUrl = 'https://github.com';
                        if (serverUrl) {
                            githubServerUrl = serverUrl;
                            expectedServerUrl = githubServerUrl;
                        }
                        return [4 /*yield*/, setup(testName)];
                    case 1:
                        _a.sent();
                        expect(settings.authToken).toBeTruthy(); // sanity check
                        authHelper = gitAuthHelper.createAuthHelper(git, settings);
                        // Act
                        return [4 /*yield*/, authHelper.configureAuth()
                            // Assert config
                        ];
                    case 2:
                        // Act
                        _a.sent();
                        return [4 /*yield*/, fs.promises.readFile(localGitConfigPath)];
                    case 3:
                        configContent = (_a.sent()).toString();
                        basicCredential = Buffer.from("x-access-token:" + settings.authToken, 'utf8').toString('base64');
                        expect(configContent.indexOf("http." + expectedServerUrl + "/.extraheader AUTHORIZATION: basic " + basicCredential)).toBeGreaterThanOrEqual(0);
                        return [2 /*return*/];
                }
            });
        });
    }
    var configureAuth_configuresAuthHeader = 'configureAuth configures auth header';
    it(configureAuth_configuresAuthHeader, function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testAuthHeader(configureAuth_configuresAuthHeader)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    var configureAuth_AcceptsGitHubServerUrl = 'inject https://my-ghes-server.com as github server url';
    it(configureAuth_AcceptsGitHubServerUrl, function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testAuthHeader(configureAuth_AcceptsGitHubServerUrl, 'https://my-ghes-server.com')];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    var configureAuth_AcceptsGitHubServerUrlSetToGHEC = 'inject https://github.com as github server url';
    it(configureAuth_AcceptsGitHubServerUrlSetToGHEC, function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, testAuthHeader(configureAuth_AcceptsGitHubServerUrl, 'https://github.com')];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    var configureAuth_configuresAuthHeaderEvenWhenPersistCredentialsFalse = 'configureAuth configures auth header even when persist credentials false';
    it(configureAuth_configuresAuthHeaderEvenWhenPersistCredentialsFalse, function () { return __awaiter(void 0, void 0, void 0, function () {
        var authHelper, configContent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                // Arrange
                return [4 /*yield*/, setup(configureAuth_configuresAuthHeaderEvenWhenPersistCredentialsFalse)];
                case 1:
                    // Arrange
                    _a.sent();
                    expect(settings.authToken).toBeTruthy(); // sanity check
                    settings.persistCredentials = false;
                    authHelper = gitAuthHelper.createAuthHelper(git, settings);
                    // Act
                    return [4 /*yield*/, authHelper.configureAuth()
                        // Assert config
                    ];
                case 2:
                    // Act
                    _a.sent();
                    return [4 /*yield*/, fs.promises.readFile(localGitConfigPath)];
                case 3:
                    configContent = (_a.sent()).toString();
                    expect(configContent.indexOf("http.https://github.com/.extraheader AUTHORIZATION")).toBeGreaterThanOrEqual(0);
                    return [2 /*return*/];
            }
        });
    }); });
    var configureAuth_copiesUserKnownHosts = 'configureAuth copies user known hosts';
    it(configureAuth_copiesUserKnownHosts, function () { return __awaiter(void 0, void 0, void 0, function () {
        var realReadFile, authHelper, actualSshKnownHostsPath, actualSshKnownHostsContent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!sshPath) {
                        process.stdout.write("Skipped test \"" + configureAuth_copiesUserKnownHosts + "\". Executable 'ssh' not found in the PATH.\n");
                        return [2 /*return*/];
                    }
                    // Arange
                    return [4 /*yield*/, setup(configureAuth_copiesUserKnownHosts)];
                case 1:
                    // Arange
                    _a.sent();
                    expect(settings.sshKey).toBeTruthy(); // sanity check
                    realReadFile = fs.promises.readFile;
                    jest.spyOn(fs.promises, 'readFile').mockImplementation(function (file, options) { return __awaiter(void 0, void 0, Promise, function () {
                        var userKnownHostsPath;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    userKnownHostsPath = path.join(os.homedir(), '.ssh', 'known_hosts');
                                    if (file === userKnownHostsPath) {
                                        return [2 /*return*/, Buffer.from('some-domain.com ssh-rsa ABCDEF')];
                                    }
                                    return [4 /*yield*/, realReadFile(file, options)];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        });
                    }); });
                    authHelper = gitAuthHelper.createAuthHelper(git, settings);
                    return [4 /*yield*/, authHelper.configureAuth()
                        // Assert known hosts
                    ];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, getActualSshKnownHostsPath()];
                case 3:
                    actualSshKnownHostsPath = _a.sent();
                    return [4 /*yield*/, fs.promises.readFile(actualSshKnownHostsPath)];
                case 4:
                    actualSshKnownHostsContent = (_a.sent()).toString();
                    expect(actualSshKnownHostsContent).toMatch(/some-domain\.com ssh-rsa ABCDEF/);
                    expect(actualSshKnownHostsContent).toMatch(/github\.com ssh-rsa AAAAB3N/);
                    return [2 /*return*/];
            }
        });
    }); });
    var configureAuth_registersBasicCredentialAsSecret = 'configureAuth registers basic credential as secret';
    it(configureAuth_registersBasicCredentialAsSecret, function () { return __awaiter(void 0, void 0, void 0, function () {
        var authHelper, setSecretSpy, expectedSecret;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                // Arrange
                return [4 /*yield*/, setup(configureAuth_registersBasicCredentialAsSecret)];
                case 1:
                    // Arrange
                    _a.sent();
                    expect(settings.authToken).toBeTruthy(); // sanity check
                    authHelper = gitAuthHelper.createAuthHelper(git, settings);
                    // Act
                    return [4 /*yield*/, authHelper.configureAuth()
                        // Assert secret
                    ];
                case 2:
                    // Act
                    _a.sent();
                    setSecretSpy = core.setSecret;
                    expect(setSecretSpy).toHaveBeenCalledTimes(1);
                    expectedSecret = Buffer.from("x-access-token:" + settings.authToken, 'utf8').toString('base64');
                    expect(setSecretSpy).toHaveBeenCalledWith(expectedSecret);
                    return [2 /*return*/];
            }
        });
    }); });
    var setsSshCommandEnvVarWhenPersistCredentialsFalse = 'sets SSH command env var when persist-credentials false';
    it(setsSshCommandEnvVarWhenPersistCredentialsFalse, function () { return __awaiter(void 0, void 0, void 0, function () {
        var authHelper, actualKeyPath, actualKnownHostsPath, expectedSshCommand, gitConfigLines;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!sshPath) {
                        process.stdout.write("Skipped test \"" + setsSshCommandEnvVarWhenPersistCredentialsFalse + "\". Executable 'ssh' not found in the PATH.\n");
                        return [2 /*return*/];
                    }
                    // Arrange
                    return [4 /*yield*/, setup(setsSshCommandEnvVarWhenPersistCredentialsFalse)];
                case 1:
                    // Arrange
                    _a.sent();
                    settings.persistCredentials = false;
                    authHelper = gitAuthHelper.createAuthHelper(git, settings);
                    // Act
                    return [4 /*yield*/, authHelper.configureAuth()
                        // Assert git env var
                    ];
                case 2:
                    // Act
                    _a.sent();
                    return [4 /*yield*/, getActualSshKeyPath()];
                case 3:
                    actualKeyPath = _a.sent();
                    return [4 /*yield*/, getActualSshKnownHostsPath()];
                case 4:
                    actualKnownHostsPath = _a.sent();
                    expectedSshCommand = "\"" + sshPath + "\" -i \"$RUNNER_TEMP/" + path.basename(actualKeyPath) + "\" -o StrictHostKeyChecking=yes -o CheckHostIP=no -o \"UserKnownHostsFile=$RUNNER_TEMP/" + path.basename(actualKnownHostsPath) + "\"";
                    expect(git.setEnvironmentVariable).toHaveBeenCalledWith('GIT_SSH_COMMAND', expectedSshCommand);
                    return [4 /*yield*/, fs.promises.readFile(localGitConfigPath)];
                case 5:
                    gitConfigLines = (_a.sent())
                        .toString()
                        .split('\n')
                        .filter(function (x) { return x; });
                    expect(gitConfigLines).toHaveLength(1);
                    expect(gitConfigLines[0]).toMatch(/^http\./);
                    return [2 /*return*/];
            }
        });
    }); });
    var configureAuth_setsSshCommandWhenPersistCredentialsTrue = 'sets SSH command when persist-credentials true';
    it(configureAuth_setsSshCommandWhenPersistCredentialsTrue, function () { return __awaiter(void 0, void 0, void 0, function () {
        var authHelper, actualKeyPath, actualKnownHostsPath, expectedSshCommand;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!sshPath) {
                        process.stdout.write("Skipped test \"" + configureAuth_setsSshCommandWhenPersistCredentialsTrue + "\". Executable 'ssh' not found in the PATH.\n");
                        return [2 /*return*/];
                    }
                    // Arrange
                    return [4 /*yield*/, setup(configureAuth_setsSshCommandWhenPersistCredentialsTrue)];
                case 1:
                    // Arrange
                    _a.sent();
                    authHelper = gitAuthHelper.createAuthHelper(git, settings);
                    // Act
                    return [4 /*yield*/, authHelper.configureAuth()
                        // Assert git env var
                    ];
                case 2:
                    // Act
                    _a.sent();
                    return [4 /*yield*/, getActualSshKeyPath()];
                case 3:
                    actualKeyPath = _a.sent();
                    return [4 /*yield*/, getActualSshKnownHostsPath()];
                case 4:
                    actualKnownHostsPath = _a.sent();
                    expectedSshCommand = "\"" + sshPath + "\" -i \"$RUNNER_TEMP/" + path.basename(actualKeyPath) + "\" -o StrictHostKeyChecking=yes -o CheckHostIP=no -o \"UserKnownHostsFile=$RUNNER_TEMP/" + path.basename(actualKnownHostsPath) + "\"";
                    expect(git.setEnvironmentVariable).toHaveBeenCalledWith('GIT_SSH_COMMAND', expectedSshCommand);
                    // Asserty git config
                    expect(git.config).toHaveBeenCalledWith('core.sshCommand', expectedSshCommand);
                    return [2 /*return*/];
            }
        });
    }); });
    var configureAuth_writesExplicitKnownHosts = 'writes explicit known hosts';
    it(configureAuth_writesExplicitKnownHosts, function () { return __awaiter(void 0, void 0, void 0, function () {
        var authHelper, actualSshKnownHostsPath, actualSshKnownHostsContent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!sshPath) {
                        process.stdout.write("Skipped test \"" + configureAuth_writesExplicitKnownHosts + "\". Executable 'ssh' not found in the PATH.\n");
                        return [2 /*return*/];
                    }
                    // Arrange
                    return [4 /*yield*/, setup(configureAuth_writesExplicitKnownHosts)];
                case 1:
                    // Arrange
                    _a.sent();
                    expect(settings.sshKey).toBeTruthy(); // sanity check
                    settings.sshKnownHosts = 'my-custom-host.com ssh-rsa ABC123';
                    authHelper = gitAuthHelper.createAuthHelper(git, settings);
                    // Act
                    return [4 /*yield*/, authHelper.configureAuth()
                        // Assert known hosts
                    ];
                case 2:
                    // Act
                    _a.sent();
                    return [4 /*yield*/, getActualSshKnownHostsPath()];
                case 3:
                    actualSshKnownHostsPath = _a.sent();
                    return [4 /*yield*/, fs.promises.readFile(actualSshKnownHostsPath)];
                case 4:
                    actualSshKnownHostsContent = (_a.sent()).toString();
                    expect(actualSshKnownHostsContent).toMatch(/my-custom-host\.com ssh-rsa ABC123/);
                    expect(actualSshKnownHostsContent).toMatch(/github\.com ssh-rsa AAAAB3N/);
                    return [2 /*return*/];
            }
        });
    }); });
    var configureAuth_writesSshKeyAndImplicitKnownHosts = 'writes SSH key and implicit known hosts';
    it(configureAuth_writesSshKeyAndImplicitKnownHosts, function () { return __awaiter(void 0, void 0, void 0, function () {
        var authHelper, actualSshKeyPath, actualSshKeyContent, _a, actualSshKnownHostsPath, actualSshKnownHostsContent;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!sshPath) {
                        process.stdout.write("Skipped test \"" + configureAuth_writesSshKeyAndImplicitKnownHosts + "\". Executable 'ssh' not found in the PATH.\n");
                        return [2 /*return*/];
                    }
                    // Arrange
                    return [4 /*yield*/, setup(configureAuth_writesSshKeyAndImplicitKnownHosts)];
                case 1:
                    // Arrange
                    _b.sent();
                    expect(settings.sshKey).toBeTruthy(); // sanity check
                    authHelper = gitAuthHelper.createAuthHelper(git, settings);
                    // Act
                    return [4 /*yield*/, authHelper.configureAuth()
                        // Assert SSH key
                    ];
                case 2:
                    // Act
                    _b.sent();
                    return [4 /*yield*/, getActualSshKeyPath()];
                case 3:
                    actualSshKeyPath = _b.sent();
                    expect(actualSshKeyPath).toBeTruthy();
                    return [4 /*yield*/, fs.promises.readFile(actualSshKeyPath)];
                case 4:
                    actualSshKeyContent = (_b.sent()).toString();
                    expect(actualSshKeyContent).toBe(settings.sshKey + '\n');
                    if (!!isWindows) return [3 /*break*/, 6];
                    // Assert read/write for user, not group or others.
                    // Otherwise SSH client will error.
                    _a = expect;
                    return [4 /*yield*/, fs.promises.stat(actualSshKeyPath)];
                case 5:
                    // Assert read/write for user, not group or others.
                    // Otherwise SSH client will error.
                    _a.apply(void 0, [(_b.sent()).mode & 511]).toBe(384);
                    _b.label = 6;
                case 6: return [4 /*yield*/, getActualSshKnownHostsPath()];
                case 7:
                    actualSshKnownHostsPath = _b.sent();
                    return [4 /*yield*/, fs.promises.readFile(actualSshKnownHostsPath)];
                case 8:
                    actualSshKnownHostsContent = (_b.sent()).toString();
                    expect(actualSshKnownHostsContent).toMatch(/github\.com ssh-rsa AAAAB3N/);
                    return [2 /*return*/];
            }
        });
    }); });
    var configureGlobalAuth_configuresUrlInsteadOfWhenSshKeyNotSet = 'configureGlobalAuth configures URL insteadOf when SSH key not set';
    it(configureGlobalAuth_configuresUrlInsteadOfWhenSshKeyNotSet, function () { return __awaiter(void 0, void 0, void 0, function () {
        var authHelper, configContent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                // Arrange
                return [4 /*yield*/, setup(configureGlobalAuth_configuresUrlInsteadOfWhenSshKeyNotSet)];
                case 1:
                    // Arrange
                    _a.sent();
                    settings.sshKey = '';
                    authHelper = gitAuthHelper.createAuthHelper(git, settings);
                    // Act
                    return [4 /*yield*/, authHelper.configureAuth()];
                case 2:
                    // Act
                    _a.sent();
                    return [4 /*yield*/, authHelper.configureGlobalAuth()
                        // Assert temporary global config
                    ];
                case 3:
                    _a.sent();
                    // Assert temporary global config
                    expect(git.env['HOME']).toBeTruthy();
                    return [4 /*yield*/, fs.promises.readFile(path.join(git.env['HOME'], '.gitconfig'))];
                case 4:
                    configContent = (_a.sent()).toString();
                    expect(configContent.indexOf("url.https://github.com/.insteadOf git@github.com")).toBeGreaterThanOrEqual(0);
                    return [2 /*return*/];
            }
        });
    }); });
    var configureGlobalAuth_copiesGlobalGitConfig = 'configureGlobalAuth copies global git config';
    it(configureGlobalAuth_copiesGlobalGitConfig, function () { return __awaiter(void 0, void 0, void 0, function () {
        var authHelper, configContent, basicCredential;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                // Arrange
                return [4 /*yield*/, setup(configureGlobalAuth_copiesGlobalGitConfig)];
                case 1:
                    // Arrange
                    _a.sent();
                    return [4 /*yield*/, fs.promises.writeFile(globalGitConfigPath, 'value-from-global-config')];
                case 2:
                    _a.sent();
                    authHelper = gitAuthHelper.createAuthHelper(git, settings);
                    // Act
                    return [4 /*yield*/, authHelper.configureAuth()];
                case 3:
                    // Act
                    _a.sent();
                    return [4 /*yield*/, authHelper.configureGlobalAuth()
                        // Assert original global config not altered
                    ];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, fs.promises.readFile(globalGitConfigPath)];
                case 5:
                    configContent = (_a.sent()).toString();
                    expect(configContent).toBe('value-from-global-config');
                    // Assert temporary global config
                    expect(git.env['HOME']).toBeTruthy();
                    basicCredential = Buffer.from("x-access-token:" + settings.authToken, 'utf8').toString('base64');
                    return [4 /*yield*/, fs.promises.readFile(path.join(git.env['HOME'], '.gitconfig'))];
                case 6:
                    configContent = (_a.sent()).toString();
                    expect(configContent.indexOf('value-from-global-config')).toBeGreaterThanOrEqual(0);
                    expect(configContent.indexOf("http.https://github.com/.extraheader AUTHORIZATION: basic " + basicCredential)).toBeGreaterThanOrEqual(0);
                    return [2 /*return*/];
            }
        });
    }); });
    var configureGlobalAuth_createsNewGlobalGitConfigWhenGlobalDoesNotExist = 'configureGlobalAuth creates new git config when global does not exist';
    it(configureGlobalAuth_createsNewGlobalGitConfigWhenGlobalDoesNotExist, function () { return __awaiter(void 0, void 0, void 0, function () {
        var authHelper, err_1, basicCredential, configContent;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                // Arrange
                return [4 /*yield*/, setup(configureGlobalAuth_createsNewGlobalGitConfigWhenGlobalDoesNotExist)];
                case 1:
                    // Arrange
                    _b.sent();
                    return [4 /*yield*/, io.rmRF(globalGitConfigPath)];
                case 2:
                    _b.sent();
                    authHelper = gitAuthHelper.createAuthHelper(git, settings);
                    // Act
                    return [4 /*yield*/, authHelper.configureAuth()];
                case 3:
                    // Act
                    _b.sent();
                    return [4 /*yield*/, authHelper.configureGlobalAuth()
                        // Assert original global config not recreated
                    ];
                case 4:
                    _b.sent();
                    _b.label = 5;
                case 5:
                    _b.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, fs.promises.stat(globalGitConfigPath)];
                case 6:
                    _b.sent();
                    throw new Error("Did not expect file to exist: '" + globalGitConfigPath + "'");
                case 7:
                    err_1 = _b.sent();
                    if (((_a = err_1) === null || _a === void 0 ? void 0 : _a.code) !== 'ENOENT') {
                        throw err_1;
                    }
                    return [3 /*break*/, 8];
                case 8:
                    // Assert temporary global config
                    expect(git.env['HOME']).toBeTruthy();
                    basicCredential = Buffer.from("x-access-token:" + settings.authToken, 'utf8').toString('base64');
                    return [4 /*yield*/, fs.promises.readFile(path.join(git.env['HOME'], '.gitconfig'))];
                case 9:
                    configContent = (_b.sent()).toString();
                    expect(configContent.indexOf("http.https://github.com/.extraheader AUTHORIZATION: basic " + basicCredential)).toBeGreaterThanOrEqual(0);
                    return [2 /*return*/];
            }
        });
    }); });
    var configureSubmoduleAuth_configuresSubmodulesWhenPersistCredentialsFalseAndSshKeyNotSet = 'configureSubmoduleAuth configures submodules when persist credentials false and SSH key not set';
    it(configureSubmoduleAuth_configuresSubmodulesWhenPersistCredentialsFalseAndSshKeyNotSet, function () { return __awaiter(void 0, void 0, void 0, function () {
        var authHelper, mockSubmoduleForeach;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                // Arrange
                return [4 /*yield*/, setup(configureSubmoduleAuth_configuresSubmodulesWhenPersistCredentialsFalseAndSshKeyNotSet)];
                case 1:
                    // Arrange
                    _a.sent();
                    settings.persistCredentials = false;
                    settings.sshKey = '';
                    authHelper = gitAuthHelper.createAuthHelper(git, settings);
                    return [4 /*yield*/, authHelper.configureAuth()];
                case 2:
                    _a.sent();
                    mockSubmoduleForeach = git.submoduleForeach;
                    mockSubmoduleForeach.mockClear(); // reset calls
                    // Act
                    return [4 /*yield*/, authHelper.configureSubmoduleAuth()
                        // Assert
                    ];
                case 3:
                    // Act
                    _a.sent();
                    // Assert
                    expect(mockSubmoduleForeach).toBeCalledTimes(1);
                    expect(mockSubmoduleForeach.mock.calls[0][0]).toMatch(/unset-all.*insteadOf/);
                    return [2 /*return*/];
            }
        });
    }); });
    var configureSubmoduleAuth_configuresSubmodulesWhenPersistCredentialsFalseAndSshKeySet = 'configureSubmoduleAuth configures submodules when persist credentials false and SSH key set';
    it(configureSubmoduleAuth_configuresSubmodulesWhenPersistCredentialsFalseAndSshKeySet, function () { return __awaiter(void 0, void 0, void 0, function () {
        var authHelper, mockSubmoduleForeach;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!sshPath) {
                        process.stdout.write("Skipped test \"" + configureSubmoduleAuth_configuresSubmodulesWhenPersistCredentialsFalseAndSshKeySet + "\". Executable 'ssh' not found in the PATH.\n");
                        return [2 /*return*/];
                    }
                    // Arrange
                    return [4 /*yield*/, setup(configureSubmoduleAuth_configuresSubmodulesWhenPersistCredentialsFalseAndSshKeySet)];
                case 1:
                    // Arrange
                    _a.sent();
                    settings.persistCredentials = false;
                    authHelper = gitAuthHelper.createAuthHelper(git, settings);
                    return [4 /*yield*/, authHelper.configureAuth()];
                case 2:
                    _a.sent();
                    mockSubmoduleForeach = git.submoduleForeach;
                    mockSubmoduleForeach.mockClear(); // reset calls
                    // Act
                    return [4 /*yield*/, authHelper.configureSubmoduleAuth()
                        // Assert
                    ];
                case 3:
                    // Act
                    _a.sent();
                    // Assert
                    expect(mockSubmoduleForeach).toHaveBeenCalledTimes(1);
                    expect(mockSubmoduleForeach.mock.calls[0][0]).toMatch(/unset-all.*insteadOf/);
                    return [2 /*return*/];
            }
        });
    }); });
    var configureSubmoduleAuth_configuresSubmodulesWhenPersistCredentialsTrueAndSshKeyNotSet = 'configureSubmoduleAuth configures submodules when persist credentials true and SSH key not set';
    it(configureSubmoduleAuth_configuresSubmodulesWhenPersistCredentialsTrueAndSshKeyNotSet, function () { return __awaiter(void 0, void 0, void 0, function () {
        var authHelper, mockSubmoduleForeach;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                // Arrange
                return [4 /*yield*/, setup(configureSubmoduleAuth_configuresSubmodulesWhenPersistCredentialsTrueAndSshKeyNotSet)];
                case 1:
                    // Arrange
                    _a.sent();
                    settings.sshKey = '';
                    authHelper = gitAuthHelper.createAuthHelper(git, settings);
                    return [4 /*yield*/, authHelper.configureAuth()];
                case 2:
                    _a.sent();
                    mockSubmoduleForeach = git.submoduleForeach;
                    mockSubmoduleForeach.mockClear(); // reset calls
                    // Act
                    return [4 /*yield*/, authHelper.configureSubmoduleAuth()
                        // Assert
                    ];
                case 3:
                    // Act
                    _a.sent();
                    // Assert
                    expect(mockSubmoduleForeach).toHaveBeenCalledTimes(4);
                    expect(mockSubmoduleForeach.mock.calls[0][0]).toMatch(/unset-all.*insteadOf/);
                    expect(mockSubmoduleForeach.mock.calls[1][0]).toMatch(/http.*extraheader/);
                    expect(mockSubmoduleForeach.mock.calls[2][0]).toMatch(/url.*insteadOf.*git@github.com:/);
                    expect(mockSubmoduleForeach.mock.calls[3][0]).toMatch(/url.*insteadOf.*org-123456@github.com:/);
                    return [2 /*return*/];
            }
        });
    }); });
    var configureSubmoduleAuth_configuresSubmodulesWhenPersistCredentialsTrueAndSshKeySet = 'configureSubmoduleAuth configures submodules when persist credentials true and SSH key set';
    it(configureSubmoduleAuth_configuresSubmodulesWhenPersistCredentialsTrueAndSshKeySet, function () { return __awaiter(void 0, void 0, void 0, function () {
        var authHelper, mockSubmoduleForeach;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!sshPath) {
                        process.stdout.write("Skipped test \"" + configureSubmoduleAuth_configuresSubmodulesWhenPersistCredentialsTrueAndSshKeySet + "\". Executable 'ssh' not found in the PATH.\n");
                        return [2 /*return*/];
                    }
                    // Arrange
                    return [4 /*yield*/, setup(configureSubmoduleAuth_configuresSubmodulesWhenPersistCredentialsTrueAndSshKeySet)];
                case 1:
                    // Arrange
                    _a.sent();
                    authHelper = gitAuthHelper.createAuthHelper(git, settings);
                    return [4 /*yield*/, authHelper.configureAuth()];
                case 2:
                    _a.sent();
                    mockSubmoduleForeach = git.submoduleForeach;
                    mockSubmoduleForeach.mockClear(); // reset calls
                    // Act
                    return [4 /*yield*/, authHelper.configureSubmoduleAuth()
                        // Assert
                    ];
                case 3:
                    // Act
                    _a.sent();
                    // Assert
                    expect(mockSubmoduleForeach).toHaveBeenCalledTimes(3);
                    expect(mockSubmoduleForeach.mock.calls[0][0]).toMatch(/unset-all.*insteadOf/);
                    expect(mockSubmoduleForeach.mock.calls[1][0]).toMatch(/http.*extraheader/);
                    expect(mockSubmoduleForeach.mock.calls[2][0]).toMatch(/core\.sshCommand/);
                    return [2 /*return*/];
            }
        });
    }); });
    var removeAuth_removesSshCommand = 'removeAuth removes SSH command';
    it(removeAuth_removesSshCommand, function () { return __awaiter(void 0, void 0, void 0, function () {
        var authHelper, gitConfigContent, actualKeyPath, actualKnownHostsPath, err_2, err_3;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!sshPath) {
                        process.stdout.write("Skipped test \"" + removeAuth_removesSshCommand + "\". Executable 'ssh' not found in the PATH.\n");
                        return [2 /*return*/];
                    }
                    // Arrange
                    return [4 /*yield*/, setup(removeAuth_removesSshCommand)];
                case 1:
                    // Arrange
                    _c.sent();
                    authHelper = gitAuthHelper.createAuthHelper(git, settings);
                    return [4 /*yield*/, authHelper.configureAuth()];
                case 2:
                    _c.sent();
                    return [4 /*yield*/, fs.promises.readFile(localGitConfigPath)];
                case 3:
                    gitConfigContent = (_c.sent()).toString();
                    expect(gitConfigContent.indexOf('core.sshCommand')).toBeGreaterThanOrEqual(0); // sanity check
                    return [4 /*yield*/, getActualSshKeyPath()];
                case 4:
                    actualKeyPath = _c.sent();
                    expect(actualKeyPath).toBeTruthy();
                    return [4 /*yield*/, fs.promises.stat(actualKeyPath)];
                case 5:
                    _c.sent();
                    return [4 /*yield*/, getActualSshKnownHostsPath()];
                case 6:
                    actualKnownHostsPath = _c.sent();
                    expect(actualKnownHostsPath).toBeTruthy();
                    return [4 /*yield*/, fs.promises.stat(actualKnownHostsPath)
                        // Act
                    ];
                case 7:
                    _c.sent();
                    // Act
                    return [4 /*yield*/, authHelper.removeAuth()
                        // Assert git config
                    ];
                case 8:
                    // Act
                    _c.sent();
                    return [4 /*yield*/, fs.promises.readFile(localGitConfigPath)];
                case 9:
                    // Assert git config
                    gitConfigContent = (_c.sent()).toString();
                    expect(gitConfigContent.indexOf('core.sshCommand')).toBeLessThan(0);
                    _c.label = 10;
                case 10:
                    _c.trys.push([10, 12, , 13]);
                    return [4 /*yield*/, fs.promises.stat(actualKeyPath)];
                case 11:
                    _c.sent();
                    throw new Error('SSH key should have been deleted');
                case 12:
                    err_2 = _c.sent();
                    if (((_a = err_2) === null || _a === void 0 ? void 0 : _a.code) !== 'ENOENT') {
                        throw err_2;
                    }
                    return [3 /*break*/, 13];
                case 13:
                    _c.trys.push([13, 15, , 16]);
                    return [4 /*yield*/, fs.promises.stat(actualKnownHostsPath)];
                case 14:
                    _c.sent();
                    throw new Error('SSH known hosts should have been deleted');
                case 15:
                    err_3 = _c.sent();
                    if (((_b = err_3) === null || _b === void 0 ? void 0 : _b.code) !== 'ENOENT') {
                        throw err_3;
                    }
                    return [3 /*break*/, 16];
                case 16: return [2 /*return*/];
            }
        });
    }); });
    var removeAuth_removesToken = 'removeAuth removes token';
    it(removeAuth_removesToken, function () { return __awaiter(void 0, void 0, void 0, function () {
        var authHelper, gitConfigContent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                // Arrange
                return [4 /*yield*/, setup(removeAuth_removesToken)];
                case 1:
                    // Arrange
                    _a.sent();
                    authHelper = gitAuthHelper.createAuthHelper(git, settings);
                    return [4 /*yield*/, authHelper.configureAuth()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, fs.promises.readFile(localGitConfigPath)];
                case 3:
                    gitConfigContent = (_a.sent()).toString();
                    expect(gitConfigContent.indexOf('http.')).toBeGreaterThanOrEqual(0); // sanity check
                    // Act
                    return [4 /*yield*/, authHelper.removeAuth()
                        // Assert git config
                    ];
                case 4:
                    // Act
                    _a.sent();
                    return [4 /*yield*/, fs.promises.readFile(localGitConfigPath)];
                case 5:
                    // Assert git config
                    gitConfigContent = (_a.sent()).toString();
                    expect(gitConfigContent.indexOf('http.')).toBeLessThan(0);
                    return [2 /*return*/];
            }
        });
    }); });
    var removeGlobalConfig_removesOverride = 'removeGlobalConfig removes override';
    it(removeGlobalConfig_removesOverride, function () { return __awaiter(void 0, void 0, void 0, function () {
        var authHelper, homeOverride, err_4;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                // Arrange
                return [4 /*yield*/, setup(removeGlobalConfig_removesOverride)];
                case 1:
                    // Arrange
                    _b.sent();
                    authHelper = gitAuthHelper.createAuthHelper(git, settings);
                    return [4 /*yield*/, authHelper.configureAuth()];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, authHelper.configureGlobalAuth()];
                case 3:
                    _b.sent();
                    homeOverride = git.env['HOME'] // Sanity check
                    ;
                    expect(homeOverride).toBeTruthy();
                    return [4 /*yield*/, fs.promises.stat(path.join(git.env['HOME'], '.gitconfig'))
                        // Act
                    ];
                case 4:
                    _b.sent();
                    // Act
                    return [4 /*yield*/, authHelper.removeGlobalConfig()
                        // Assert
                    ];
                case 5:
                    // Act
                    _b.sent();
                    // Assert
                    expect(git.env['HOME']).toBeUndefined();
                    _b.label = 6;
                case 6:
                    _b.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, fs.promises.stat(homeOverride)];
                case 7:
                    _b.sent();
                    throw new Error("Should have been deleted '" + homeOverride + "'");
                case 8:
                    err_4 = _b.sent();
                    if (((_a = err_4) === null || _a === void 0 ? void 0 : _a.code) !== 'ENOENT') {
                        throw err_4;
                    }
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    }); });
});
function setup(testName) {
    return __awaiter(this, void 0, Promise, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    testName = testName.replace(/[^a-zA-Z0-9_]+/g, '-');
                    // Directories
                    workspace = path.join(testWorkspace, testName, 'workspace');
                    runnerTemp = path.join(testWorkspace, testName, 'runner-temp');
                    tempHomedir = path.join(testWorkspace, testName, 'home-dir');
                    return [4 /*yield*/, fs.promises.mkdir(workspace, { recursive: true })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, fs.promises.mkdir(runnerTemp, { recursive: true })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, fs.promises.mkdir(tempHomedir, { recursive: true })];
                case 3:
                    _a.sent();
                    process.env['RUNNER_TEMP'] = runnerTemp;
                    process.env['HOME'] = tempHomedir;
                    // Create git config
                    globalGitConfigPath = path.join(tempHomedir, '.gitconfig');
                    return [4 /*yield*/, fs.promises.writeFile(globalGitConfigPath, '')];
                case 4:
                    _a.sent();
                    localGitConfigPath = path.join(workspace, '.git', 'config');
                    return [4 /*yield*/, fs.promises.mkdir(path.dirname(localGitConfigPath), { recursive: true })];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, fs.promises.writeFile(localGitConfigPath, '')];
                case 6:
                    _a.sent();
                    git = {
                        branchDelete: jest.fn(),
                        branchExists: jest.fn(),
                        branchList: jest.fn(),
                        checkout: jest.fn(),
                        checkoutDetach: jest.fn(),
                        config: jest.fn(function (key, value, globalConfig) { return __awaiter(_this, void 0, void 0, function () {
                            var configPath;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        configPath = globalConfig
                                            ? path.join(git.env['HOME'] || tempHomedir, '.gitconfig')
                                            : localGitConfigPath;
                                        return [4 /*yield*/, fs.promises.appendFile(configPath, "\n" + key + " " + value)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }),
                        configExists: jest.fn(function (key, globalConfig) { return __awaiter(_this, void 0, Promise, function () {
                            var configPath, content, lines;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        configPath = globalConfig
                                            ? path.join(git.env['HOME'] || tempHomedir, '.gitconfig')
                                            : localGitConfigPath;
                                        return [4 /*yield*/, fs.promises.readFile(configPath)];
                                    case 1:
                                        content = _a.sent();
                                        lines = content
                                            .toString()
                                            .split('\n')
                                            .filter(function (x) { return x; });
                                        return [2 /*return*/, lines.some(function (x) { return x.startsWith(key); })];
                                }
                            });
                        }); }),
                        env: {},
                        fetch: jest.fn(),
                        getDefaultBranch: jest.fn(),
                        getWorkingDirectory: jest.fn(function () { return workspace; }),
                        init: jest.fn(),
                        isDetached: jest.fn(),
                        lfsFetch: jest.fn(),
                        lfsInstall: jest.fn(),
                        log1: jest.fn(),
                        remoteAdd: jest.fn(),
                        removeEnvironmentVariable: jest.fn(function (name) { return delete git.env[name]; }),
                        revParse: jest.fn(),
                        setEnvironmentVariable: jest.fn(function (name, value) {
                            git.env[name] = value;
                        }),
                        shaExists: jest.fn(),
                        submoduleForeach: jest.fn(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, ''];
                            });
                        }); }),
                        submoduleSync: jest.fn(),
                        submoduleUpdate: jest.fn(),
                        tagExists: jest.fn(),
                        tryClean: jest.fn(),
                        tryConfigUnset: jest.fn(function (key, globalConfig) { return __awaiter(_this, void 0, Promise, function () {
                            var configPath, content, lines;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        configPath = globalConfig
                                            ? path.join(git.env['HOME'] || tempHomedir, '.gitconfig')
                                            : localGitConfigPath;
                                        return [4 /*yield*/, fs.promises.readFile(configPath)];
                                    case 1:
                                        content = _a.sent();
                                        lines = content
                                            .toString()
                                            .split('\n')
                                            .filter(function (x) { return x; })
                                            .filter(function (x) { return !x.startsWith(key); });
                                        return [4 /*yield*/, fs.promises.writeFile(configPath, lines.join('\n'))];
                                    case 2:
                                        _a.sent();
                                        return [2 /*return*/, true];
                                }
                            });
                        }); }),
                        tryDisableAutomaticGarbageCollection: jest.fn(),
                        tryGetFetchUrl: jest.fn(),
                        tryReset: jest.fn()
                    };
                    settings = {
                        authToken: 'some auth token',
                        clean: true,
                        commit: '',
                        fetchDepth: 1,
                        lfs: false,
                        submodules: false,
                        nestedSubmodules: false,
                        persistCredentials: true,
                        ref: 'refs/heads/main',
                        repositoryName: 'my-repo',
                        repositoryOwner: 'my-org',
                        repositoryPath: '',
                        sshKey: sshPath ? 'some ssh private key' : '',
                        sshKnownHosts: '',
                        sshStrict: true,
                        workflowOrganizationId: 123456,
                        setSafeDirectory: true,
                        githubServerUrl: githubServerUrl
                    };
                    return [2 /*return*/];
            }
        });
    });
}
function getActualSshKeyPath() {
    return __awaiter(this, void 0, Promise, function () {
        var actualTempFiles;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs.promises.readdir(runnerTemp)];
                case 1:
                    actualTempFiles = (_a.sent())
                        .sort()
                        .map(function (x) { return path.join(runnerTemp, x); });
                    if (actualTempFiles.length === 0) {
                        return [2 /*return*/, ''];
                    }
                    expect(actualTempFiles).toHaveLength(2);
                    expect(actualTempFiles[0].endsWith('_known_hosts')).toBeFalsy();
                    return [2 /*return*/, actualTempFiles[0]];
            }
        });
    });
}
function getActualSshKnownHostsPath() {
    return __awaiter(this, void 0, Promise, function () {
        var actualTempFiles;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs.promises.readdir(runnerTemp)];
                case 1:
                    actualTempFiles = (_a.sent())
                        .sort()
                        .map(function (x) { return path.join(runnerTemp, x); });
                    if (actualTempFiles.length === 0) {
                        return [2 /*return*/, ''];
                    }
                    expect(actualTempFiles).toHaveLength(2);
                    expect(actualTempFiles[1].endsWith('_known_hosts')).toBeTruthy();
                    expect(actualTempFiles[1].startsWith(actualTempFiles[0])).toBeTruthy();
                    return [2 /*return*/, actualTempFiles[1]];
            }
        });
    });
}
